import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BasicSelectionType } from '../../../selection/selection-logic/element-selected-type';
import { MouseTracking } from '../../../selection/selection-logic/mouse-tracking';
import * as Util from '../../../selection/selection-logic/selection-logic-util';
import { PostAction, UndoRedoService } from '../../../undo-redo/undo-redo.service';
import { ColorService } from '../../color/color.service';
import { MathService } from '../../mathematics/tool.math-service.service';
import {
  BackGroundProperties, StrokeProperties
} from '../../shape/common/abstract-shape';
import { Point } from '../../shape/common/point';
import { Rectangle } from '../../shape/common/rectangle';
import { ToolLogicDirective } from '../../tool-logic/tool-logic.directive';
import { EraserService } from '../eraser.service';

export const ERASER_CONSTANTS = {
  MAX_RGB: 255,
  // tslint:disable-next-line: no-magic-numbers
  MAX_DIFFERENCE: 255 * 255 * 3,
  FACTOR: 50,
  TOLERANCE: 0.05,
  RED: 'rgba(255, 0, 0, 1)',
  RED_TRANSPARENT: 'rgba(255, 0, 0, 0.7)',
  FILL_COLOR: 'white',
  STROKE_WIDTH: '2',
  PIXEL_INCREMENT: 3
};

@Component({
  selector: 'app-eraser-logic',
  template: ''
})
export class EraserLogicComponent
  extends ToolLogicDirective implements OnInit, OnDestroy {

  private mouse: MouseTracking;
  private eraser: SVGRectElement;
  private allListeners: (() => void)[];
  private markedElements: Map<SVGElement, [boolean, string]>;
  private elementsDeletedInDrag: boolean;
  private lastestMousePosition: Point;
  private handlers: Map<string, Util.MouseEventCallBack>;

  constructor(private renderer: Renderer2,
              private service: EraserService,
              private colorService: ColorService,
              private undoRedoService: UndoRedoService) {
    super();
    this.eraser = this.renderer.createElement('rect', this.svgNS);
    this.allListeners = [];
    const fakePoint = new Point(0, 0);
    this.mouse = {
      startPoint: fakePoint, currentPoint: fakePoint, endPoint: fakePoint,
      mouseIsDown: false, selectedElement: BasicSelectionType.NOTHING,
      onDrag: false, onResize: false
    };
    this.markedElements = new Map();
    this.undoRedoService.resetActions();
    const postAction: PostAction = {
      functionDefined: true,
      function: () => {
        this.restoreMarkedElements();
        this.markElementsInZone(this.lastestMousePosition.x,
          this.lastestMousePosition.y);
      }
    };
    this.undoRedoService.setPostUndoAction(postAction);
    this.undoRedoService.setPostRedoAction(postAction);
    this.initialiseHandlers();
  }

  private initialiseHandlers(): void {
    this.handlers = new Map<string, Util.MouseEventCallBack>([
      ['mousedown', ($event: MouseEvent) => {
        if ($event.button !== 0) {
          return ;
        }
        this.mouse.startPoint = new Point($event.offsetX, $event.offsetY);
        this.mouse.mouseIsDown = true;
        this.elementsDeletedInDrag = false;
      }],
      ['mousemove', ($event: MouseEvent) => {
        this.restoreMarkedElements();
        const selectedElements = this.markElementsInZone($event.x, $event.y);
        this.mouse.currentPoint = new Point($event.offsetX, $event.offsetY);
        this.lastestMousePosition = new Point($event.x, $event.y);
        if (this.mouse.mouseIsDown) {
          this.deleteAll(selectedElements);
          if (selectedElements.size !== 0) {
            this.elementsDeletedInDrag = true;
          }
        }
        this.drawEraser();
      }],
      ['mouseup', ($event: MouseEvent) => {
        if ($event.button !== 0) {
          return;
        }
        this.mouse.mouseIsDown = false;
        this.mouse.endPoint = new Point($event.offsetX, $event.offsetY);
        if (this.mouse.startPoint.equals(this.mouse.endPoint)) {
          this.restoreMarkedElements();
          const marked = this.findElementsInZone($event.x, $event.y);
          if (marked.size !== 0) {
            this.deleteAll(marked);
            this.undoRedoService.saveState();
          }
        } else if (this.elementsDeletedInDrag) {
          this.restoreMarkedElements();
          this.undoRedoService.saveState();
        }
      }],
      ['mouseleave', () => {
        this.hideEraser();
        this.restoreMarkedElements();
        this.mouse.mouseIsDown = false;
        if (!this.elementsDeletedInDrag) {
          return ;
        }
        this.undoRedoService.saveState();
        this.elementsDeletedInDrag = false;
      }]
    ]);
  }

  ngOnInit(): void {
    ['mousedown', 'mousemove', 'mouseup', 'mouseleave']
      .forEach((event: string) => {
        this.allListeners.push(
          this.renderer.listen(this.svgStructure.root, event,
            this.handlers.get(event) as Util.MouseEventCallBack)
        );
      });
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'none');
    this.renderer.appendChild(this.svgStructure.temporaryZone, this.eraser);
  }

  private drawEraser(): void {
    const [startPoint, endPoint] = this.getCorners();
    const rectangleObject =
      new Rectangle(this.renderer, this.eraser, new MathService());
    rectangleObject.setParameters(BackGroundProperties.FILLED,
      StrokeProperties.FILLED);
    rectangleObject.dragRectangle(startPoint, endPoint);
    rectangleObject.setCss({
      strokeWidth: ERASER_CONSTANTS.STROKE_WIDTH,
      strokeColor: ERASER_CONSTANTS.RED_TRANSPARENT,
      fillColor: ERASER_CONSTANTS.FILL_COLOR,
      opacity: '1'
    });
  }

  private hideEraser(): void {
    this.renderer.setAttribute(this.eraser, 'width', '0');
    this.renderer.setAttribute(this.eraser, 'height', '0');
  }

  private removeFill(): void {
    this.renderer.setAttribute(this.eraser, 'fill', 'none');
  }

  private addFill(): void {
    this.renderer.setAttribute(this.eraser, 'fill', ERASER_CONSTANTS.FILL_COLOR);
  }

  private markElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = this.findElementsInZone(x, y);
    this.markedElements.clear();
    selectedElements.forEach((element: SVGElement) => {
      let stroke = element.getAttribute('stroke');
      let strokeModified = ERASER_CONSTANTS.RED;
      const hasStroke = !(stroke == null || stroke === 'none');
      if (!hasStroke) {
        stroke = element.getAttribute('fill') as string;
      }
      const rgb = this.colorService.rgbFormRgba(stroke as string);
      const difference = (rgb.r - ERASER_CONSTANTS.MAX_RGB) * (rgb.r - ERASER_CONSTANTS.MAX_RGB) + rgb.g * rgb.g + rgb.b * rgb.b;
      if (difference / ERASER_CONSTANTS.MAX_DIFFERENCE < ERASER_CONSTANTS.TOLERANCE) {
        rgb.r = Math.max(0, rgb.r - ERASER_CONSTANTS.FACTOR);
        strokeModified = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
      }
      this.markedElements.set(element, [hasStroke, stroke as string]);
      this.renderer.setAttribute(
        element,
        hasStroke ? 'stroke' : 'fill',
        strokeModified
      );
    });
    return selectedElements;
  }

  private findElementsInZone(x: number, y: number): Set<SVGElement> {
    const selectedElements = new Set<SVGElement>();
    let halfSize = this.service.size / 2;
    const minHalfSize = 4;
    halfSize = Math.max(minHalfSize, halfSize);
    this.removeFill();
    for (let i = x - halfSize; i <= x + halfSize; i += ERASER_CONSTANTS.PIXEL_INCREMENT) {
      for (let j = y - halfSize; j <= y + halfSize; j += ERASER_CONSTANTS.PIXEL_INCREMENT) {
        const elementFromPoint = document.elementFromPoint(i, j);
        if (elementFromPoint == null) {
          continue ;
        }
        const element = Util.SelectionLogicUtil.getRealTarget({
          target: elementFromPoint
        } as unknown as Event);
        if (this.svgStructure.drawZone.contains(element)
          && element !== this.eraser) {
          selectedElements.add(element as SVGElement);
        }
      }
    }
    this.addFill();
    return selectedElements;
  }

  private deleteAll(elements: Set<SVGElement>): void {
    this.restoreMarkedElements();
    elements.forEach((element) => {
      element.remove();
    });
  }

  private restoreMarkedElements(): void {
    for (const entry of this.markedElements) {
      this.renderer.setAttribute(
        entry[0],
        entry[1][0] ? 'stroke' : 'fill',
        entry[1][1]
      );
    }
    this.markedElements.clear();
  }

  private getCorners(): [Point, Point] {
    const halfSize = this.service.size / 2;
    const startPoint = new Point(
      this.mouse.currentPoint.x - halfSize,
      this.mouse.currentPoint.y - halfSize,
    );
    const endPoint = new Point(
      this.mouse.currentPoint.x + halfSize,
      this.mouse.currentPoint.y + halfSize,
    );
    return [startPoint, endPoint];
  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.renderer.removeChild(this.svgStructure.temporaryZone, this.eraser);
    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'default');
    this.undoRedoService.resetActions();
  }
}

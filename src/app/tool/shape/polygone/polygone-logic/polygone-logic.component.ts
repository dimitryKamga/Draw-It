import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Point } from 'src/app/tool/shape/common/point';
import { UndoRedoService } from '../../../../undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { MathService } from '../../../mathematics/tool.math-service.service';
import { ToolLogicDirective } from '../../../tool-logic/tool-logic.directive';
import {
  BackGroundProperties,
  StrokeProperties,
  Style
} from '../../common/abstract-shape';
import { Polygone } from '../../common/polygone';
import { Rectangle } from '../../common/rectangle';
import { PolygoneService } from '../polygone.service';

enum ClickType {
  LEFT_CLICK,
}

@Component({
  selector: 'app-polygone-logic',
  template: ''
})
export class PolygoneLogicComponent extends ToolLogicDirective
  implements OnDestroy, OnInit {

  private static readonly SEMI_OPACITY: string = '0.5';
  private static readonly FULL_OPACITY: string = '1';

  private polygones: Polygone[];
  private mouseDownPoint: Point;
  private onDrag: boolean;
  private style: Style;
  private visualisationRectangle: Rectangle;
  private allListeners: (() => void)[];

  constructor(
    private readonly service: PolygoneService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
    private readonly mathService: MathService,
    private readonly undoRedoService: UndoRedoService
  ) {
    super();
    this.onDrag = false;
    this.allListeners = [];
    this.polygones = [];
    this.undoRedoService.resetActions();
    this.undoRedoService.setPreUndoAction({
      enabled: true,
      overrideDefaultBehaviour: true,
      overrideFunctionDefined: true,
      overrideFunction: () => {
        if (this.onDrag) {
          this.onMouseUp(
            new MouseEvent('mouseup', { button: 0 } as MouseEventInit)
          );
          this.getPolygone().element.remove();
        }
        this.undoRedoService.undoBase();
      }
    });
  }

  ngOnInit(): void {

    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => {
        this.initPolygone(mouseEv);
        this.initRectangle(mouseEv);
      }
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        mouseEv.preventDefault();
        if (!this.onDrag) {
          return ;
        }
        const currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        this.visualisationRectangle.dragRectangle(
          this.mouseDownPoint, currentPoint);
        this.getPolygone().drawPolygonFromRectangle(
          this.mouseDownPoint, currentPoint, this.service.thickness);
      }
    );

    const onMouseUp = this.renderer.listen(
      'document',
      'mouseup',
      (mouseEv: MouseEvent) => this.onMouseUp(mouseEv)
    );

    this.allListeners = [
      onMouseDown,
      onMouseMove,
      onMouseUp
    ];

    this.renderer.setStyle(this.svgStructure.root, 'cursor', 'crosshair');

  }

  ngOnDestroy(): void {
    this.allListeners.forEach((end) => end());
    this.undoRedoService.resetActions();
  }

  private getPolygone(): Polygone {
    return this.polygones[this.polygones.length - 1];
  }

  private onMouseUp(mouseEv: MouseEvent): void {
    const validClick = mouseEv.button === ClickType.LEFT_CLICK;
    if (!validClick || !this.onDrag) {
      return ;
    }
    this.onDrag = false;
    this.style.opacity = PolygoneLogicComponent.FULL_OPACITY;
    this.getPolygone().setCss(this.style);
    this.visualisationRectangle.element.remove();
    this.undoRedoService.saveState();
  }

  private initPolygone(mouseEv: MouseEvent): void {
    if (mouseEv.button === ClickType.LEFT_CLICK) {
      this.onDrag = true;
      this.mouseDownPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);

      const polygon = this.renderer.createElement('polygon', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, polygon);

      this.polygones.push(new Polygone(
        this.renderer,
        polygon,
        this.mathService, this.service.sides,
        this.service));
      this.setPolygoneProperties();
    }
  }

  private initRectangle(mouseEv: MouseEvent): void {
    if (mouseEv.button !== ClickType.LEFT_CLICK) {
      return ;
    }
    const rectangle = this.renderer.createElement('rect', this.svgNS);
    this.renderer.appendChild(this.svgStructure.drawZone, rectangle);

    this.visualisationRectangle = new Rectangle(
      this.renderer,
      rectangle,
      this.mathService
    );

    this.visualisationRectangle.setParameters(
      BackGroundProperties.NONE, StrokeProperties.DASHED
    );
  }

  private setPolygoneProperties(): void {
    this.style = {
      strokeWidth: this.service.thickness.toString(),
      fillColor: this.colorService.primaryColor,
      strokeColor: this.colorService.secondaryColor,
      opacity: PolygoneLogicComponent.SEMI_OPACITY
    };
    this.getPolygone().setCss(this.style);

    const backgroundProperties = this.service.fillOption ?
      BackGroundProperties.FILLED :
      BackGroundProperties.NONE;

    const strokeProperties = this.service.borderOption ?
      StrokeProperties.FILLED : StrokeProperties.NONE;

    this.getPolygone().setParameters(backgroundProperties, strokeProperties);
  }
}

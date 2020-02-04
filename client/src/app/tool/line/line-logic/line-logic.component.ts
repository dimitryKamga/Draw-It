import { Component, ElementRef, Renderer2 } from '@angular/core';

import { ColorService } from '../../color/color.service';
import { Point } from '../../tool-common classes/Point'
import { ToolLogicComponent } from '../../tool-logic/tool-logic.component';
import { LineService } from '../line.service';
import { Path } from './Path'

@Component({
  selector: 'app-line-logic',
  templateUrl: './line-logic.component.html',
  styleUrls: ['./line-logic.component.scss']
})
export class LineLogicComponent extends ToolLogicComponent {
  private paths: Path[] = [];
  private currentPathIndex = -1;
  private isNewPath = true;
  private mousePosition: Point;
  constructor(private readonly service: LineService,
              private readonly renderer: Renderer2,
              private readonly serviceColor: ColorService) {
    super();
  }
  private listeners: (() => void)[] = [];

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit() {
    const onMouseDown = this.renderer.listen(this.svgElRef.nativeElement, 'click', (mouseEv: MouseEvent) => {
      let currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
      if (this.isNewPath) {
        this.createNewPath(currentPoint)
        this.isNewPath = false;
      }
      if (mouseEv.shiftKey && !this.isNewPath) {
        currentPoint = this.getPath().getAlignedPoint(currentPoint);
      }
      this.addNewLine(currentPoint)
    });

    const onMouseMove = this.renderer.listen(this.svgElRef.nativeElement, 'mousemove', (mouseEv: MouseEvent) => {
      if (!this.isNewPath) {
        let point = this.mousePosition = new Point(mouseEv.offsetX, mouseEv.offsetY);
        if (mouseEv.shiftKey) {
          point = this.getPath().getAlignedPoint(point)
        }
        this.getPath().addTemporaryLine(point);
      }
    });
    const onMouseUp = this.renderer.listen(this.svgElRef.nativeElement, 'dblclick', (mouseEv: MouseEvent) => {
      if (!this.isNewPath) {
        let currentPoint = new Point(mouseEv.offsetX, mouseEv.offsetY);
        this.getPath().removeLastLine(); //cancel the click event
        this.getPath().removeLastLine();
        const isLessThan3pixels = this.distanceIsLessThan3Pixel(currentPoint, this.getPath().points[0])
        if (isLessThan3pixels) {
          this.getPath().closePath();
        } else {
          if (mouseEv.shiftKey) {
            currentPoint = this.getPath().getAlignedPoint(currentPoint)
          }
          this.addNewLine(currentPoint)
        }
        this.isNewPath = true;
      }
    });
    const onKeyDown = this.renderer.listen('document', 'keydown', (keyEv: KeyboardEvent) => {
      const shiftIsPressed = (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight')
      if (keyEv.code === 'Escape' && !this.isNewPath) {
        this.getPath().removePath();
        this.isNewPath = true;
      }
      if (keyEv.code === 'Backspace' && this.getPath().points.length >= 2) {
        this.getPath().removeLastLine();
        this.getPath().addTemporaryLine(this.getPath().lastPoint);
      }
      if (shiftIsPressed && !this.isNewPath) {
        const transformedPoint = this.getPath().getAlignedPoint(this.mousePosition);
        this.getPath().addTemporaryLine(transformedPoint);
      }
    });
    const onKeyUp = this.renderer.listen('document', 'keyup', (keyEv: KeyboardEvent) => {
      const shiftIsPressed = (keyEv.code === 'ShiftLeft' || keyEv.code === 'ShiftRight')
      if (shiftIsPressed && !this.isNewPath) {
        this.getPath().addTemporaryLine(this.mousePosition);
      }
    });
    this.listeners = [onMouseDown, onMouseMove, onMouseUp, onKeyUp, onKeyDown];
  }
  createNewPath(initialPoint: Point) {
    const path = this.renderer.createElement('path', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, path);
    this.paths[++this.currentPathIndex] = new Path(initialPoint, this.renderer, path, this.service.withJonction)
    this.getPath().setParameters(this.service.thickness.toString(), this.serviceColor.primaryColor);
  }
  createJonction(center: Point) {
    const circle = this.renderer.createElement('circle', this.svgNS);
    this.renderer.appendChild(this.svgElRef.nativeElement, circle);
    this.renderer.setAttribute(circle, 'fill', this.serviceColor.primaryColor);
    this.getPath().addJonction(circle, center, this.service.radius.toString());
  }
  addNewLine(currentPoint: Point) {
    this.getPath().addLine(currentPoint);
    if (this.getPath().withJonctions) {
      this.createJonction(currentPoint);
    }

  }
  distanceIsLessThan3Pixel(point1: Point, point2: Point): boolean {
    return ((Math.abs(point1.x - point2.x) <= 3) && (Math.abs(point1.y - point2.y) <= 3));
  }
  getPath(): Path {
    return this.paths[this.currentPathIndex];
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => {
      listenner();
    })
  }
}

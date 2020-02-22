import { Renderer2 } from '@angular/core';
import { MathService } from '../../mathematics/tool.math-service.service';
import { Point } from '../../selection/Point';
import { AbstractShape } from './AbstractShape'

// Class tested in ../Polygone/polygone-logic.component.spec.ts
export class Polygone extends AbstractShape {

  constructor(
    protected renderer: Renderer2,
    public element: SVGElement,
    private mathService: MathService,
    private sides: number
  ) {
      super(renderer, element);
    }

  insertPolygonInSVG(points: Point []): void {
    let atribute = '';
    for (const point of points) {
      atribute += point.x.toString() + ',' + point.y.toString() + ' ';
    }
    this.renderer.setAttribute(this.element, 'points', atribute);
  }

  drawPolygonFromRectangle(mouseDownPoint: Point, oppositePoint: Point): void {
    const dimensions = this.mathService.getRectangleSize(
      mouseDownPoint,
      oppositePoint
    );
    const upLeftCorner = this.mathService.getRectangleUpLeftCorner(
      mouseDownPoint,
      oppositePoint
    );
    const points: Point [] = this.mathService.getPolynomeCornersFromRectangle(
      mouseDownPoint, upLeftCorner, dimensions, this.sides);
    this.insertPolygonInSVG(points);
    }
}

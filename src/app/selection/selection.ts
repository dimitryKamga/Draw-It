import { Point } from '../tool/shape/common/point';
import { Offset } from './offset';
import { Zone } from './zone';

export abstract class Selection {

  protected zone: Zone;
  private svgOffset: Offset;

  constructor(svgOffset: Offset) {
    this.svgOffset = svgOffset;
  }

  protected getZone(element: SVGElement): Zone {
    const thikness = this.getThikness(element);
    const domRectangle = element.getBoundingClientRect();
    const startingPoint = new Point(
      domRectangle.left - this.svgOffset.x - thikness / 2,
      domRectangle.top - this.svgOffset.y - thikness / 2
    );
    const offsetIncrement = this.getOffsetIncrement(element);
    const endPoint = new Point(
      startingPoint.x + (domRectangle.width + thikness + offsetIncrement.x),
      startingPoint.y + (domRectangle.height + thikness + offsetIncrement.y)
    );
    return new Zone(startingPoint.x, endPoint.x, startingPoint.y, endPoint.y);
  }

  private getThikness(element: SVGElement): number {
    const strokeWidthAttribute = element.getAttribute('stroke-width');
    if (!!strokeWidthAttribute) {
      return parseInt(
        strokeWidthAttribute as string, 10
      );
    }
    const thickness = parseInt(
      element.style.strokeWidth as string, 10
    );
    return (!!thickness) ? thickness : 0;
  }

  private getOffsetIncrement(element: SVGElement): Offset {
    if ( element.classList.contains('filter1') ) {
      return {
        x: this.getThikness(element),
        y: this.getThikness(element)
      };
    }
    return  {
      x: 0,
      y: 0
    };
  }

}

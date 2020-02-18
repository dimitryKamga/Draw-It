import { Point } from './Point';

export class Zone {

  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  constructor(left: number, right: number, top: number, bottom: number) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
  }

  union(zone: Zone): Zone {
    return new Zone(
      Math.min(this.left, zone.left),
      Math.max(this.right, zone.right),
      Math.min(this.top, zone.top),
      Math.max(this.bottom, zone.bottom)
    );
  }

  intersection(zone: Zone): [boolean, Zone] {
    const left = Math.max(this.left, zone.left);
    const right = Math.min(this.right, zone.right);
    const top = Math.max(this.top, zone.top);
    const bottom = Math.min(this.bottom, zone.bottom);
    return [(left < right && top < bottom), new Zone(left, right, top, bottom)];
  }

  deepTestPass(element: SVGGeometryElement, point: SVGPoint): boolean {
    const transform = element.getAttribute('transform') as string;
    const result  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(transform);
    let offsetX = 0;
    let offsetY = 0;
    if (result !== null) {
      offsetX -= parseInt(result[1], 10);
      offsetY -= parseInt(result[2], 10);
    }
    for (let x = this.left; x <= this.right; x += 3) {
      for (let y = this.top; y <= this.bottom; y += 3) {
        point.x = x + offsetX;
        point.y = y + offsetY;
        if (element.isPointInStroke(point)) {
          return true;
        }
      }
    }
    return false;
  }

  getPoints(): [Point, Point] {
    return [new Point(this.left, this.top), new Point(this.right, this.bottom)];
  }

}
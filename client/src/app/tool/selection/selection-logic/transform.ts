import { Renderer2 } from '@angular/core';

export class Transform {

  private translateAttribute: [number, number];
  private rotateAttribute: [number, number, number];
  private scaleAttribute: [number, number];

  constructor(private element: SVGElement, private renderer: Renderer2) {

    const transform = this.element.getAttribute('transform') as string;

    let result = /translate\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    this.translateAttribute = (result !== null) ?
      [parseInt(result[1], 10), parseInt(result[2], 10)] : [0, 0];

    result = /rotate\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    this.rotateAttribute = (result !== null) ?
      // tslint:disable-next-line: no-magic-numbers
      [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)] : [0, 0, 0];

    result = /scale\(\s*([^\s,)]+)[ ,][ ]?([^\s,)]+)\)/.exec(transform);
    this.scaleAttribute = (result !== null) ?
        [parseInt(result[1], 10), parseInt(result[2], 10)] : [1, 1];
  }

  static translateAll(elements: Iterable<SVGElement>, dx: number, dy: number, renderer: Renderer2): void {
    for (const element of elements) {
      new Transform(element, renderer).translate(dx, dy);
    }
  }

  translate(dx: number, dy: number): void {
    this.translateAttribute[0] += dx;
    this.translateAttribute[1] += dy;
    this.setAttributes();
  }

  getTransformTranslate(): [number, number] {
    return [this.translateAttribute[0] , this.translateAttribute[1]];
  }

  private setAttributes(): void {
    this.renderer.setAttribute(
      this.element,
      'transform',
      `scale(${this.scaleAttribute[0]},${this.scaleAttribute[1]}) ` +
      `translate(${this.translateAttribute[0]},${this.translateAttribute[1]}) ` +
      `rotate(${this.rotateAttribute[0]},${this.rotateAttribute[1]},${this.rotateAttribute[2]}) `
    );
  }

}
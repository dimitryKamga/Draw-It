import { Component, Renderer2 } from '@angular/core';
import { ColorService } from '../../color/color.service';
import { PencilBrushCommon } from '../../pencil-brush/pencil-brush-common';
import { BrushService } from '../brush.service';

@Component({
  selector: 'app-brush-logic',
  template: ''
})
export class BrushLogicComponent extends PencilBrushCommon {

  private listeners: (() => void)[];

  constructor(public renderer: Renderer2,
              public colorService: ColorService,
              public brushService: BrushService) {
    super();
    this.listeners = new Array();
  }

  // tslint:disable-next-line use-lifecycle-interface
  ngOnInit(): void {
    if (this.brushService.isFirstLoaded) {
      const svgDefsEl: SVGDefsElement =
        this.renderer.createElement('defs', this.svgNS);
      this.renderer.appendChild(svgDefsEl, this.generateFilterOne());
      this.renderer.appendChild(svgDefsEl, this.generateFilterTwo());
      this.renderer.appendChild(svgDefsEl, this.generateFilterThree());
      this.renderer.appendChild(svgDefsEl, this.generateFilterFour());
      this.renderer.appendChild(svgDefsEl, this.generateFilterFive());
      this.renderer.appendChild(this.svgElRef.nativeElement, svgDefsEl);
      this.brushService.isFirstLoaded = false;
    }
    const mouseDownListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousedown', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0) {
          this.mouseOnHold = true;
          this.onMouseDown(mouseEv);
        }
    });

    const mouseMoveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mousemove', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.onMouseMove(mouseEv);
        }
    });

    const mouseUpListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseup', (mouseEv: MouseEvent) => {
        this.stopDrawing();
    });

    const mouseLeaveListen = this.renderer.listen(this.svgElRef.nativeElement,
      'mouseleave', (mouseEv: MouseEvent) => {
        if (mouseEv.button === 0 && this.mouseOnHold) {
          this.stopDrawing();
        }
    });
    this.listeners = [
      mouseDownListen,
      mouseMoveListen,
      mouseUpListen,
      mouseLeaveListen
    ];
  }

  configureSvgElement(element: SVGElement): void {
    element.setAttribute('d', this.stringPath);
    element.setAttribute('stroke', this.colorService.primaryColor);
    element.setAttribute('fill', this.colorService.primaryColor);
    element.setAttribute('filter', `url(#${this.brushService.texture})`);
    element.setAttribute('stroke-linecap', this.strokeLineCap);
    element.setAttribute(
      'stroke-width', this.brushService.thickness.toString()
    );
  }

  onMouseDown(mouseEv: MouseEvent): void {
    this.makeFirstPoint(mouseEv);
    this.svgPath = this.renderer.createElement(this.svgTag, this.svgNS);
    this.configureSvgElement(this.svgPath);
    this.renderer.appendChild(this.svgElRef.nativeElement, this.svgPath);
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.listeners.forEach(listenner => { listenner(); });
  }

  stopDrawing(): void {
    this.mouseOnHold = false;
    this.stringPath = '';
  }

  onMouseMove(mouseEv: MouseEvent): void {
    this.drawing(mouseEv);
    this.svgPath.setAttribute('d', this.stringPath);
  }

  generateFilterOne(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement = this.renderer.createElement(
      'filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter1');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const svgFeTurbulence: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', this.svgNS);
    svgFeTurbulence.setAttribute('type', 'turbulence');
    svgFeTurbulence.setAttribute('baseFrequency', '0.05');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'turbulence');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', this.svgNS);
    svgDisplacementMap.setAttribute('in2', 'turbulence');
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('scale', '50');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'G');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  generateFilterTwo(): SVGFilterElement {
    const filterSvgEl: SVGFilterElement =
      this.renderer.createElement('filter', this.svgNS);
    filterSvgEl.setAttribute('id', 'filter2');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');
    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      this.renderer.createElement('feGaussianBlur', this.svgNS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceGraphic');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(filterSvgEl, feGaussianBlurSvgEl);
    const feOffset: SVGFEOffsetElement =
      this.renderer.createElement('feOffset', this.svgNS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(filterSvgEl, feOffset);
    return filterSvgEl;
  }

  generateFilterThree(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      this.renderer.createElement('filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter3');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feGaussianBlurSvgEl: SVGFEGaussianBlurElement =
      this.renderer.createElement('feGaussianBlur', this.svgNS);
    feGaussianBlurSvgEl.setAttribute('in', 'SourceAlpha');
    feGaussianBlurSvgEl.setAttribute('stdDeviation', '4');
    feGaussianBlurSvgEl.setAttribute('result', 'blur');
    this.renderer.appendChild(svgFilterEl, feGaussianBlurSvgEl);

    const feOffset: SVGFEOffsetElement =
      this.renderer.createElement('feOffset', this.svgNS);
    feOffset.setAttribute('in', 'blur');
    feOffset.setAttribute('dx', '4');
    feOffset.setAttribute('dy', '4');
    feOffset.setAttribute('result', 'offsetBlur');
    this.renderer.appendChild(svgFilterEl, feOffset);

    const feSpecularLighting: SVGFESpecularLightingElement =
      this.renderer.createElement('feSpecularLighting', this.svgNS);
    feSpecularLighting.setAttribute('in', 'blur');
    feSpecularLighting.setAttribute('surfaceScale', '5');
    feSpecularLighting.setAttribute('specularConstant', '.75');
    feSpecularLighting.setAttribute('specularExponent', '20');
    feSpecularLighting.setAttribute('result', 'specOut');
    this.renderer.appendChild(svgFilterEl, feSpecularLighting);

    const feComposite: SVGFECompositeElement =
      this.renderer.createElement('feComposite', this.svgNS);
    feComposite.setAttribute('in', 'SourceGraphic');
    feComposite.setAttribute('in2', 'specOut');
    feComposite.setAttribute('operator', 'arithmetic');
    feComposite.setAttribute('result', 'specOut');
    feComposite.setAttribute('k1', '0');
    feComposite.setAttribute('k2', '1');
    feComposite.setAttribute('k3', '1');
    feComposite.setAttribute('k4', '0');
    feComposite.setAttribute('result', 'litPaint');
    this.renderer.appendChild(svgFilterEl, feComposite);

    const feMerge: SVGFEMergeElement =
      this.renderer.createElement('feMerge', this.svgNS);

    const feMergeNode1: SVGFEMergeNodeElement = this.renderer.createElement(
      'feMergeNode', this.svgNS);
    feMergeNode1.setAttribute('in', 'offsetBlur');
    this.renderer.appendChild(feMerge, feMergeNode1);

    const feMergeNode2: SVGFEMergeNodeElement =
      this.renderer.createElement('feMergeNode', this.svgNS);
    feMergeNode2.setAttribute('in', 'litPaint');
    this.renderer.appendChild(feMerge, feMergeNode2);
    this.renderer.appendChild(svgFilterEl, feMerge);

    return svgFilterEl;
  }

  generateFilterFour(): SVGFilterElement {
    const svgFilterEl: SVGFilterElement =
      this.renderer.createElement('filter', this.svgNS);
    svgFilterEl.setAttribute('id', 'filter4');
    svgFilterEl.setAttribute('filterUnits', 'userSpaceOnUse');
    svgFilterEl.setAttribute('x', '0%');
    svgFilterEl.setAttribute('y', '0%');

    const svgFeTurbulence: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', this.svgNS);
    svgFeTurbulence.setAttribute('baseFrequency', '0.01 0.4');
    svgFeTurbulence.setAttribute('numOctaves', '2');
    svgFeTurbulence.setAttribute('result', 'NOISE');
    this.renderer.appendChild(svgFilterEl, svgFeTurbulence);

    const svgDisplacementMap: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', this.svgNS);
    svgDisplacementMap.setAttribute('in', 'SourceGraphic');
    svgDisplacementMap.setAttribute('in2', 'NOISE');
    svgDisplacementMap.setAttribute('scale', '20');
    svgDisplacementMap.setAttribute('xChannelSelector', 'R');
    svgDisplacementMap.setAttribute('yChannelSelector', 'R');
    this.renderer.appendChild(svgFilterEl, svgDisplacementMap);

    return svgFilterEl;
  }

  generateFilterFive(): SVGFilterElement {
    const filterSvgEl: SVGFilterElement =
      this.renderer.createElement('filter', this.svgNS);
    filterSvgEl.setAttribute('id', 'filter5');
    filterSvgEl.setAttribute('filterUnits', 'userSpaceOnUse');

    const feTurbulenceSvgEl: SVGFETurbulenceElement =
      this.renderer.createElement('feTurbulence', this.svgNS);
    feTurbulenceSvgEl.setAttribute('baseFrequency', '0.7');
    this.renderer.appendChild(filterSvgEl, feTurbulenceSvgEl);

    const feDisplacementMapSvgEl: SVGFEDisplacementMapElement =
      this.renderer.createElement('feDisplacementMap', this.svgNS);
    feDisplacementMapSvgEl.setAttribute('in', 'SourceGraphic');
    feDisplacementMapSvgEl.setAttribute('scale', '20');
    this.renderer.appendChild(filterSvgEl, feDisplacementMapSvgEl);

    return filterSvgEl;
  }
}
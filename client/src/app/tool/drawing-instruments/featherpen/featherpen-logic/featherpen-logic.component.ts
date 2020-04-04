import {Component, OnDestroy, Renderer2} from '@angular/core';
import {ColorService} from '../../../color/color.service';
import {Point} from '../../../shape/common/point';
import {ToolLogicDirective} from '../../../tool-logic/tool-logic.directive';
import {FeatherpenService} from '../featherpen.service';

@Component({
  selector: 'app-featherpen-logic',
  template: '',
})

// tslint:disable:use-lifecycle-interface
export class FeatherpenLogicComponent extends ToolLogicDirective
 implements OnDestroy {

  private listeners: (() => void)[];
  private onDrag: boolean;
  private element: SVGElement;
  private currentPath: string;

  constructor(private renderer: Renderer2,
              private readonly service: FeatherpenService,
              private readonly colorService: ColorService) {
    super();
    this.onDrag = false;
    this.element = undefined as unknown as SVGElement;
    this.currentPath = '';
  }

  ngOnInit(): void {
    const onMouseDown = this.renderer.listen(
      this.svgStructure.root,
      'mousedown',
      (mouseEv: MouseEvent) => this.onMouseDown(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgStructure.root,
      'mousemove',
      (mouseEv: MouseEvent) => {
        this.onMouseMove(new Point(mouseEv.offsetX, mouseEv.offsetY));
      }
    );

    const onScroll = this.renderer.listen(
      this.svgStructure.root,
      'wheel',
      (wheelEv: WheelEvent) => this.onScroll(wheelEv)
    );

    const onMouseLeave = this.renderer.listen(
      this.svgStructure.root,
      'mouseleave',
      () => this.onMouseUp()
    );

    const onMouseUp = this.renderer.listen(
      document,
      'mouseup',
      () => this.onMouseUp()
    );

    this.listeners = [
      onMouseDown,
      onMouseMove,
      onScroll,
      onMouseLeave,
      onMouseUp,
    ];
    this.svgStructure.root.setAttribute('cursor', 'crosshair');
  }

  ngOnDestroy(): void {
    this.listeners.forEach((listener) => listener());
  }

  private onMouseDown(mouseEv: MouseEvent): void {
    if (!this.onDrag) {
      this.onDrag = true;
      this.element = this.renderer.createElement('path', this.svgNS);
      this.renderer.appendChild(this.svgStructure.drawZone, this.element);
      this.setElementStyle();
      this.element.setAttribute('d', this.service.pathCentered(new Point(mouseEv.offsetX, mouseEv.offsetY)));
    }
  }

  private setElementStyle(): void {
    this.element.setAttribute('stroke', this.colorService.primaryColor);
    this.element.setAttribute('stroke-width', '2');
  }

  private onMouseMove(point: Point): void {
    if (this.onDrag) {
      this.currentPath += this.service.pathCentered(point);
      this.element.setAttribute('d', `${this.currentPath}`);
    }
  }

  private onMouseUp(): void {
    this.onDrag = false;
    this.element = undefined as unknown as SVGElement;
    this.currentPath = '';
  }

  private onScroll(wheelEv: WheelEvent): void {
    wheelEv.preventDefault();
    const oldAngle = this.service.incrementAngle(wheelEv);
    if (this.onDrag) {
      const pathToAdd = this.service.interpolate(oldAngle, this.service.angle, new Point(wheelEv.offsetX, wheelEv.offsetY));
      this.currentPath = `${this.currentPath} ${pathToAdd}`;
      this.renderer.setAttribute(this.element, 'd', `${this.currentPath}`);
    }
  }
}

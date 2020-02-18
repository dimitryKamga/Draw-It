import {Component, OnDestroy, Renderer2} from '@angular/core';
import html2canvas from 'html2canvas';
import {ColorService} from '../../color/color.service';
import {ToolLogicDirective} from '../../tool-logic/tool-logic.directive';
import {PipetteService} from '../pipette.service';

@Component({
  selector: 'app-pipette-logic',
  templateUrl: './pipette-logic.component.html',
  styleUrls: ['./pipette-logic.component.scss']
})

// tslint:disable:use-lifecycle-interface
export class PipetteLogicComponent extends ToolLogicDirective
  implements OnDestroy {

  private allListeners: (() => void)[] = [];
  private image: CanvasRenderingContext2D | null;

  constructor(
    private readonly service: PipetteService,
    private readonly renderer: Renderer2,
    private readonly colorService: ColorService,
  ) {
    super();
  }

  ngOnInit(): void {

    html2canvas(document.body).then(
      value => { this.image = value.getContext('2d') }
    );

    const onMouseClick = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mouseclick',
      (mouseEv: MouseEvent) => this.onMouseClick(mouseEv)
    );

    const onMouseMove = this.renderer.listen(
      this.svgElRef.nativeElement,
      'mousemove',
      (mouseEv: MouseEvent) => this.onMouseMove(mouseEv)
    );

    this.allListeners = [
      onMouseClick,
      onMouseMove
    ]
  }

  ngOnDestroy(): void {
    this.allListeners.forEach(listener => listener());
  }

  private onMouseClick(mouseEv: MouseEvent): void {
    if (mouseEv.button === 0) {
      this.colorService.selectPrimaryColor(this.service.currentColor);
    } else if (mouseEv.button === 1) {
      this.colorService.selectSecondaryColor(this.service.currentColor);
    }
  }

  private onMouseMove(mouseEv: MouseEvent): void {
    if (this.image != null) {
      const pixel = this.image.getImageData(
        mouseEv.clientX,
        mouseEv.clientY,
        1,
        1
      ).data;
      this.service.currentColor = 'rgba(' +
        pixel[0].toString() + ',' +
        pixel[1].toString() + ',' +
        pixel[2].toString() + ',' +
        pixel[3].toString() +
      ')';
    }
  }

}

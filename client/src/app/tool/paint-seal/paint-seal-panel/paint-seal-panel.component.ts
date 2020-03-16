import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSlider } from '@angular/material';
import { ToolPanelDirective } from '../../tool-panel/tool-panel.directive';
import { PaintSealService } from '../paint-seal.service';

@Component({
  selector: 'app-paint-seal-panel',
  templateUrl: './paint-seal-panel.component.html',
  styleUrls: ['./paint-seal-panel.component.scss']
})
export class PaintSealPanelComponent extends ToolPanelDirective {

  private paintSealForm: FormGroup;

  @ViewChild('toleranceSlider', {
    static: false,
  }) private toleranceSlider: MatSlider;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: PaintSealService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.paintSealForm = this.formBuilder.group({
      toleranceFormField: [this.service.tolerance, [Validators.required]],
      toleranceSlider: [this.service.tolerance, []],
    });
  }

  protected onToleranceChange(): void {
    this.paintSealForm.patchValue
              ({ sizeFormField: this.toleranceSlider.value });
    this.service.tolerance = this.toleranceSlider.value as number;
  }

}

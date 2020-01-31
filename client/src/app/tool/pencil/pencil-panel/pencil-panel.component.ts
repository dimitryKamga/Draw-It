import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ToolPanelComponent } from '../../tool-panel/tool-panel.component';
import { PencilService } from '../pencil.service';

@Component({
  selector: 'app-pencil-panel',
  templateUrl: './pencil-panel.component.html',
  styleUrls: ['./pencil-panel.component.scss']
})
export class PencilPanelComponent extends ToolPanelComponent {
  pencilForm: FormGroup;

  constructor(elementRef: ElementRef<HTMLElement>,
              private readonly service: PencilService,
              private readonly formBuilder: FormBuilder) {
    super(elementRef);
    this.pencilForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
    });
  }

  onThicknessChange($event: Event) {
    this.pencilForm.patchValue({
      thicknessFormField: this.pencilForm.value.thicknessSlider,
    });
    this.service.thickness = this.pencilForm.value.thicknessSlider;
  }
}
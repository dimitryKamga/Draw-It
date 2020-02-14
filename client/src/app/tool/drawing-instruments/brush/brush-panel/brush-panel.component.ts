import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatRadioChange, MatSlider } from '@angular/material';
import { MatRadioButton } from '@angular/material/radio';

import { ToolPanelDirective } from '../../../tool-panel/tool-panel.directive';
import { BrushService, Texture } from '../brush.service';

@Component({
  selector: 'app-brush-panel',
  templateUrl: './brush-panel.component.html',
  styleUrls: ['./brush-panel.component.scss']
})
export class BrushPanelComponent extends ToolPanelDirective {
  private brushForm: FormGroup;

  @ViewChild('radioChoice', {
    static: false
  })
  protected radioChoice: MatRadioButton;

  @ViewChild('thicknessSlider', {
    static: false
  })
  private thicknessSlider: MatSlider;

  protected textures = [
    {
      value: Texture.Texture1,
      name: 'Fractal',
      src: '/assets/textures/texture1.png'
    },
    {
      value: Texture.Texture2,
      name: 'Flou',
      src: '/assets/textures/texture2.png'
    },
    {
      value: Texture.Texture3,
      name: 'Ombre',
      src: '/assets/textures/texture3.png'
    },
    {
      value: Texture.Texture4,
      name: 'Graffiti',
      src: '/assets/textures/texture4.png'
    },
    {
      value: Texture.Texture5,
      name: 'Poussière',
      src: '/assets/textures/texture5.png'
    }
  ];

  constructor(
    elementRef: ElementRef<HTMLElement>,
    private readonly service: BrushService,
    private formBuilder: FormBuilder
  ) {
    super(elementRef);
    this.brushForm = this.formBuilder.group({
      thicknessFormField: [this.service.thickness, [Validators.required]],
      thicknessSlider: [this.service.thickness, []],
      textureOption: [this.service.texture, []]
    });
  }

  protected onThicknessChange(): void {
    this.brushForm.patchValue({
      thicknessFormField: this.thicknessSlider.value
    });
    this.service.thickness = this.thicknessSlider.value as number;
  }

  protected onOptionChange($event: MatRadioChange): void {
    this.service.texture = $event.value;
  }
}
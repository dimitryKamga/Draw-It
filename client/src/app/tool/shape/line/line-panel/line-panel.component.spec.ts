import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CdkObserveContent
} from '@angular/cdk/observers';
import {
  MatCard,
  MatCardContent,
  MatCardTitle,
  MatFormField,
  MatIcon,
  MatInput,
  MatRadioButton,
  MatRadioGroup,
  MatRipple,
  MatSlider,
  MatSlideToggle,
  MatSlideToggleChange
} from '@angular/material';
import {
  BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
  ColorPanelComponent
} from '../../../color/color-panel/color-panel.component';
import {
  ColorPickerContentComponent
} from '../../../color/color-panel/color-picker-content/color-picker-content.component';
import {
  ColorPickerItemComponent
} from '../../../color/color-panel/color-picker-item/color-picker-item.component';
import {
  LinePanelComponent
} from './line-panel.component';

// tslint:disable: no-string-literal no-magic-numbers
describe('LinePanelComponent', () => {
  let component: LinePanelComponent;
  let fixture: ComponentFixture<LinePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      declarations: [
        LinePanelComponent,
        MatSlider,
        MatSlideToggle,
        MatFormField,
        MatInput,
        ColorPanelComponent,
        MatRipple,
        CdkObserveContent,
        MatRadioButton,
        ColorPickerItemComponent,
        ColorPickerContentComponent,
        MatIcon,
        MatRadioGroup,
        MatCardTitle,
        MatCardContent,
        MatCard
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onChangeJonctionOption replace withJonction by'
    + 'event.checked', () => {
    component['service'].withJonction = true;
    component['onChangeJonctionOption'](
      new MatSlideToggleChange(component['slideToggle'], false)
    );
    expect(component['service'].withJonction).toBeFalsy();
  });

  it('#onThicknessChange should call patchValue', () => {
    const spy = spyOn(component['lineForm'], 'patchValue');
    component['onThicknessChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('#onRadiusChange should call patchValue', () => {
    const spy = spyOn(component['lineForm'], 'patchValue');
    component['onRadiusChange']();
    expect(spy).toHaveBeenCalled();
  });

  it('#onThicknessValueChange should change the radius'
    +   'minimum size to the half of the thikness', () => {
    spyOn(component['lineForm'], 'patchValue');
    component['radiusSlider'].min = 10;
    component['service'].thickness = 40;
    component['onThicknessValueChange']();
    expect(component['radiusSlider'].min).toEqual(24);
  });

});

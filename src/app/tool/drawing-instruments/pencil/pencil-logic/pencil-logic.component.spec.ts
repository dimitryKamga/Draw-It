import { Renderer2 } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { UndoRedoService } from 'src/app/undo-redo/undo-redo.service';
import { ColorService } from '../../../color/color.service';
import { PencilService } from '../pencil.service';
import { PencilLogicComponent } from './pencil-logic.component';

// tslint:disable:no-string-literal no-any no-magic-numbers
describe('PencilLogicComponent', () => {
  let component: PencilLogicComponent;
  let fixture: ComponentFixture<PencilLogicComponent>;
  let mouseEvLeft: MouseEvent;
  let mouseEvRight: MouseEvent;
  let mouseMoveEvLeft: MouseEvent;
  let mouseleaveEvLeft: MouseEvent;
  let mouseleaveEvRight: MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PencilLogicComponent],
      providers: [Renderer2, ColorService, PencilService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilLogicComponent);
    component = fixture.componentInstance;
    component.svgStructure = {
      root: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      defsZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      drawZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      temporaryZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement,
      endZone: document.createElementNS('http://www.w3.org/2000/svg', 'svg:g') as SVGGElement
    };
    component.svgStructure.root.appendChild(component.svgStructure.defsZone);
    component.svgStructure.root.appendChild(component.svgStructure.drawZone);
    component.svgStructure.root.appendChild(component.svgStructure.temporaryZone);
    component.svgStructure.root.appendChild(component.svgStructure.endZone);

    (TestBed.get(UndoRedoService) as UndoRedoService)
    .intialise(component.svgStructure);

    mouseEvLeft = new MouseEvent('mousedown', {
      offsetX: 10,
      offsetY: 30,
      button: 0
    } as MouseEventInit);

    mouseEvRight = new MouseEvent('mousedown', {
      offsetX: 10,
      offsetY: 30,
      button: 2
    } as MouseEventInit);

    mouseMoveEvLeft = new MouseEvent('mousemove', {
      offsetX: 10,
      offsetY: 30,
      button: 0
    } as MouseEventInit);

    mouseleaveEvLeft = new MouseEvent('mouseleave', {
      button: 0
    } as MouseEventInit);

    mouseleaveEvRight = new MouseEvent('mouseleave', {
      button: 2
    } as MouseEventInit);
    fixture.detectChanges();
  });

  it('#should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    '#MakeFirstPoint should set ' + 'the good value to path',
    fakeAsync(() => {
      let pathExpected = 'M' + mouseEvLeft.offsetX;
      pathExpected += ',' + mouseEvLeft.offsetY + ' h0';
      component['makeFirstPoint'](mouseEvLeft);
      expect(component.stringPath).toEqual(pathExpected);
    })
  );

  it(
    '#MakeFirstPoint shouldnt set the value ' + 'if the left button isnt hold',
    fakeAsync(() => {
      const pathExpected = '';
      component['makeFirstPoint'](mouseEvRight);
      expect(component.stringPath).toEqual(pathExpected);
    })
  );

  it('#drawing should set the good value to path', fakeAsync(() => {
    let pathExpected = ' L' + mouseEvLeft.offsetX + ',' + mouseEvLeft.offsetY;
    pathExpected += ' M' + mouseEvLeft.offsetX + ',' + mouseEvLeft.offsetY;
    component['drawing'](mouseEvLeft);
    expect(component.stringPath).toEqual(pathExpected);
  }));

  it(
    '#drawing shouldnt set value to path ' + 'if the left button is unhold',
    fakeAsync(() => {
      const pathExpected = '';
      component['drawing'](mouseEvRight);
      expect(component.stringPath).toEqual(pathExpected);
    })
  );

  it('#configureSvgElement is making good configurations', fakeAsync(() => {
    const anElement: SVGPathElement = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    component['onMouseDown'](mouseEvLeft);
    component['configureSvgElement'](anElement);
    expect(anElement.getAttribute('stroke-width')).toEqual(
      component['pencilService'].thickness.toString()
    );
    expect(anElement.getAttribute('stroke-linecap')).toEqual(
      component.strokeLineCap
    );
  }));

  it('#mouseMove should set the good value to the svgPath', fakeAsync(() => {
    component.svgPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    ); // define the svgPath
    component['onMouseMove'](mouseEvLeft);
    let pathExpected = ' L' + mouseEvLeft.offsetX + ',' + mouseEvLeft.offsetY;
    pathExpected += ' M' + mouseEvLeft.offsetX + ',' + mouseEvLeft.offsetY;
    expect(component.stringPath).toEqual(pathExpected);
  }));

  it('#should trigger onMouseDown method when mouse is down', fakeAsync(() => {
    const spy = spyOn<any>(component, 'onMouseDown');
    component.svgStructure.root.dispatchEvent(mouseEvLeft);
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
    }, 500);
    tick(500);
  }));

  it(
    '#shouldnt trigger onMouseDown method when' + ' left button is unhold',
    fakeAsync(() => {
      const spy = spyOn<any>(component, 'onMouseDown');
      component.svgStructure.root.dispatchEvent(mouseEvRight);
      setTimeout(() => {
        expect(spy).toHaveBeenCalledTimes(0);
      }, 500);
      tick(500);
    })
  );

  it('#should call onMouseMove method when mouse is moving', fakeAsync(() => {
    const spy = spyOn<any>(component, 'onMouseMove');
    component.svgStructure.root.dispatchEvent(mouseEvLeft);
    component.svgStructure.root.dispatchEvent(mouseMoveEvLeft);
    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    }, 1000);
    tick(1000);
  }));

  it(
    '#should reset the values of stringPath and' +
      ' mouseOnHold when mouse is up',
    fakeAsync(() => {
      component.svgStructure.root.dispatchEvent(
        new MouseEvent('mouseup', {} as MouseEventInit)
      );
      setTimeout(() => {
        expect(component.stringPath).toEqual('');
      }, 500);
      tick(500);
    })
  );

  it('#should reset stringPath when mouse is leaving', fakeAsync(() => {
    component.mouseOnHold = true;
    component.svgStructure.root.dispatchEvent(mouseleaveEvLeft);
    setTimeout(() => {
      expect(component.stringPath).toEqual('');
    }, 1000);
    tick(1000);
  }));

  it(
    '#mouseleave shouldnt updates stringPath' +
      ' values when others button are hold',
    fakeAsync(() => {
      component['onMouseDown'](mouseEvLeft);
      let pathExpected = 'M' + mouseEvLeft.offsetX;
      pathExpected += ',' + mouseEvLeft.offsetY + ' h0';
      component.svgStructure.root.dispatchEvent(mouseleaveEvRight);
      setTimeout(() => {
        expect(component.stringPath).toEqual(pathExpected);
      }, 1000);
      tick(1000);
    })
  );

  it(
    '#onMouseMove shouldnt updates stringPath values when left' +
      ' mouse button isnt hold',
    fakeAsync(() => {
      component['onMouseDown'](mouseEvLeft);
      component.svgStructure.root.dispatchEvent(mouseEvRight);
      let pathExpected: string = 'M' + mouseEvLeft.offsetX;
      pathExpected += ',' + mouseEvLeft.offsetY + ' h0';
      setTimeout(() => {
        expect(component.stringPath).toEqual(pathExpected);
      }, 1000);
      tick(1000);
    })
  );

  it(
    '#event mousemove shouldnt call onMouseMove' +
      ' method when mouse isnt hold',
    fakeAsync(() => {
      const spy = spyOn<any>(component, 'onMouseMove');
      component.svgStructure.root.dispatchEvent(mouseMoveEvLeft);
      setTimeout(() => {
        expect(spy).toHaveBeenCalledTimes(0);
      }, 1000);
      tick(1000);
    })
  );
});

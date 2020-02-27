import { Injectable } from '@angular/core';
import { SVGStructure } from '../tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private svgStructure: SVGStructure;
  private cmdDone: (SVGElement[])[]
  private cmdUndone: (SVGElement[])[];

  private actions: {
    undo: [PreAction, PostAction],
    redo: [PreAction, PostAction],
  };

  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
    this.resetActions();
  }

  intialise(svgStructure: SVGStructure): void {
    this.svgStructure = svgStructure;
  }

  resetActions() {
    this.actions = {
      undo: [ this.createDefaultPreAction(), this.createDefaultPostAction() ],
      redo: [ this.createDefaultPreAction(), this.createDefaultPostAction() ]
    }
  }

  saveState(): void {
    // TODO : J'ai changé plein de tucs. Tu copiais des référecences Nico
    const drawZone = this.svgStructure.drawZone;
    const length = drawZone.children.length;
    const toPush = new Array(length);
    for (let i = 0; i < length; i++) {
      toPush[i] = (drawZone.children.item(i) as SVGElement).cloneNode(true);
    }
    this.cmdDone.push(toPush);
    this.cmdUndone = [];
    console.log('On sauvegarde');
  }

  undo(): void {

    if (this.actions.undo[0].enabled
      && this.actions.undo[0].overrideFunctionDefined) {
      (this.actions.undo[0].overrideFunction as () => void)();
    }

    if (!this.actions.undo[0].overrideDefaultBehaviour) {
      this.undoBase();
    }

    if (this.actions.undo[1].enabled && this.actions.undo[1].functionDefined) {
      (this.actions.undo[1].function as () => void)();
    }

  }

  undoBase() {
    if (this.cmdDone.length !== 0) {
      const lastCommand = this.cmdDone.pop();
      this.cmdUndone.push(lastCommand as SVGElement[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  redo(): void {
    if (this.actions.redo[0].enabled
      && this.actions.redo[0].overrideFunctionDefined) {
      (this.actions.redo[0].overrideFunction as () => void)();
    }

    if (!this.actions.redo[0].overrideDefaultBehaviour) {
      this.redoBase();
    }

    if (this.actions.redo[1].enabled && this.actions.redo[1].functionDefined) {
      (this.actions.redo[1].function as () => void)();
    }
  }

  redoBase() {
    if (this.cmdUndone.length) {
      const lastCommand = this.cmdUndone.pop();
      this.cmdDone.push(lastCommand as SVGElement[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  refresh(node: ChildNode[]): void {
    // TODO : Nicolas. Look if it make sense. J'ai changé des trucs
    for (const element of Array.from(this.svgStructure.drawZone.childNodes)) {
      element.remove();
    }
    const nodeChildrens = node ? Array.from(node) : [];
    for (const element of nodeChildrens) {
      this.svgStructure.drawZone.appendChild(element);
    }

  }

  canUndo(): boolean {
    return this.cmdDone.length !== 0;
  }

  canRedo(): boolean {
    return this.cmdUndone.length !== 0;
  }

  private createDefaultPreAction(): PreAction {
    return {
      enabled: false,
      overrideDefaultBehaviour: false,
      overrideFunctionDefined: false
    }
  }

  private createDefaultPostAction(): PostAction {
    return {
      enabled: false,
      functionDefined: false,
    }
  }

  setPreUndoAction(action: PreAction) {
    this.actions.undo[0] = action;
  }

  setPostUndoAction(action: PostAction) {
    this.actions.undo[1] = action;
  }

  setPreRedoAction(action: PreAction) {
    this.actions.undo[0] = action;
  }

  setPostRedoAction(action: PostAction) {
    this.actions.undo[1] = action;
  }

}

interface PreAction {
  enabled: boolean,
  overrideDefaultBehaviour: boolean,
  overrideFunctionDefined: boolean
  overrideFunction?: () => void
}

interface PostAction {
  enabled: boolean,
  functionDefined: boolean,
  function?: () => void
}
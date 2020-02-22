import { Injectable } from '@angular/core';
import { SVGStructure } from '../tool-logic/tool-logic.directive';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService {

  private svgStructure: SVGStructure;
  private cmdDone: (ChildNode[])[]
  private cmdUndone: (ChildNode[])[];
  private firstCommand: boolean;

  private actions: [PreUndoAction, PostUndoAction];

  constructor() {
    this.cmdDone = [];
    this.cmdUndone = [];
    this.firstCommand = false;
    this.resetActions();
  }

  intialise(svgStructure: SVGStructure): void {
    this.svgStructure = svgStructure;
    this.saveState();
  }

  resetActions() {
    this.actions = [
      {
        enabled: false,
        overrideDefaultBehaviour: false,
        overrideFunctionDefined: false
      },
      {
        enabled: false,
        functionDefined: false,
      }
    ]
  }

  setPreUndoAction(action: PreUndoAction) {
    this.actions[0] = action;
  }

  setPostUndoAction(action: PostUndoAction) {
    this.actions[1] = action;
  }

  saveState(): void {
    const drawZone = this.svgStructure.drawZone;
    this.cmdDone.push(Array.from(drawZone.childNodes));
    this.cmdUndone = [];
    this.firstCommand = (drawZone.children.length !== 0);
  }

  undo(): void {

    if (this.actions[0].enabled && this.actions[0].overrideFunctionDefined) {
      (this.actions[0].overrideFunction as () => void)();
    }

    if (!this.actions[0].overrideDefaultBehaviour) {
      this.undoBase();
    }

    if (this.actions[1].enabled && this.actions[1].functionDefined) {
      (this.actions[1].function as () => void)();
    }

  }

  undoBase() {
    if (this.cmdDone.length !== 0) {
      const lastCommand = this.cmdDone.pop();
      this.cmdUndone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  redo(): void {
    if (this.cmdUndone.length) {
      const lastCommand = this.cmdUndone.pop();
      this.cmdDone.push(lastCommand as ChildNode[]);
      this.refresh(this.cmdDone[this.cmdDone.length - 1]);
    }
  }

  refresh(node: ChildNode[]): void {
    const childrens = Array.from(this.svgStructure.drawZone.childNodes);
    // TODO : Nicolas. Look if it make sense
    const nodeChildrens = node ? Array.from(node) : [];
    for (const element of childrens) {
      element.remove();
    }
    for (const element of nodeChildrens) {
      this.svgStructure.drawZone.appendChild(element);
    }
  }

  canUndo(): boolean {
    return this.firstCommand && this.svgStructure.drawZone.children.length >= 1;
  }

  canRedo(): boolean {
    return this.cmdUndone.length > 0;
  }

}

interface PreUndoAction {
  enabled: boolean,
  overrideDefaultBehaviour: boolean,
  overrideFunctionDefined: boolean
  overrideFunction?: () => void
}

interface PostUndoAction {
  enabled: boolean,
  functionDefined: boolean,
  function?: () => void
}

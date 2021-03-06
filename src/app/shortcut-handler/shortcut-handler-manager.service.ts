import {Injectable} from '@angular/core';
import {OverlayService} from '../overlay/overlay.service';
import {SelectionService} from '../selection/selection.service';
import {GridService} from '../tool/grid/grid.service';
import {ToolSelectorService} from '../tool/tool-selector/tool-selector.service';
import {Tool} from '../tool/tool.enum';
import {UndoRedoService} from '../undo-redo/undo-redo.service';
import {Shortcut} from './shortcut';
import {ShortcutCallBack, ShortcutHandlerService} from './shortcut-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ShortcutHandlerManagerService {

  private readonly handlersFunc: Map<Shortcut, ShortcutCallBack>;

  constructor(
    private readonly toolSelectorService: ToolSelectorService,
    private shortcutHanler: ShortcutHandlerService,
    private gridService: GridService,
    private undoRedoService: UndoRedoService,
    private overlayService: OverlayService,
    private selectionService: SelectionService,
  ) {
    this.handlersFunc = new Map();
  }

  initialiseShortcuts(): void {

    this.shortcutHanler.set(Shortcut.A, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.selectionService.selectAllElements.next(null);
      } else {
        this.toolSelectorService.set(Tool.AEROSOL);
      }
    });

    this.handlersFunc.set(Shortcut.B, () =>
      this.toolSelectorService.set(Tool.BUCKET)
    );

    this.handlersFunc.set(Shortcut.C, (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        this.selectionService.copy.next(null);
      } else {
        this.toolSelectorService.set(Tool.PENCIL);
      }
    });

    this.handlersFunc.set(Shortcut.D, (event: KeyboardEvent) => {
      event.preventDefault();
      if ( event.ctrlKey ) {
        this.selectionService.duplicate.next(null);
      }
    });

    this.handlersFunc.set(Shortcut.DELETE, (event: KeyboardEvent) => {
      event.preventDefault();
      this.selectionService.delete.next(null);
    });

    this.handlersFunc.set(Shortcut.E, (event: KeyboardEvent) => {
      event.preventDefault();
      if (event.ctrlKey) {
        this.overlayService.openExportDialog();
      } else {
        this.toolSelectorService.set(Tool.ERASER);
      }
    });

    this.handlersFunc.set(Shortcut.G, (event: KeyboardEvent) => {
      if (!!event && !event.ctrlKey) {
        this.gridService.keyEvHandler('g');
      }
    });

    this.handlersFunc.set(Shortcut.I, () =>
      this.toolSelectorService.set(Tool.PIPETTE)
    );

    this.handlersFunc.set(Shortcut.L, () =>
      this.toolSelectorService.set(Tool.LINE)
    );

    this.handlersFunc.set(Shortcut.M, () => {
      this.selectionService.magnetActive = !this.selectionService.magnetActive;
    });

    this.shortcutHanler.set(Shortcut.O, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey) {
        event.preventDefault();
        this.overlayService.openNewDrawDialog();
      }
    });

    this.shortcutHanler.set(Shortcut.P, () => {
      this.toolSelectorService.set(Tool.FEATHER_PEN);
    });

    this.handlersFunc.set(Shortcut.R, () =>
      this.toolSelectorService.set(Tool.APPLICATOR));

    this.handlersFunc.set(Shortcut.S, (event: KeyboardEvent) => {
      event.preventDefault();
      if ( !event.ctrlKey ) {
        this.toolSelectorService.set(Tool.SELECTION);
      } else {
        this.overlayService.openSaveDialog();
      }
    });

    this.handlersFunc.set(Shortcut.T, () =>
      this.toolSelectorService.set(Tool.TEXT)
    );

    this.handlersFunc.set(Shortcut.V, (event: KeyboardEvent) => {
      event.preventDefault();
      if ( event.ctrlKey ) {
        this.selectionService.paste.next(null);
      }
    });

    this.handlersFunc.set(Shortcut.X, (event: KeyboardEvent) => {
      event.preventDefault();
      if ( event.ctrlKey ) {
        this.selectionService.cut.next(null);
      }
    });

    this.handlersFunc.set(Shortcut.W, () =>
      this.toolSelectorService.set(Tool.BRUSH)
    );

    this.handlersFunc.set(Shortcut.Z, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey && !event.shiftKey) {
        event.preventDefault();
        this.undoRedoService.undo();
      }
    });

    this.handlersFunc.set(Shortcut.Z_SHIFT, (event: KeyboardEvent) => {
      if (!!event && event.ctrlKey && event.shiftKey) {
        event.preventDefault();
        this.undoRedoService.redo();
      }
    });

    this.handlersFunc.set(Shortcut.DIGIT_1, () =>
      this.toolSelectorService.set(Tool.RECTANGLE)
    );

    this.handlersFunc.set(Shortcut.DIGIT_2, () =>
      this.toolSelectorService.set(Tool.ELLIPSE)
    );

    this.handlersFunc.set(Shortcut.DIGIT_3, () =>
      this.toolSelectorService.set(Tool.POLYGONE)
    );

    this.handlersFunc.set(Shortcut.PLUS, () => {
      this.gridService.keyEvHandler('+');
    });

    this.handlersFunc.set(Shortcut.MINUS, () => {
      this.gridService.keyEvHandler('-');
    });

    for (const entry of this.handlersFunc) {
      this.shortcutHanler.set(
        entry[0],
        this.handlersFunc.get(entry[0]) as ShortcutCallBack
      );
    }
  }
}

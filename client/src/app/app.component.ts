import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { DocumentationComponent } from './pages/documentation/documentation.component';
import { HomeComponent } from './pages/home/home.component';
import { NewDrawComponent } from './pages/new-draw/new-draw.component';
import { SvgService } from './svg/svg.service';
import { ColorService } from './tool/color/color.service';
import { ToolSelectorService } from './tool/tool-selector/tool-selector.service';
import { Tool } from './tool/tool.enum';

export interface NewDrawOptions {
  width: number;
  height: number;
  color: string;
}

export enum OverlayPages {
  Documentation = 'documentation',
  Home = 'home',
  Library = 'library',
  New = 'new',
};

export interface DialogRefs {
  home: MatDialogRef<HomeComponent>,
  newDraw?: MatDialogRef<NewDrawComponent>,
  documentation?: MatDialogRef<DocumentationComponent>,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private readonly toolSelector: Map<string, Tool> ;
  private onMainPage = false;
  private dialogRefs: DialogRefs;
  drawInProgress = false;
  drawOption: NewDrawOptions = { height : 0, width : 0, color: ''};

  @ViewChild('svg', {
    static: false,
    read: ElementRef
  }) svg: ElementRef<SVGElement>;

  getCommomDialogOptions = () => {
    return {
      width: '650px',
      height: '90%',
      data: { drawInProgress: this.drawInProgress }
    };
  }

  constructor(public dialog: MatDialog,
              private readonly toolSelectorService: ToolSelectorService,
              private colorService: ColorService,
              private svgService: SvgService) {
    this.toolSelector = new Map()
    this.toolSelector.set('KeyC', Tool.Pencil);
    this.toolSelector.set('Digit1', Tool.Rectangle);
    this.toolSelector.set('KeyL', Tool.Line);
    this.toolSelector.set('KeyW', Tool.Brush);
    this.dialogRefs = {
      home: undefined as unknown as MatDialogRef<HomeComponent>,
      newDraw: undefined,
      documentation: undefined,
    };
   };

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.onMainPage) {
      if (this.toolSelector.has( event.code)) {
        const tool = this.toolSelector.get(event.code);
        this.toolSelectorService.set(tool as Tool);
      }
      if (event.code === 'KeyO' && event.ctrlKey) {
        event.preventDefault();
        this.openNewDrawDialog();
      }
    }
  }

  ngAfterViewInit() {
    this.svgService.instance = this.svg;
    this.openHomeDialog();
  }

  openHomeDialog() {
    this.dialogRefs.home = this.dialog.open(HomeComponent, this.getCommomDialogOptions());
    this.dialogRefs.home.disableClose = true;
    this.dialogRefs.home.afterClosed().subscribe((result: string) => {
      switch (result) {
        case OverlayPages.New:
          this.openNewDrawDialog();
          break;
        case OverlayPages.Library:
          break;
        case OverlayPages.Documentation:
          this.openDocumentationDialog(true);
          break;
        default:
          break;
      }
    });
  }

  openNewDrawDialog() {
    const newDialog = this.dialog.open(NewDrawComponent, this.getCommomDialogOptions());
    newDialog.disableClose = true;

    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (resultNewDialog === OverlayPages.Home) {
        this.openHomeDialog();
      } else if (resultNewDialog !== null) {
        this.createNewDraw(resultNewDialog);
        this.onMainPage = true;
      }
    });
  }

  openDocumentationDialog(fromHome: boolean) {
    const dialogOptions = {
      width: '115vw',
      height: '100vh',
      panelClass: 'documentation',
    };
    const newDialog = this.dialog.open(DocumentationComponent, dialogOptions);
    newDialog.disableClose = false;
    this.onMainPage = false;
    newDialog.afterClosed().subscribe((resultNewDialog) => {
      if (fromHome) {
        this.openHomeDialog();
      } else {
        this.onMainPage = true;
      }
    });
  }

  createNewDraw(option: NewDrawOptions) {
    this.drawOption = option;
    this.drawInProgress = true;
    const rgb = this.colorService.hexToRgb(option.color);
    this.colorService.selectBackgroundColor(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`);
    const childrens = Array.from(this.svg.nativeElement.children)
    childrens.forEach(element => {
      element.remove();
    });
  }
}

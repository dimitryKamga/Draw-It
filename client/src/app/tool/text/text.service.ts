import {Injectable} from '@angular/core';
import {Dimension} from '../shape/common/dimension';
import {Rectangle} from '../shape/common/rectangle';
import {ToolService} from '../tool.service';
import {TextAlignement} from './text-alignement';
import {TextLine} from './text-line';
import {TextMutators} from './text-mutators';

interface Font {
  value: string;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})
export class TextService extends ToolService {
  readonly MAX_FONTSIZE: number = 80;
  readonly MIN_FONTSIZE: number = 4;
  readonly DEFAULT_FONTSIZE: number = 50;

  currentFont: string;
  textMutators: TextMutators;
  textAlignement: TextAlignement;
  fontSize: number;
  fontsList: Font[];
  currentZoneDims: Dimension;
  textZoneRectangle: Rectangle;

  constructor() {
    super();
    this.textMutators = {bold: false, italic: false, underline: false};
    this.textAlignement = TextAlignement.left;
    this.currentFont = 'Times New Roman';
    this.fontsList = [
      // sans serif
      {value: 'Arial, sans-serif', viewValue: 'Arial'},
      // {value: 'Helvetica, sans-serif', viewValue: 'Helvetica'},
      // {value: 'Gill Sans, sans-serif', viewValue: 'Gill Sans'},
      // {value: 'Lucida, sans-serif', viewValue: 'Lucida'},
      // {value: 'Helvetica Narrow, sans-serif', viewValue: 'Helvetica Narrow'},
      // serif
      // {value: 'Times, serif', viewValue: 'Times'},
      {value: 'Times New Roman, serif', viewValue: 'Times New Roman'},
      // {value: 'Palatino, serif', viewValue: 'Palatino'},
      // {value: 'Bookman, serif', viewValue: 'Bookman'},
      // {value: 'New Century Schoolbook, serif', viewValue: 'New Century Schoolbook'},
      // monospace
      {value: 'Andale Mono, monospace', viewValue: 'Andale Mono'},
      {value: 'Courier New, monospace', viewValue: 'Courier New'},
      // {value: 'Courier, monospace', viewValue: 'Courier'},
      // {value: 'Lucidatypewriter, monospace', viewValue: 'Lucidatypewriter'},
      // {value: 'Fixed, monospace', viewValue: 'Fixed'},
      // cursive
      // {value: 'Comic Sans, Comic Sans MS, cursive', viewValue: 'Comic Sans'},
      // {value: 'Zapf Chancery, cursive', viewValue: 'Zapf Chancery'},
      // {value: 'Coronetscript, cursive', viewValue: 'Coronetscript'},
      // {value: 'Florence, cursive', viewValue: 'Florence'},
      // {value: 'Parkavenue, cursive', viewValue: 'Parkavenue'},
      // fantasy
      // {value: 'Impact, fantasy', viewValue: 'Impact'},
      // {value: 'Arnoldboecklin, fantasy', viewValue: 'Arnoldboecklin'},
      // {value: 'Oldtown, fantasy', viewValue: 'Oldtown'},
      // {value: 'Blippo, fantasy', viewValue: 'Blippo'},
      // {value: 'Brushstroke, fantasy', viewValue: 'Brushstroke'}
    ];
    this.fontSize = this.DEFAULT_FONTSIZE;
  }

  getTextAlign(): number {
    return this.textAlignement === TextAlignement.left ? 0 : (
      this.textAlignement === TextAlignement.center ? this.currentZoneDims.width / 2 : this.currentZoneDims.width
    );
  }

  getTextAnchor(): string {
    return this.textAlignement === 'left' ? 'start' : (
      this.textAlignement === 'center' ? 'middle' : 'end'
    );
  }

  getFullTextWidth(currentLine: TextLine): number {
    const oldIndex = currentLine.cursorIndex;
    if (currentLine.tspan.textContent) {
      currentLine.cursorIndex = currentLine.tspan.textContent.length;
    }
    const fullTextWidth = this.getLineWidth(currentLine);
    currentLine.cursorIndex = oldIndex;

    return fullTextWidth;
  }

  getLineWidth(currentLine: TextLine): number {
    const oldText = currentLine.tspan.textContent;
    if (!!currentLine.tspan.textContent && currentLine.tspan.textContent.length !== currentLine.cursorIndex) {
      console.log('not at EOL');
      currentLine.tspan.textContent = currentLine.tspan.textContent.slice(0, currentLine.cursorIndex);
    }
    const xPos = (currentLine.tspan as SVGTextContentElement).getComputedTextLength();
    currentLine.tspan.textContent = oldText;
    return xPos;
  }
}
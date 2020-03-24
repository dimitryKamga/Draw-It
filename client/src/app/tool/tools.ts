import {
  Type
} from '@angular/core';
import {
  ApplicatorLogicComponent
} from './applicator/applicator-logic/applicator-logic.component';
import {
  ApplicatorPanelComponent
} from './applicator/applicator-panel/applicator-panel.component';
import {
  BucketLogicComponent
} from './bucket/bucket-logic/bucket-logic.component';
import {
  BucketPanelComponent
} from './bucket/bucket-panel/bucket-panel.component';
import {
  AerosolLogicComponent
} from './drawing-instruments/aerosol/aerosol-logic/aerosol-logic.component';
import {
  AerosolPanelComponent
} from './drawing-instruments/aerosol/aerosol-panel/aerosol-panel.component';
import {
  BrushLogicComponent
} from './drawing-instruments/brush/brush-logic/brush-logic.component';
import {
  BrushPanelComponent
} from './drawing-instruments/brush/brush-panel/brush-panel.component';
import {
  PencilLogicComponent
} from './drawing-instruments/pencil/pencil-logic/pencil-logic.component';
import {
  PencilPanelComponent
} from './drawing-instruments/pencil/pencil-panel/pencil-panel.component';
import {
  EraserLogicComponent
} from './eraser/eraser-logic/eraser-logic.component';
import {
  EraserPanelComponent
} from './eraser/eraser-panel/eraser-panel.component';
import {
  GridLogicComponent
} from './grid/grid-logic/grid-logic.component';
import {
  GridPanelComponent
} from './grid/grid-panel/grid-panel.component';
import {
  PipetteLogicComponent
} from './pipette/pipette-logic/pipette-logic.component';
import {
  PipettePanelComponent
} from './pipette/pipette-panel/pipette-panel.component';
import {
  SelectionLogicComponent
} from './selection/selection-logic/selection-logic.component';
import {
  SelectionPanelComponent
} from './selection/selection-panel/selection-panel.component';
import {
  EllipseLogicComponent
} from './shape/ellipse/ellipse-logic/ellipse-logic.component';
import {
  EllipsePanelComponent
} from './shape/ellipse/ellipse-panel/ellipse-panel.component';
import {
  LineLogicComponent
} from './shape/line/line-logic/line-logic.component';
import {
  LinePanelComponent
} from './shape/line/line-panel/line-panel.component';
import {
  PolygoneLogicComponent
} from './shape/polygone/polygone-logic/polygone-logic.component';
import {
  PolygonePanelComponent
} from './shape/polygone/polygone-panel/polygone-panel.component';
import {
  RectangleLogicComponent
} from './shape/rectangle/rectangle-logic/rectangle-logic.component';
import {
  RectanglePanelComponent
} from './shape/rectangle/rectangle-panel/rectangle-panel.component';
import {
  TextLogicComponent
} from './text/text-logic/text-logic.component';
import {
  TextPanelComponent
} from './text/text-panel/text-panel.component';
import {
  ToolLogicDirective
} from './tool-logic/tool-logic.directive';
import {
  ToolPanelDirective
} from './tool-panel/tool-panel.directive';
import {
  Tool
} from './tool.enum';

export const TOOL_MANAGER =
  new Map<Tool, [Type<ToolPanelDirective>, Type<ToolLogicDirective>]>();

TOOL_MANAGER.set(Tool.Applicator,
  [ApplicatorPanelComponent, ApplicatorLogicComponent]);
TOOL_MANAGER.set(Tool.Brush,
  [BrushPanelComponent, BrushLogicComponent]);
TOOL_MANAGER.set(Tool.Line,
  [LinePanelComponent, LineLogicComponent]);
TOOL_MANAGER.set(Tool.Pencil,
  [PencilPanelComponent, PencilLogicComponent]);
TOOL_MANAGER.set(Tool.Rectangle,
  [RectanglePanelComponent, RectangleLogicComponent]);
TOOL_MANAGER.set(Tool.Ellipse,
  [EllipsePanelComponent, EllipseLogicComponent]);
TOOL_MANAGER.set(Tool.Polygone,
  [PolygonePanelComponent, PolygoneLogicComponent]);
TOOL_MANAGER.set(Tool.Selection,
  [SelectionPanelComponent, SelectionLogicComponent]);
TOOL_MANAGER.set(Tool.Pipette,
   [PipettePanelComponent, PipetteLogicComponent]);
TOOL_MANAGER.set(Tool.Eraser,
  [EraserPanelComponent, EraserLogicComponent]);
TOOL_MANAGER.set(Tool.Aerosol,
  [AerosolPanelComponent, AerosolLogicComponent]);
TOOL_MANAGER.set(Tool.Grid,
  [GridPanelComponent, GridLogicComponent]);
TOOL_MANAGER.set(Tool.Bucket,
    [BucketPanelComponent, BucketLogicComponent]);
TOOL_MANAGER.set(Tool.Text,
  [TextPanelComponent, TextLogicComponent]);

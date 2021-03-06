import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  HostBinding,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  ToolPanelDirective } from '../tool/tool-panel/tool-panel.directive';
import {
  ToolSelectorService } from '../tool/tool-selector/tool-selector.service';
import { Tool } from '../tool/tool.enum';

import { ColorBoxComponent } from '../tool/color/color-box/color-box.component';
import * as Tools from '../tool/tools';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @ViewChild('container', {
    read: ViewContainerRef,
    static: true
  }) private viewContainerRef: ViewContainerRef;

  @ViewChild('chatBox', {
    read: ViewContainerRef,
    static: true
  }) private chatBoxRef: ViewContainerRef;

  @HostBinding('style.width.px')
  private hostWidth: number;

  private readonly components: Type<ToolPanelDirective>[];
  private childWidth: number;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly toolSelectorService: ToolSelectorService,
  ) {
    this.components = new Array(Tool._Len);
    for (const entry of Tools.TOOL_MANAGER) {
      this.components[entry[0]] = entry[1][0];
    }
    this.childWidth = 0;
    this.hostWidth = 0;
  }

  ngOnInit(): void {
    this.toolSelectorService.onSame(() => this.toggle());
    this.toolSelectorService.onChange((tool: Tool) => this.setTool(tool));
  }

  private toggle(): void {
    this.hostWidth = this.hostWidth ? 0 : this.childWidth;
    this.chatBoxRef.clear();
    if (this.hostWidth !== 0) {
      this.addColorBox();
    }
  }

  private setTool(tool: Tool): ComponentRef<ToolPanelDirective> | null {
    if (tool >= Tool._Len) {
      return null;
    }

    this.viewContainerRef.clear();
    const component = this.components[tool];
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      component
    );
    const ref = this.viewContainerRef.createComponent(factory);
    ref.instance.width.subscribe((w: number) => this.setWidthOfChild(w));
    ref.changeDetectorRef.detectChanges();
    this.chatBoxRef.clear();
    this.addColorBox();
    return ref;
  }

  private addColorBox(): void {
    const factory = this.componentFactoryResolver.resolveComponentFactory(ColorBoxComponent);
    this.chatBoxRef.createComponent(factory);
  }

  private setWidthOfChild(width: number): void {
    this.hostWidth = this.childWidth = width;
  }

}

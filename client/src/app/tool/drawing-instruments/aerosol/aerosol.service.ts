import { Injectable } from '@angular/core';
import {ToolService} from '../../tool.service';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends ToolService{

  constructor() {
    super();
  }
}

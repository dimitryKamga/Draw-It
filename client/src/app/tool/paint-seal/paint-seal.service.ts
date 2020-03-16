import { Injectable } from '@angular/core';

const DEFAULT_TOLERANCE = 50;

@Injectable({
  providedIn: 'root'
})
export class PaintSealService {

  tolerance: number;

  constructor() {
    this.tolerance = DEFAULT_TOLERANCE;
  }

}

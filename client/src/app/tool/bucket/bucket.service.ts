import { Injectable } from '@angular/core';

const DEFAULT_TOLERANCE = 0;

@Injectable({
  providedIn: 'root'
})
export class BucketService {

  tolerance: number;

  constructor() {
    this.tolerance = DEFAULT_TOLERANCE;
  }

}

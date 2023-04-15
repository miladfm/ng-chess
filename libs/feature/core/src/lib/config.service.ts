import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ConfigService {

  private squareLength = 8;

  public get _squareLength() {
    return this.squareLength;
  }

  public setSquareLength(length: number) {
    this.squareLength = length;
  }

}
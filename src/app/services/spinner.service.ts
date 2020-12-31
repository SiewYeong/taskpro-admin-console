import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  spinnerActive: EventEmitter<boolean>;

  constructor() { 
    this.spinnerActive = new EventEmitter();
  }

  show() {
    this.spinnerActive.emit(true);
  }

  hide() {
    this.spinnerActive.emit(false);
  }
}

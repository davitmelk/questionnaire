import { Injectable } from '@angular/core';

declare const jQuery: any;

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private modal: any;

  constructor() { }

  public init(modal: any) {
    this.modal = modal;
  }

  public show(text: string) {
    this.modal.text = text;
    jQuery(this.modal.element.childNodes[0]).modal('show');
  }

  public hide() {
    jQuery(this.modal.element.childNodes[0]).modal('hide');
  }
}

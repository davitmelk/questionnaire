import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { AlertService } from './alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() text: string;
  private element: any;

  constructor(
    private alertService: AlertService,
    private elementRef: ElementRef
  ) { 
    this.element = elementRef.nativeElement;
  }

  ngOnInit() {
    this.alertService.init(this);
  }
}

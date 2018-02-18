import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {
  @Input() buttonId: string;
  @Input() default: boolean;
  @Input() icon: string;
  @Output() onButtonClick = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    if(this.default){
      this.onButtonClick.emit(this.buttonId);
    }
  }

  onChange(){
    this.onButtonClick.emit(this.buttonId);
  }
}

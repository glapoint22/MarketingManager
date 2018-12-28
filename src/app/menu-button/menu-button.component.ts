import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SaveService } from '../save.service';
import { PromptService } from '../prompt.service';

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

  constructor(public saveService: SaveService, private promptService: PromptService) { }

  ngOnInit() {
    if (this.default) {
      this.onButtonClick.emit(this.buttonId);
    }
  }

  onChange() {
    this.onButtonClick.emit(this.buttonId);
  }

  onClick() {
    if (this.saveService.isChange()) {
      this.promptService.prompt('Unsaved Data', 'You have unsaved data. You must save before you can proceed.', [
        {
          text: 'Ok',
          callback: () => { }
        }
      ]);
    }
  }
}
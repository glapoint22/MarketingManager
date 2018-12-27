import { Component, HostListener } from '@angular/core';
import { PromptService } from "../prompt.service";

@Component({
  selector: 'prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {

  constructor(public promptService: PromptService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape'){
      this.promptService.show = false;
    }
  }
}
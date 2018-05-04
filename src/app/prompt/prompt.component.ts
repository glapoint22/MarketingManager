import { Component } from '@angular/core';
import { PromptService } from "../prompt.service";

@Component({
  selector: 'prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss']
})
export class PromptComponent {

  constructor(public promptService: PromptService) { }
}
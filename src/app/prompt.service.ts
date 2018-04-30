import { Injectable } from '@angular/core';

@Injectable()
export class PromptService {
  public show: boolean;
  public title: string;
  public text: string;
  public buttons: Array<any> = [];

  constructor() { }

  prompt(title: string, text: string, buttons: Array<any>) {
    this.show = true;
    this.title = title;
    this.text = text;
    this.buttons = buttons;
    window.setTimeout(() => {
      document.getElementById('default-prompt-button').focus();
    }, 1);
  }
}
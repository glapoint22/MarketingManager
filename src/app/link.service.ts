import { Injectable } from '@angular/core';
import { Style } from './style';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  public show: boolean;
  public selectedOption;
  public linkOptions;
  private style: Style;

  constructor() { }

  showForm(style: Style, gridItem){
    this.style = style;

    this.linkOptions = [
      {
        name: 'Custom',
        value: ''
      },
      {
        name: 'Home (https://www.nicheshack.com)',
        value: 'https://www.nicheshack.com'
      },
      {
        name: 'Email Preferences',
        value: 'https://www.nicheshack.com/preferences?cid={2}'
      },
      {
        name: 'This Email',
        value: 'https://www.nicheshack.com/mail?eid={1}&cid={2}'
      },
    ];

    this.selectedOption = this.linkOptions[0]

    this.show = true;
  }

  applyLink(){
    this.style.styleValue = this.selectedOption.value;
    this.style.onClick();
    this.show = false;
  }
}

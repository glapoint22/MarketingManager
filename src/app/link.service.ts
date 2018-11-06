import { Injectable } from '@angular/core';
import { Style } from './style';
import { EditBoxComponent } from './edit-box/edit-box.component';

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  public show: boolean;
  public selectedOption;
  public linkOptions;
  private style: Style;

  constructor() { }

  showForm(style: Style, gridItem) {
    this.style = style;

    this.linkOptions = [
      {
        name: 'Custom',
        value: ''
      },
      {
        name: 'www.nicheshack.com',
        value: '{3}'
      },
      {
        name: 'Email Preferences',
        value: '{3}/preferences?cid={2}'
      },
      {
        name: 'This Email',
        value: '{3}/mail?eid={1}&cid={2}'
      },
    ];

    if (gridItem.hoplink) {
      this.linkOptions.push({
        name: 'Hoplink',
        value: gridItem.hoplink + '?tid={2}' + gridItem.id
      });
    } else if (gridItem.leadMagnet) {
      this.linkOptions.push({
        name: 'Lead Magnet',
        value: '{3}/Downloads/' + gridItem.leadMagnet
      });
    }

    this.selectedOption = this.linkOptions[0]
    this.show = true;
  }

  applyLink() {
    this.style.styleValue = this.selectedOption.value;
    this.style.onClick();
    this.show = false;
    EditBoxComponent.change.next();
  }
}

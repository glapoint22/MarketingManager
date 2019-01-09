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


  showForm(style: Style, gridItem) {
    if (gridItem.itemType) return;
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

    if (!this.style.styleValue) {
      this.selectedOption = this.linkOptions[0];
    } else {
      let option = this.linkOptions.find(x => x.value === this.style.styleValue);

      if (option) {
        this.selectedOption = option;
      } else {
        this.linkOptions[0].value = this.style.styleValue;
        this.selectedOption = this.linkOptions[0];
      }

    }

    this.show = true;
  }

  applyLink() {
    this.style.styleValue = this.selectedOption.value;
    this.style.onClick();
    this.show = false;
    EditBoxComponent.change.next();
  }

  validateUrl(string: string): boolean {
    let urlPattern = /href="(\{3\}([\/a-zA-Z\?=\{\d\}&\.]+)?|([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=\{\}]*))"/,
      hrefPattern = /href="[a-zA-Z0-9:\/.\?\{\}\=]+"/g,
      match = hrefPattern.exec(string);

    while (match !== null) {
      if (!urlPattern.test(match[0])) {
        return false;
      }
      match = hrefPattern.exec(string);
    }

    return true;
  }
}

import { Component, HostListener } from '@angular/core';
import { Vector2 } from '../vector2';
import { LinkService } from '../link.service';
import { Rect } from '../rect';
import { EditBoxService } from '../edit-box.service';
import { EditBoxManagerService } from '../edit-box-manager.service';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  public gridItem;
  public Math = Math;

  constructor(private linkService: LinkService, public editBoxService: EditBoxService, public editBoxManagerService: EditBoxManagerService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape' && this.editBoxManagerService.currentEditBox && this.editBoxManagerService.currentEditBox.isSelected) {
      if (this.linkService.show) {
        this.linkService.show = false;
      }
    }
  }

  showLinkForm(style) {
    if (this.editBoxManagerService.currentEditBox.inEditMode || style.group === 'editBoxLink') {
      this.linkService.showForm(style, this.gridItem);
    }
  }

  setX(input) {
    let editBox = this.editBoxManagerService.currentEditBox;

    if (input.value === '') input.value = 0;


    editBox.setRect(() => {
      return new Rect(input.valueAsNumber, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.x;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setY(input) {
    let editBox = this.editBoxManagerService.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.setRect(() => {
      return new Rect(editBox.rect.x, input.valueAsNumber, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.y;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setWidth(input) {
    let editBox = this.editBoxManagerService.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'right';
    editBox.setRightHandle(new Vector2(input.valueAsNumber - input.oldValue, 0));
    if (editBox.rect.width !== input.valueAsNumber) input.value = editBox.rect.width;
  }

  setHeight(input) {
    let editBox = this.editBoxManagerService.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'bottom';
    editBox.setBottomHandle(new Vector2(0, input.valueAsNumber - input.oldValue));
    if (editBox.rect.height !== input.valueAsNumber) input.value = editBox.rect.height;
  }

  setChange(){
    this.editBoxManagerService.change.next();
  }
}
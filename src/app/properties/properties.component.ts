import { Component, HostListener } from '@angular/core';
import { Vector2 } from '../vector2';
import { LinkService } from '../link.service';
import { Rect } from '../rect';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Container } from '../container';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  public gridItem;
  public Math = Math;
  public editBox = EditBoxComponent;

  constructor(private linkService: LinkService, public editBoxService: EditBoxService) { }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape' && EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      if (this.linkService.show) {
        this.linkService.show = false;
      }
    }
  }

  showLinkForm(style) {
    if (EditBoxComponent.currentEditBox.inEditMode || style.group === 'editBoxLink') {
      this.linkService.showForm(style, this.gridItem);
    }
  }

  setX(input) {
    let editBox = EditBoxComponent.currentEditBox;

    if (input.value === '') input.value = 0;


    editBox.setRect(() => {
      return new Rect(input.valueAsNumber, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.x;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setY(input) {
    let editBox = EditBoxComponent.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.setRect(() => {
      return new Rect(editBox.rect.x, input.valueAsNumber, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.y;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
    if (editBox.row.boxes.length === 1) editBox.row.rowElement.style.opacity = '0';
    Container.currentContainer.setHeight();
  }

  setWidth(input) {
    let editBox = EditBoxComponent.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'right';
    editBox.setRightHandle(new Vector2(input.valueAsNumber - input.oldValue, 0));
    if (editBox.rect.width !== input.valueAsNumber) input.value = editBox.rect.width;
    if (editBox.row.boxes.length === 1) editBox.row.rowElement.style.opacity = '0';
    editBox.container.alignRows();
    Container.currentContainer.setHeight();
  }

  setHeight(input) {
    let editBox = EditBoxComponent.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'bottom';
    editBox.setBottomHandle(new Vector2(0, input.valueAsNumber - input.oldValue));
    if (editBox.rect.height !== input.valueAsNumber) input.value = editBox.rect.height;
    if (editBox.row.boxes.length === 1) editBox.row.rowElement.style.opacity = '0';
    Container.currentContainer.setHeight();
  }

  setChange(event: KeyboardEvent, input: HTMLInputElement) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      EditBoxComponent.currentEditBox.updateRow();
      EditBoxComponent.change.next();

      if (event.code === 'Enter' || event.code === 'NumpadEnter') input.blur();
    }
  }

  setAlignment(alignment) {
    switch (alignment) {
      case 'left':
        EditBoxComponent.currentEditBox.row.alignBoxesLeft();
        break;
      case 'center':
        EditBoxComponent.currentEditBox.row.alignBoxesCenter();
        break;
      case 'right':
        EditBoxComponent.currentEditBox.row.alignBoxesRight();
        break;
    }
    EditBoxComponent.change.next();
  }
}
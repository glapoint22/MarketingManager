import { Component, HostListener, Input } from '@angular/core';
import { Vector2 } from '../vector2';
import { LinkService } from '../link.service';
import { Rect } from '../rect';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Container } from '../container';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  @Input() gridItem;
  public Math = Math;
  public editBox = EditBoxComponent;
  private ctrlDown: boolean;

  constructor(private linkService: LinkService, public editBoxService: EditBoxService) { }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Control
    if (event.code === 'ControlLeft' || event.code === 'ControlRight') this.ctrlDown = true;

    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      //Escape
      if (event.code === 'Escape') {
        if (this.linkService.show) {
          this.linkService.show = false;
        }
      }

      // Delete
      if (event.code === 'Delete') {
        this.editBoxService.delete();
      }

      // Copy
      if (this.ctrlDown && event.code === 'KeyC') {
        this.editBoxService.copy();
      }

      // Cut
      if (this.ctrlDown && event.code === 'KeyX') {
        this.editBoxService.cut();
      }
    }

    // Paste
    if (this.ctrlDown && event.code === 'KeyV') {
      this.editBoxService.paste();
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(event: KeyboardEvent) {
    if (this.ctrlDown && (event.code === 'ControlLeft' || event.code === 'ControlRight')) {
      this.ctrlDown = false;
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

  setChange(event) {
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      EditBoxComponent.currentEditBox.updateRow();
      EditBoxComponent.change.next();

      if (event.code === 'Enter' || event.code === 'NumpadEnter') event.target.blur();
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

  isDisabled() {
    return !this.editBox.currentEditBox || !this.editBox.currentEditBox.isSelected ||
      this.editBox.currentEditBox instanceof ContainerBoxComponent || this.editBox.currentEditBox instanceof ImageBoxComponent;
  }

  onEditClick() {
    if (this.editBox.currentEditBox.inEditMode) {
      this.editBox.currentEditBox.unSelect();
    } else {
      this.editBox.currentEditBox.setEditMode();
    }
  }

  getEditButtonCaption() {
    if (!this.editBox.currentEditBox || !this.editBox.currentEditBox.inEditMode) return 'Edit';
    return 'Exit Edit';
  }
}
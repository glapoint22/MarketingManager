import { Component, HostListener } from '@angular/core';
import { TextBoxComponent } from '../text-box/text-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { Vector2 } from '../vector2';
import { LinkService } from '../link.service';
import { Rect } from '../rect';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { EditBoxService } from '../edit-box.service';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  public copied: any = {};
  public gridItem;
  public Math = Math;
  public editBox = EditBoxComponent;

  constructor(private linkService: LinkService, private editBoxService: EditBoxService) { }


  delete() {
    if (this.editBox.currentEditBox && this.editBox.currentEditBox.isSelected) {
      if(this.editBox.currentEditBox instanceof ContainerBoxComponent){
        this.editBox.currentContainer = this.editBox.currentEditBox.parentContainer;
      }

      let index = this.editBox.currentContainer.components.findIndex(x => x === this.editBox.currentEditBox);
      this.editBox.currentEditBox = null;
      this.editBox.currentContainer.remove(index);
      this.editBox.currentContainer.components.splice(index, 1);
    }
  }

  copy() {
    if (this.editBox.currentEditBox && this.editBox.currentEditBox.isSelected) {
      // Text
      if (this.editBox.currentEditBox instanceof TextBoxComponent) {
        this.copied.component = TextBoxComponent;
        this.copied.contentContainerType = 'iframe';

        // Image
      } else if (this.editBox.currentEditBox instanceof ImageBoxComponent) {
        this.copied.component = ImageBoxComponent;
        this.copied.contentContainerType = 'img';
        this.copied.src = this.editBox.currentEditBox.contentContainer.src;
        this.copied.link = this.editBox.currentEditBox.link;

        // Button
      } else if (this.editBox.currentEditBox instanceof ButtonBoxComponent) {
        this.copied.component = ButtonBoxComponent;
        this.copied.contentContainerType = 'iframe';
        this.copied.link = this.editBox.currentEditBox.link;

        // Container
      } else if (this.editBox.currentEditBox instanceof ContainerBoxComponent) {
        this.copied.component = ContainerBoxComponent;
        this.copied.contentContainerType = null;
      }

      this.copied.backgroundColor = this.editBox.currentEditBox.editBox.nativeElement.style.backgroundColor;
      this.copied.content = this.editBox.currentEditBox.content ? this.editBox.currentEditBox.content.innerHTML : null;
      this.copied.size = new Vector2(this.editBox.currentEditBox.rect.width, this.editBox.currentEditBox.rect.height);
    }
  }

  paste() {
    if (this.copied.component) {
      let box = this.editBoxService.createBox(this.copied.component, this.copied.contentContainerType);

      if (this.copied.contentContainerType === 'img') {
        box.instance.contentContainer.src = this.copied.src;
        box.instance.contentContainer.onload = () => {
          box.instance.initialize(this.copied);
        }
      } else {
        box.instance.initialize(this.copied);
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape') {
      if (this.linkService.show) {
        this.linkService.show = false;
      } else {
        this.editBox.currentEditBox.unSelect();
      }

    }
  }

  showLinkForm(style) {
    if (this.editBox.currentEditBox.inEditMode || style.group === 'editBoxLink') {
      this.linkService.showForm(style, this.gridItem);
    }
  }

  setX(input) {
    let editBox = this.editBox.currentEditBox;

    if (input.value === '') input.value = 0;


    editBox.setRect(() => {
      return new Rect(input.valueAsNumber, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.x;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setY(input) {
    let editBox = this.editBox.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.setRect(() => {
      return new Rect(editBox.rect.x, input.valueAsNumber, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.y;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setWidth(input) {
    let editBox = this.editBox.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'right';
    editBox.setRightHandle(new Vector2(input.valueAsNumber - input.oldValue, 0));
    if (editBox.rect.width !== input.valueAsNumber) input.value = editBox.rect.width;
  }

  setHeight(input) {
    let editBox = this.editBox.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'bottom';
    editBox.setBottomHandle(new Vector2(0, input.valueAsNumber - input.oldValue));
    if (editBox.rect.height !== input.valueAsNumber) input.value = editBox.rect.height;
  }
}
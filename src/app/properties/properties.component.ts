import { Component, Input, ComponentFactoryResolver, HostListener } from '@angular/core';
import { TextBoxComponent } from '../text-box/text-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { Vector2 } from '../vector2';
import { LinkService } from '../link.service';
import { Rect } from '../rect';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent {
  @Input() currentContainer;
  public copied: any = {};
  public gridItem;
  public Math = Math;

  constructor(private resolver: ComponentFactoryResolver, private linkService: LinkService) { }


  delete() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      let index = this.currentContainer._embeddedViews.findIndex(x => x.nodes[1].instance === this.currentContainer.currentEditBox);
      this.currentContainer.currentEditBox = null;
      this.currentContainer.remove(index);
    }
  }

  copy() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      // Text
      if (this.currentContainer.currentEditBox instanceof TextBoxComponent) {
        this.copied.component = TextBoxComponent;
        this.copied.contentContainerType = 'iframe';

        // Image
      } else if (this.currentContainer.currentEditBox instanceof ImageBoxComponent) {
        this.copied.component = ImageBoxComponent;
        this.copied.contentContainerType = 'img';
        this.copied.src = this.currentContainer.currentEditBox.contentContainer.src;
        this.copied.link = this.currentContainer.currentEditBox.link;

        // Button
      } else if (this.currentContainer.currentEditBox instanceof ButtonBoxComponent) {
        this.copied.component = ButtonBoxComponent;
        this.copied.contentContainerType = 'iframe';
        this.copied.link = this.currentContainer.currentEditBox.link;

        // Container
      } else if (this.currentContainer.currentEditBox instanceof ContainerBoxComponent) {
        this.copied.component = ContainerBoxComponent;
        this.copied.contentContainerType = 'div';
      }

      this.copied.backgroundColor = this.currentContainer.currentEditBox.editBox.nativeElement.style.backgroundColor;
      this.copied.content = this.currentContainer.currentEditBox.content ? this.currentContainer.currentEditBox.content.innerHTML : null;
      this.copied.size = new Vector2(this.currentContainer.currentEditBox.rect.width, this.currentContainer.currentEditBox.rect.height);
    }
  }

  paste() {
    if (this.copied.component) {
      let componentFactory = this.resolver.resolveComponentFactory(this.copied.component),
        contentContainer = document.createElement(this.copied.contentContainerType),
        box = this.currentContainer.createComponent(componentFactory, null, null, [[contentContainer]]);

      box.instance.contentContainer = contentContainer;
      box.instance.parentContainer = this.currentContainer;

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
        this.currentContainer.currentEditBox.unSelect();
      }

    }
  }

  showLinkForm(style) {
    if (this.currentContainer.currentEditBox.inEditMode || style.group === 'editBoxLink') {
      this.linkService.showForm(style, this.gridItem);
    }
  }

  setX(input) {
    let editBox = this.currentContainer.currentEditBox;

    if (input.value === '') input.value = 0;


    editBox.setRect(() => {
      return new Rect(input.valueAsNumber, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.x;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setY(input) {
    let editBox = this.currentContainer.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.setRect(() => {
      return new Rect(editBox.rect.x, input.valueAsNumber, editBox.rect.width, editBox.rect.height);
    }, () => {
      input.value = editBox.rect.y;
      return new Rect(editBox.rect.x, editBox.rect.y, editBox.rect.width, editBox.rect.height);
    });
  }

  setWidth(input) {
    let editBox = this.currentContainer.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'right';
    editBox.setRightHandle(new Vector2(input.valueAsNumber - input.oldValue, 0));
    if (editBox.rect.width !== input.valueAsNumber) input.value = editBox.rect.width;
  }

  setHeight(input) {
    let editBox = this.currentContainer.currentEditBox;

    if (input.value === '') input.value = 0;

    editBox.handle = 'bottom';
    editBox.setBottomHandle(new Vector2(0, input.valueAsNumber - input.oldValue));
    if (editBox.rect.height !== input.valueAsNumber) input.value = editBox.rect.height;
  }
}
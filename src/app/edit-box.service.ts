import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ButtonBoxComponent } from './button-box/button-box.component';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { DataService } from './data.service';
import { ImageBoxComponent } from './image-box/image-box.component';
import { Rect } from './rect';
import { EditBoxManagerService } from './edit-box-manager.service';
import { Container } from './container';
import { ContextMenu, MenuGroup, MenuRow } from './context-menu';

@Injectable({
  providedIn: 'root'
})
export class EditBoxService {
  public copied: any = {};
  private fileInput = document.createElement('input');

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService, private editBoxManagerService: EditBoxManagerService) {
    this.fileInput.type = 'file';
    this.fileInput.onchange = (event: any) => {
      if (event.target.files.length > 0) {
        let file: File = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append('image', file, file.name);

        this.dataService.post('/api/Image', formData)
          .subscribe((imageName: any) => {
            let box = this.createBox(ImageBoxComponent, this.editBoxManagerService.currentContainer, 'img');
            this.setChange([box.instance]);
            box.instance.contentContainer.src = 'Images/' + imageName;
            box.instance.contentContainer.onload = () => {
              box.instance.initialize();
            }
          });
      }
    }
    this.createMenu();
  }

  createMenu() {
    let menuGroup: MenuGroup = this.editBoxManagerService.boxMenu.createMenuGroup(),
      rowCaptions = ['Insert Left', 'Insert Right', 'Insert Top', 'Insert Bottom'],
      subRowCaptions = ['Textbox', 'Button', 'Image', 'Container']

    for (let i = 0; i < 4; i++) {
      let menuRow: MenuRow = menuGroup.createMenuRow(rowCaptions[i]);

      menuRow.subMenu = new ContextMenu();
      menuRow.subMenu.createMenuGroup().createMenuRow('Paste', () => this.menuPaste(menuRow.caption), () => { return !this.copied.boxType });

      let subMenuGroup = menuRow.subMenu.createMenuGroup();
      for (let j = 0; j < 4; j++) {
        subMenuGroup.createMenuRow(subRowCaptions[j], () => this.menuBoxCreate(menuRow.caption, subRowCaptions[j]));
      }
    }
  }

  menuPaste(insertType) {
    if (!this.copied.boxType) return;

    if (this.editBoxManagerService.currentEditBox instanceof ContainerBoxComponent) {
      this.editBoxManagerService.currentContainer = this.editBoxManagerService.currentEditBox.container;
    }

    this.editBoxManagerService.insertType = insertType.substring(7).toLocaleLowerCase();
    this.paste();
  }
  menuBoxCreate(insertType, boxType) {
    if (this.editBoxManagerService.currentEditBox instanceof ContainerBoxComponent) {
      this.editBoxManagerService.currentContainer = this.editBoxManagerService.currentEditBox.container;
    }

    this.editBoxManagerService.insertType = insertType.substring(7).toLocaleLowerCase();

    switch (boxType) {
      case 'Textbox':
        this.createTextBox();
        break;
      case 'Button':
        this.createButtonBox();
        break;
      case 'Image':
        this.createImageBox();
        break;
      case 'Container':
        this.createContainerBox();
        break;
    }
  }

  createTextBox(boxData?): TextBoxComponent {
    let box = this.createBox(TextBoxComponent, this.editBoxManagerService.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if (!boxData) this.setChange([box.instance]);
    return box.instance as TextBoxComponent;
  }

  createButtonBox(boxData?): ButtonBoxComponent {
    let box = this.createBox(ButtonBoxComponent, this.editBoxManagerService.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if (!boxData) this.setChange([box.instance]);
    return box.instance as ButtonBoxComponent;
  }

  createContainerBox(boxData?): ContainerBoxComponent {
    let box = this.createBox(ContainerBoxComponent, this.editBoxManagerService.currentContainer);
    box.instance.initialize(boxData)
    if (!boxData) this.setChange([box.instance]);
    return box.instance as ContainerBoxComponent;
  }

  createImageBox(boxData?): ImageBoxComponent {
    if (boxData) {
      let imageBox = this.createBox(ImageBoxComponent, this.editBoxManagerService.currentContainer, 'img');
      this.setImageBox(imageBox, boxData);
      return imageBox.instance as ImageBoxComponent;
    } else {
      this.fileInput.click();
    }
  }

  createBox(boxType: Type<EditBoxComponent>, container: Container, contentContainerType?: string) {
    let componentFactory = this.resolver.resolveComponentFactory(boxType),
      contentContainer = document.createElement(contentContainerType),
      newBox = container.viewContainerRef.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    // Set the editbox properties
    newBox.instance.contentContainer = contentContainer;
    newBox.instance.container = container;

    // Add this new box to the container
    container.boxes.push(newBox.instance);

    return newBox;
  }

  delete() {
    if (this.editBoxManagerService.currentEditBox && this.editBoxManagerService.currentEditBox.isSelected) {
      if (this.editBoxManagerService.currentEditBox instanceof ContainerBoxComponent) {
        this.editBoxManagerService.currentContainer = this.editBoxManagerService.currentEditBox.container;
      }

      // Get the index of the current box
      let index = this.editBoxManagerService.currentContainer.boxes.findIndex(x => x === this.editBoxManagerService.currentEditBox);

      // Delete the box from the viewContainerRef and its container
      this.editBoxManagerService.currentContainer.viewContainerRef.remove(index);
      this.editBoxManagerService.currentContainer.deleteBox(this.editBoxManagerService.currentEditBox);
      this.editBoxManagerService.currentEditBox = null;

      // Mark that there is a change and set the container height
      this.editBoxManagerService.change.next();
      this.editBoxManagerService.currentContainer.setHeight();
    }
  }

  copy() {
    if (this.editBoxManagerService.currentEditBox && this.editBoxManagerService.currentEditBox.isSelected) {
      this.copied = this.copyBox(this.editBoxManagerService.currentEditBox);
      this.copied.isSelected = true;
    }
  }

  cut() {
    this.copy();
    this.delete();
  }

  copyBox(box: EditBoxComponent, preservePosition?: boolean) {
    let copied: any = {}

    // Text
    if (box instanceof TextBoxComponent) {
      copied.boxType = TextBoxComponent;
      copied.contentContainerType = 'iframe';

      // Image
    } else if (box instanceof ImageBoxComponent) {
      copied.boxType = ImageBoxComponent;
      copied.contentContainerType = 'img';
      copied.src = box.contentContainer.src;
      copied.link = box.link;

      // Button
    } else if (box instanceof ButtonBoxComponent) {
      copied.boxType = ButtonBoxComponent;
      copied.contentContainerType = 'iframe';
      copied.link = box.link;

      // Container
    } else if (box instanceof ContainerBoxComponent) {
      copied.boxType = ContainerBoxComponent;
      copied.contentContainerType = null;
      copied.boxes = box.boxContainer.boxes ? this.copyBoxes(box.boxContainer.boxes) : null;
    }

    copied.backgroundColor = box.backgroundColor;
    copied.content = box.content ? box.content.innerHTML : null;
    if (preservePosition) {
      copied.rect = new Rect(box.rect.x, box.rect.y, box.rect.width, box.rect.height);
    } else {
      copied.rect = new Rect(null, null, box.rect.width, box.rect.height);
    }

    return copied;
  }

  copyBoxes(boxes) {
    let boxCopies = [];
    boxes.forEach(x => boxCopies.push(this.copyBox(x, true)));
    return boxCopies;
  }

  setImageBox(box, boxData) {
    box.instance.contentContainer.src = boxData.src;
    box.instance.contentContainer.onload = () => {
      box.instance.initialize(boxData);
    }
  }

  paste() {
    if (this.copied.boxType) {
      let box = this.createBox(this.copied.boxType, this.editBoxManagerService.currentContainer, this.copied.contentContainerType);
      let newBoxes: Array<EditBoxComponent> = [];

      newBoxes.push(box.instance);

      // Image
      if (this.copied.boxType === ImageBoxComponent) {
        this.setImageBox(box, this.copied);
        // Container
      } else if (this.copied.boxType === ContainerBoxComponent) {
        box.instance.initialize(this.copied);

        // Create the boxes in the container
        this.createBoxesInContainer(box.instance.container, this.copied.boxes, newBoxes);
      } else {
        box.instance.initialize(this.copied);
      }

      this.setChange(newBoxes);
    }
  }

  setChange(changedBoxes: Array<EditBoxComponent>) {
    // Mark a change has happened when all boxes have loaded
    let interval = window.setInterval(() => {
      if (changedBoxes.every(x => x.isLoaded)) {
        this.editBoxManagerService.change.next();
        this.editBoxManagerService.currentContainer.setHeight();
        window.clearInterval(interval);
      }
    }, 1);
  }

  createBoxesInContainer(container, boxes, newBoxes: Array<EditBoxComponent>) {
    if (boxes) {
      boxes.forEach(boxData => {
        // create a new box
        let newBox = this.createBox(boxData.boxType, container, boxData.contentContainerType);
        newBoxes.push(newBox.instance);

        // Image
        if (boxData.boxType === ImageBoxComponent) {
          this.setImageBox(newBox, boxData);

          // Container
        } else if (boxData.boxType === ContainerBoxComponent) {
          newBox.instance.initialize(boxData);
          this.createBoxesInContainer(newBox.instance.container, boxData.boxes, newBoxes);
          // Other
        } else {
          newBox.instance.initialize(boxData);
        }
      });
    }
  }
}
import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ButtonBoxComponent } from './button-box/button-box.component';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { DataService } from './data.service';
import { ImageBoxComponent } from './image-box/image-box.component';
import { Rect } from './rect';
import { Container } from './container';
import { ContextMenu, MenuGroup, MenuRow } from './context-menu';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class EditBoxService {
  public copied: any = {};
  private fileInput = document.createElement('input');
  private spawnPosition: string;

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService, private menuService: MenuService) {
    this.fileInput.type = 'file';
    this.fileInput.onchange = (event: any) => {
      if (event.target.files.length > 0) {
        let file: File = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append('image', file, file.name);

        this.dataService.post('/api/Image', formData)
          .subscribe((imageName: any) => {
            let box = this.createBox(ImageBoxComponent, Container.currentContainer, 'img');
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
    // Insert
    let menuGroup: MenuGroup = this.menuService.menu.createMenuGroup(),
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

    // Alignment
    menuGroup = this.menuService.menu.createMenuGroup();
    menuGroup.createMenuRow('Align Boxes Left', () => {EditBoxComponent.currentEditBox.row.alignBoxesLeft(), EditBoxComponent.change.next()});
    menuGroup.createMenuRow('Align Boxes Center', () => {EditBoxComponent.currentEditBox.row.alignBoxesCenter(), EditBoxComponent.change.next()});
    menuGroup.createMenuRow('Align Boxes Right', () => {EditBoxComponent.currentEditBox.row.alignBoxesRight(), EditBoxComponent.change.next()});
  }

  menuPaste(insertType) {
    if (!this.copied.boxType) return;

    if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
      Container.currentContainer = EditBoxComponent.currentEditBox.container;
    }

    this.spawnPosition = insertType.substring(7).toLocaleLowerCase();
    this.paste();
  }
  menuBoxCreate(insertType, boxType) {
    if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
      Container.currentContainer = EditBoxComponent.currentEditBox.container;
    }

    this.spawnPosition = insertType.substring(7).toLocaleLowerCase();

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
    let box = this.createBox(TextBoxComponent, Container.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if (!boxData) this.setChange([box.instance]);
    return box.instance as TextBoxComponent;
  }

  createButtonBox(boxData?): ButtonBoxComponent {
    let box = this.createBox(ButtonBoxComponent, Container.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if (!boxData) this.setChange([box.instance]);
    return box.instance as ButtonBoxComponent;
  }

  createContainerBox(boxData?): ContainerBoxComponent {
    let box = this.createBox(ContainerBoxComponent, Container.currentContainer);
    box.instance.initialize(boxData)
    if (!boxData) this.setChange([box.instance]);
    return box.instance as ContainerBoxComponent;
  }

  createImageBox(boxData?): ImageBoxComponent {
    if (boxData) {
      let imageBox = this.createBox(ImageBoxComponent, Container.currentContainer, 'img');
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
    newBox.instance.spawnPosition = this.spawnPosition;
    this.spawnPosition = null;

    // Add this new box to the container
    container.boxes.push(newBox.instance);

    return newBox;
  }

  delete() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
        Container.currentContainer = EditBoxComponent.currentEditBox.container;
      }

      // Get the index of the current box
      let index = Container.currentContainer.boxes.findIndex(x => x === EditBoxComponent.currentEditBox);

      // Delete the box from the viewContainerRef and its container
      Container.currentContainer.viewContainerRef.remove(index);
      Container.currentContainer.deleteBox(EditBoxComponent.currentEditBox);
      EditBoxComponent.currentEditBox = null;

      // Mark that there is a change and set the container height
      EditBoxComponent.change.next();
      Container.currentContainer.setHeight();
    }
  }

  copy() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      this.copied = this.copyBox(EditBoxComponent.currentEditBox);
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
      let box = this.createBox(this.copied.boxType, Container.currentContainer, this.copied.contentContainerType);
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
        EditBoxComponent.change.next();
        Container.currentContainer.setHeight();
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
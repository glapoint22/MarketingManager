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
import { Row } from './row';
import { PromptService } from './prompt.service';

@Injectable({
  providedIn: 'root'
})
export class EditBoxService {
  public loadedBoxes: Array<EditBoxComponent> = [];
  public copied: any = {};
  private fileInput = document.createElement('input');
  private spawnPosition: string;

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService, private menuService: MenuService, private promptService: PromptService) {
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
    menuGroup.createMenuRow('Align Boxes Left', () => { EditBoxComponent.currentEditBox.row.alignBoxesLeft(); EditBoxComponent.change.next() });
    menuGroup.createMenuRow('Align Boxes Center', () => { EditBoxComponent.currentEditBox.row.alignBoxesCenter(); EditBoxComponent.change.next() });
    menuGroup.createMenuRow('Align Boxes Right', () => { EditBoxComponent.currentEditBox.row.alignBoxesRight(); EditBoxComponent.change.next() });

    // Delete, copy, cut, paste
    menuGroup = this.menuService.menu.createMenuGroup();
    menuGroup.createMenuRow('Delete', () => { this.delete() });
    menuGroup.createMenuRow('Copy', () => { this.copy() });
    menuGroup.createMenuRow('Cut', () => { this.cut() });
    menuGroup.createMenuRow('Paste', () => { this.paste() }, () => { return !this.copied.boxType });
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
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected && !EditBoxComponent.currentEditBox.inEditMode) {
      this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete this "' + EditBoxComponent.currentEditBox.type.toLowerCase() + '"?', [
        {
          text: 'Yes',
          callback: () => {
            this.deleteBox();
          }
        },
        {
          text: 'No',
          callback: () => { }
        }
      ]);
    }
  }

  copy() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected && !EditBoxComponent.currentEditBox.inEditMode) {
      this.copied = this.copyBox(EditBoxComponent.currentEditBox);
      this.copied.isSelected = true;
    }
  }

  deleteBox() {
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

  cut() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected && !EditBoxComponent.currentEditBox.inEditMode) {
      this.promptService.prompt('Confirm Cut', 'Are you sure you want to cut this "' + EditBoxComponent.currentEditBox.type.toLowerCase() + '"?', [
        {
          text: 'Yes',
          callback: () => {
            this.copy();
            this.deleteBox();
          }
        },
        {
          text: 'No',
          callback: () => { }
        }
      ]);
    }
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
      copied.boxes = box.boxContainer.boxes.length > 0 ? this.copyBoxes(box.boxContainer.boxes) : null;
      copied.rows = box.boxContainer.rows.length > 0 ? this.copyRows(box.boxContainer.rows) : null;
    }

    copied.rowIndex = box.container.getRowIndex(box.row);
    copied.backgroundColor = box.backgroundColor;
    copied.content = box.content ? box.content.innerHTML : null;
    if (preservePosition) {
      copied.rect = new Rect(box.rect.x, box.rect.y, box.rect.width, box.rect.height);
    } else {
      copied.rect = new Rect(null, null, box.rect.width, box.rect.height);
    }

    return copied;
  }

  copyRows(rows: Array<Row>) {
    let copiedRows = [];

    rows.forEach((row: Row) => {
      copiedRows.push({
        alignment: row.alignment,
        y: row.y
      });
    });

    return copiedRows;
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
      if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.inEditMode) return;


      let box = this.createBox(this.copied.boxType, Container.currentContainer, this.copied.contentContainerType);
      let newBoxes: Array<EditBoxComponent> = [];

      newBoxes.push(box.instance);

      // Image
      if (this.copied.boxType === ImageBoxComponent) {
        this.setImageBox(box, this.copied);
        // Container
      } else if (this.copied.boxType === ContainerBoxComponent) {
        box.instance.initialize(this.copied);

        let container: ContainerBoxComponent = box.instance as ContainerBoxComponent;
        this.createRowsInContainer(container.boxContainer, this.copied.rows);

        // Create the boxes in the container
        this.createBoxesInContainer(container.boxContainer, this.copied.boxes, newBoxes);
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

  createRowsInContainer(container: Container, copiedRows) {
    if (copiedRows) {
      copiedRows.forEach(copiedRow => {
        container.addRow(copiedRow.alignment, copiedRow.y);
      });
    }
  }

  createBoxesInContainer(container: Container, copiedBoxes, newBoxes: Array<EditBoxComponent>) {
    if (copiedBoxes) {
      copiedBoxes.forEach(copiedBox => {
        // create a new box
        let newBox = this.createBox(copiedBox.boxType, container, copiedBox.contentContainerType);
        newBoxes.push(newBox.instance);

        // Image
        if (copiedBox.boxType === ImageBoxComponent) {
          this.setImageBox(newBox, copiedBox);

          // Container
        } else if (copiedBox.boxType === ContainerBoxComponent) {
          newBox.instance.initialize(copiedBox);

          let containerBox: ContainerBoxComponent = newBox.instance as ContainerBoxComponent;

          this.createRowsInContainer(containerBox.boxContainer, copiedBox.rows);
          this.createBoxesInContainer(containerBox.boxContainer, copiedBox.boxes, newBoxes);
          // Other
        } else {
          newBox.instance.initialize(copiedBox);
        }
      });
    }
  }
}
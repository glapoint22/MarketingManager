import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ButtonBoxComponent } from './button-box/button-box.component';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { DataService } from './data.service';
import { ImageBoxComponent } from './image-box/image-box.component';
import { Rect } from './rect';

@Injectable({
  providedIn: 'root'
})
export class EditBoxService {
  public copied: any = {};
  private fileInput = document.createElement('input');

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) {
    this.fileInput.type = 'file';
    this.fileInput.onchange = (event: any) => {
      if (event.target.files.length > 0) {
        let file: File = event.target.files[0];
        let formData: FormData = new FormData();
        formData.append('image', file, file.name);

        this.dataService.post('/api/Image', formData)
          .subscribe((imageName: any) => {
            let box = this.createBox(ImageBoxComponent, EditBoxComponent.currentContainer, 'img');
            this.setChange([box.instance]);
            box.instance.contentContainer.src = 'Images/' + imageName;
            box.instance.contentContainer.onload = () => {
              box.instance.initialize();
            }
          });
      }
    }
  }

  createTextBox(boxData?) {
    let box = this.createBox(TextBoxComponent, EditBoxComponent.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if(!boxData)this.setChange([box.instance]);
  }

  createButtonBox(boxData?) {
    let box = this.createBox(ButtonBoxComponent, EditBoxComponent.currentContainer, 'iframe');
    box.instance.initialize(boxData);
    if(!boxData)this.setChange([box.instance]);
  }

  createContainerBox(boxData?) {
    let box = this.createBox(ContainerBoxComponent, EditBoxComponent.currentContainer);
    box.instance.initialize(boxData)
    if(!boxData)this.setChange([box.instance]);
  }

  createImageBox(boxData?) {
    if (boxData) {
      let imageBox = this.createBox(ImageBoxComponent, EditBoxComponent.currentContainer, 'img');
      this.setImageBox(imageBox, boxData);
    } else {
      this.fileInput.click();
    }
  }

  createBox(boxType: Type<EditBoxComponent>, container, contentContainerType?: string) {
    let componentFactory = this.resolver.resolveComponentFactory(boxType),
      contentContainer = document.createElement(contentContainerType),
      newBox = container.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    // Set the editbox properties
    newBox.instance.contentContainer = contentContainer;
    newBox.instance.parentContainer = container;

    // Add this new box to the container
    if (!container.boxes) container.boxes = [];
    container.boxes.push(newBox.instance);

    newBox.instance.setCurrentContainer();

    return newBox;
  }

  delete() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
        EditBoxComponent.currentContainer = EditBoxComponent.currentEditBox.parentContainer;
      }

      let index = EditBoxComponent.currentContainer.boxes.findIndex(x => x === EditBoxComponent.currentEditBox);
      EditBoxComponent.currentEditBox = null;
      EditBoxComponent.currentContainer.remove(index);
      EditBoxComponent.currentContainer.boxes.splice(index, 1);

      EditBoxComponent.change.next();
      EditBoxComponent.setContainerHeight(EditBoxComponent.currentContainer);
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
      copied.boxes = box.container.boxes ? this.copyBoxes(box.container.boxes) : null;
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
      let box = this.createBox(this.copied.boxType, EditBoxComponent.currentContainer, this.copied.contentContainerType);
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

  setChange(changedBoxes: Array<EditBoxComponent>){
     // Mark a change has happened when all boxes have loaded
     let interval = window.setInterval(() => {
      if (changedBoxes.every(x => x.isLoaded)) {
        EditBoxComponent.change.next();
        EditBoxComponent.setContainerHeight(EditBoxComponent.currentContainer);
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
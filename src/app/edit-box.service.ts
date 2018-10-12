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
            let imageBox = this.createBox(ImageBoxComponent, EditBoxComponent.currentContainer, 'img');

            imageBox.instance.contentContainer.src = 'Images/' + imageName;
            imageBox.instance.contentContainer.onload = () => {
              imageBox.instance.initialize();
            }
          });
      }
    }
  }

  createTextBox() {
    this.createBox(TextBoxComponent, EditBoxComponent.currentContainer, 'iframe').instance.initialize();
  }

  createButtonBox() {
    this.createBox(ButtonBoxComponent, EditBoxComponent.currentContainer, 'iframe').instance.initialize();
  }

  createContainerBox() {
    this.createBox(ContainerBoxComponent, EditBoxComponent.currentContainer).instance.initialize();
  }

  createImageBox() {
    this.fileInput.click();
  }

  createBox(box: Type<EditBoxComponent>, container, contentContainerType?: string) {
    let componentFactory = this.resolver.resolveComponentFactory(box),
      contentContainer = document.createElement(contentContainerType),
      newBox = container.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    // Set the editbox properties
    newBox.instance.contentContainer = contentContainer;
    newBox.instance.parentContainer = container;
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
    }
  }

  copy() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      this.copied = this.copyBox(EditBoxComponent.currentEditBox);
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
      copied.box = TextBoxComponent;
      copied.contentContainerType = 'iframe';

      // Image
    } else if (box instanceof ImageBoxComponent) {
      copied.box = ImageBoxComponent;
      copied.contentContainerType = 'img';
      copied.src = box.contentContainer.src;
      copied.link = box.link;

      // Button
    } else if (box instanceof ButtonBoxComponent) {
      copied.box = ButtonBoxComponent;
      copied.contentContainerType = 'iframe';
      copied.link = box.link;

      // Container
    } else if (box instanceof ContainerBoxComponent) {
      copied.box = ContainerBoxComponent;
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

  paste() {
    if (this.copied.box) {
      let box = this.createBox(this.copied.box, EditBoxComponent.currentContainer, this.copied.contentContainerType);

      // Image
      if (this.copied.box === ImageBoxComponent) {
        box.instance.contentContainer.src = this.copied.src;
        box.instance.contentContainer.onload = () => {
          box.instance.initialize(this.copied);
        }
        // Container
      } else if (this.copied.box === ContainerBoxComponent) {
        box.instance.initialize(this.copied);

        // Create the boxes in the container
        this.createBoxesInContainer(box.instance.container, this.copied.boxes);
      } else {
        box.instance.initialize(this.copied);
      }
    }
  }

  createBoxesInContainer(container, boxes) {
    if (boxes) {
      boxes.forEach(copy => {
        // create a new box
        let newBox = this.createBox(copy.box, container, copy.contentContainerType);

        // Image
        if (copy.box === ImageBoxComponent) {
          newBox.instance.contentContainer.src = copy.src;
          newBox.instance.contentContainer.onload = () => {
            newBox.instance.initialize(copy);
          }
          // Container
        } else if (copy.box === ContainerBoxComponent) {
          newBox.instance.initialize(copy);
          this.createBoxesInContainer(newBox.instance.container, copy.boxes);
          // Other
        } else {
          newBox.instance.initialize(copy);
        }
      });
    }
  }
}
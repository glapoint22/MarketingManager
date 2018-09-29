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

  createBox(component: Type<any>, currentContainer, contentContainerType?: string) {
    let componentFactory = this.resolver.resolveComponentFactory(component),
      contentContainer = document.createElement(contentContainerType),
      box = currentContainer.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    // Add this editbox to the container
    if (!currentContainer.components) currentContainer.components = [];
    currentContainer.components.push(box.instance);

    // Set the editbox properties
    box.instance.contentContainer = contentContainer;
    box.instance.parentContainer = currentContainer;
    return box;
  }

  delete() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
        EditBoxComponent.currentContainer = EditBoxComponent.currentEditBox.parentContainer;
      }

      let index = EditBoxComponent.currentContainer.components.findIndex(x => x === EditBoxComponent.currentEditBox);
      EditBoxComponent.currentEditBox = null;
      EditBoxComponent.currentContainer.remove(index);
      EditBoxComponent.currentContainer.components.splice(index, 1);
    }
  }

  copy() {
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected) {
      this.copied = this.copyBox(EditBoxComponent.currentEditBox);
    }
  }

  copyBox(box: EditBoxComponent, preservePosition?: boolean) {
    let copied: any = {}

    // Text
    if (box instanceof TextBoxComponent) {
      copied.component = TextBoxComponent;
      copied.contentContainerType = 'iframe';

      // Image
    } else if (box instanceof ImageBoxComponent) {
      copied.component = ImageBoxComponent;
      copied.contentContainerType = 'img';
      copied.src = box.contentContainer.src;
      copied.link = box.link;

      // Button
    } else if (box instanceof ButtonBoxComponent) {
      copied.component = ButtonBoxComponent;
      copied.contentContainerType = 'iframe';
      copied.link = box.link;

      // Container
    } else if (box instanceof ContainerBoxComponent) {
      copied.component = ContainerBoxComponent;
      copied.contentContainerType = null;
      copied.components = box.container.components ? this.copyComponents(box.container.components): null;
    }

    copied.backgroundColor = box.editBox.nativeElement.style.backgroundColor;
    copied.content = box.content ? box.content.innerHTML : null;
    if (preservePosition) {
      copied.rect = new Rect(box.rect.x, box.rect.y, box.rect.width, box.rect.height);
    } else {
      copied.rect = new Rect(null, null, box.rect.width, box.rect.height);
    }


    return copied;
  }

  copyComponents(components) {
    let copies = [];
    components.forEach(x => copies.push(this.copyBox(x, true)));
    return copies;
  }

  paste() {
    if (this.copied.component) {
      let box = this.createBox(this.copied.component, EditBoxComponent.currentContainer, this.copied.contentContainerType);

      // Image
      if (this.copied.component === ImageBoxComponent) {
        box.instance.contentContainer.src = this.copied.src;
        box.instance.contentContainer.onload = () => {
          box.instance.initialize(this.copied);
        }
        // Container
      } else if (this.copied.component === ContainerBoxComponent) {
        box.instance.initialize(this.copied);

        // Create the components in the container
        this.createContainerComponents(box.instance.container, this.copied.components);
        box.instance.setSelection();

      } else {
        box.instance.initialize(this.copied);
      }
    }
  }

  createContainerComponents(container, components) {
    if (components) {
      components.forEach(copy => {
        // Copy the current component and create a new one
        let newBox = this.createBox(copy.component, container, copy.contentContainerType);

        // Image
        if (copy.component === ImageBoxComponent) {
          newBox.instance.contentContainer.src = copy.src;
          newBox.instance.contentContainer.onload = () => {
            newBox.instance.initialize(copy);
          }
          // Container
        } else if (copy.component === ContainerBoxComponent) {
          newBox.instance.initialize(copy);
          this.createContainerComponents(newBox.instance.container, copy.components);
        } else {
          newBox.instance.initialize(copy);
        }
      });
    }
  }
}
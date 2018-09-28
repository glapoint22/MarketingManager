import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ButtonBoxComponent } from './button-box/button-box.component';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { DataService } from './data.service';
import { ImageBoxComponent } from './image-box/image-box.component';
import { Vector2 } from './vector2';

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
            let imageBox = this.createBox(ImageBoxComponent, 'img');

            imageBox.instance.contentContainer.src = 'Images/' + imageName;
            imageBox.instance.contentContainer.onload = () => {
              imageBox.instance.initialize();
            }
          });
      }
    }
  }

  createTextBox() {
    this.createBox(TextBoxComponent, 'iframe').instance.initialize();
  }

  createButtonBox() {
    this.createBox(ButtonBoxComponent, 'iframe').instance.initialize();
  }

  createContainerBox() {
    this.createBox(ContainerBoxComponent).instance.initialize();
  }

  createImageBox() {
    this.fileInput.click();
  }

  createBox(component: Type<any>, contentContainerType?: string) {
    let componentFactory = this.resolver.resolveComponentFactory(component),
      contentContainer = document.createElement(contentContainerType),
      box = EditBoxComponent.currentContainer.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    // Add this editbox to the container
    if (!EditBoxComponent.currentContainer.components) EditBoxComponent.currentContainer.components = [];
    EditBoxComponent.currentContainer.components.push(box.instance);

    // Set the editbox properties
    box.instance.contentContainer = contentContainer;
    box.instance.parentContainer = EditBoxComponent.currentContainer;
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
      // Text
      if (EditBoxComponent.currentEditBox instanceof TextBoxComponent) {
        this.copied.component = TextBoxComponent;
        this.copied.contentContainerType = 'iframe';

        // Image
      } else if (EditBoxComponent.currentEditBox instanceof ImageBoxComponent) {
        this.copied.component = ImageBoxComponent;
        this.copied.contentContainerType = 'img';
        this.copied.src = EditBoxComponent.currentEditBox.contentContainer.src;
        this.copied.link = EditBoxComponent.currentEditBox.link;

        // Button
      } else if (EditBoxComponent.currentEditBox instanceof ButtonBoxComponent) {
        this.copied.component = ButtonBoxComponent;
        this.copied.contentContainerType = 'iframe';
        this.copied.link = EditBoxComponent.currentEditBox.link;

        // Container
      } else if (EditBoxComponent.currentEditBox instanceof ContainerBoxComponent) {
        this.copied.component = ContainerBoxComponent;
        this.copied.contentContainerType = null;
        this.copied.components = EditBoxComponent.currentEditBox.container.components;
      }

      this.copied.backgroundColor = EditBoxComponent.currentEditBox.editBox.nativeElement.style.backgroundColor;
      this.copied.content = EditBoxComponent.currentEditBox.content ? EditBoxComponent.currentEditBox.content.innerHTML : null;
      this.copied.size = new Vector2(EditBoxComponent.currentEditBox.rect.width, EditBoxComponent.currentEditBox.rect.height);
    }
  }

  paste() {
    if (this.copied.component) {
      let box = this.createBox(this.copied.component, this.copied.contentContainerType);

      if (this.copied.component === ImageBoxComponent) {
        box.instance.contentContainer.src = this.copied.src;
        box.instance.contentContainer.onload = () => {
          box.instance.initialize(this.copied);
        }
      } else if (this.copied.component === ContainerBoxComponent) {
        box.instance.initialize(this.copied);

        if (this.copied.components) {
          this.copied.components.forEach(component => {
            this.createBox(component, 'iframe').instance.initialize();
          });
        }

      } else {
        box.instance.initialize(this.copied);
      }
    }
  }
}
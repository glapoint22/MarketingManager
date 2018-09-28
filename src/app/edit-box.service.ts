import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { ButtonBoxComponent } from './button-box/button-box.component';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { DataService } from './data.service';
import { ImageBoxComponent } from './image-box/image-box.component';

@Injectable({
  providedIn: 'root'
})
export class EditBoxService {
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
}
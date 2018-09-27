import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, ViewChildren, QueryList, Type } from '@angular/core';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { DataService } from "../data.service";
import { TextBoxComponent } from '../text-box/text-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  public pageWidth: number = 600;
  // private currentEmailIndex: number = -1;
  private emailContentContainerArray: Array<any>;
  public fileInput = document.createElement('input');

  public textBoxComponent = TextBoxComponent;
  public buttonBoxComponent = ButtonBoxComponent;
  public containerBoxComponent = ContainerBoxComponent;
  public currentContainer;

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) { }

  ngOnInit() {
    this.setHeight();

    this.fileInput.type = 'file';
    this.fileInput.onchange = (event) => {
      this.createImageBox(event);
    }
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x: QueryList<ViewContainerRef>) => {
      this.emailContentContainerArray = x.toArray();
    });
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index) {
    if (input.checked) {
      input.checked = false;
      // this.currentEmailIndex = -1;
      this.currentContainer = null;
    } else {
      input.checked = true;
      // this.currentEmailIndex = index;
      this.currentContainer = this.emailContentContainerArray[index]
    }
  }

  onItemClick(item) {
    if (item.tierIndex === 0) {
      this.emails = [];
      return;
    }
    this.emails = item.emails
      .map(x => ({
        id: x.id,
        subject: x.subject,
        body: x.body
      }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

  createImageBox(event) {
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

  createBox(component: Type<any>, contentContainerType) {
    let componentFactory = this.resolver.resolveComponentFactory(component),
      // container = this.currentContainer,
      contentContainer = document.createElement(contentContainerType),
      box = this.currentContainer.createComponent(componentFactory, null, null, contentContainerType ? [[contentContainer]] : null);

    
    if (!this.currentContainer.components) this.currentContainer.components = [];
    this.currentContainer.components.push(box.instance);


    box.instance.contentContainer = contentContainer;
    box.instance.parentContainer = this.currentContainer;
    return box;
  }

  getBox(component: Type<any>, contentContainerType) {
    this.createBox(component, contentContainerType).instance.initialize();
  }
}
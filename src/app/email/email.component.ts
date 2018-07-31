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
  private currentEmailIndex: number = -1;
  private emailContentContainerArray: Array<any>;

  public textBoxComponent = TextBoxComponent;
  public buttonBoxComponent = ButtonBoxComponent;
  public containerBoxComponent = ContainerBoxComponent;

  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) { }

  ngOnInit() {
    this.setHeight();
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
      this.currentEmailIndex = -1;
    } else {
      input.checked = true;
      this.currentEmailIndex = index;
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
          let content: any = this.createBox(ImageBoxComponent, 'img');

          // Assign the image name
          content.src = 'Images/' + imageName;
        });
    }
  }

  createBox(component: Type<any>, contentType: string = 'div') {
    let componentFactory = this.resolver.resolveComponentFactory(component),
      container = this.emailContentContainerArray[this.currentEmailIndex],
      content = document.createElement(contentType),
      box = container.createComponent(componentFactory, null, null, [[content]]);

    box.instance.initialize(container, content);
    return content;
  }
}
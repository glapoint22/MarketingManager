import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, ViewChildren, QueryList, ComponentFactory } from '@angular/core';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { Rect } from '../rect';
import { DataService } from "../data.service";
import { TextBoxComponent } from '../text-box/text-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  private currentEmailIndex: number = -1;
  private emailContentContainerArray: Array<any>;

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

  setImageBox(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let formData: FormData = new FormData();
      formData.append('image', file, file.name);

      this.dataService.post('/api/Image', formData)
        .subscribe((imageName: any) => {
          let componentFactory: ComponentFactory<ImageBoxComponent> = this.resolver.resolveComponentFactory(ImageBoxComponent);
          let container = this.emailContentContainerArray[this.currentEmailIndex];
          let image = document.createElement('img');
          image.src = 'Images/' + imageName;
          image.setAttribute('style', 'width: 100%; height: 100%; display: block; max-width: 600px;');
          let imageBox = container.createComponent(componentFactory, null, null, [[image]]);
          imageBox.instance.parentContainer = container;

          // Set the position when we know the dimensions of the image
          let interval = window.setInterval(() => {
            if (image.clientWidth > 0) {
              clearInterval(interval);
              this.initEditBox(imageBox, new Rect(300 - (image.clientWidth * 0.5), 0, image.clientWidth, image.clientHeight));
            }
          }, 1);
        });
    }
  }

  setTextBox() {
    let componentFactory: ComponentFactory<TextBoxComponent> = this.resolver.resolveComponentFactory(TextBoxComponent);
    let container = this.emailContentContainerArray[this.currentEmailIndex];
    let div: HTMLDivElement = document.createElement('div');

    let textBox = container.createComponent(componentFactory, null, null, [[div]]);
    textBox.instance.parentContainer = container;
    textBox.instance.content = div;
    this.initEditBox(textBox, new Rect(300 - (180 * 0.5), 0, 180, 44));
  }

  initEditBox(editBox, rect: Rect) {
    // Assign the rect
    editBox.instance.rect = rect;

    // Get an array of all rects from the container
    let rects: Array<Rect> = this.emailContentContainerArray[this.currentEmailIndex]._embeddedViews.map(x => x.nodes[1].instance.rect);

    // Order the rects so we can set the y position
    if (rects.length > 1) {
      editBox.instance.rect.y = -Infinity;
      rects = rects.sort((a: Rect, b: Rect) => {
        if (a.yMax > b.yMax) return 1;
        return -1;
      });
      editBox.instance.rect.y = rects[rects.length - 1].yMax;
    }

    editBox.instance.setElement();
  }

}

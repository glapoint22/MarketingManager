import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, ViewChildren, QueryList } from '@angular/core';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { Rect } from '../rect';
import { DataService } from "../data.service";

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  public currentEmailIndex: number = -1;

  private emailContentContainerArray: Array<any>;


  constructor(private resolver: ComponentFactoryResolver, private dataService: DataService) { }

  ngOnInit() {
    this.setHeight();
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x) => {
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

  setImage(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let formData: FormData = new FormData();
      formData.append('image', file, file.name);

      this.dataService.post('/api/Image', formData)
        .subscribe((imageName: any) => {
          let componentFactory = this.resolver.resolveComponentFactory(ImageBoxComponent);
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
              this.setEditBoxPosition(imageBox, image, container);
            }
          }, 1);
        });
    }
  }

  setEditBoxPosition(editBox, content, container) {
    // Assign the rect
    editBox.instance.rect = new Rect(0, 0, content.clientWidth, content.clientHeight);

    // Get an array of all rects in the container
    let rects: Array<Rect> = container._embeddedViews.map(x => x.nodes[1].instance.rect);

    // Order the rects
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

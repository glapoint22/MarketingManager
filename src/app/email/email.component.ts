import { Component, OnInit, HostListener, ViewContainerRef, ComponentFactoryResolver, ViewChildren, QueryList } from '@angular/core';
import { ImageBoxComponent } from '../image-box/image-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContent', { read: ViewContainerRef }) emailContent: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  public currentEmailIndex: number = -1;


  


  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.setHeight();
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index){
    if(input.checked){
      input.checked = false;
      this.currentEmailIndex = -1;
    }else{
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

  foo(){
    let componentFactory = this.resolver.resolveComponentFactory(ImageBoxComponent);
    let image = document.createElement('img');
    image.src = 'Images/ubt_ebook.png';
    image.setAttribute('style', 'width: 100%; height: 100%; display: block;');
    this.emailContent.toArray()[this.currentEmailIndex].createComponent(componentFactory, null, null, [[image]]);
  }

}

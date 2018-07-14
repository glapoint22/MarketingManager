import { Component, OnInit, HostListener, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ImageBoxComponent } from '../image-box/image-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  public height: number;
  public emails: Array<SafeHtml> = [];
  public currentItem: any;


  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer: ViewContainerRef;


  constructor(private sanitizer: DomSanitizer, private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.setHeight();
    
    
    let componentFactory = this.resolver.resolveComponentFactory(ImageBoxComponent);
    let image = document.createElement('img');
    image.src = 'Images/ubt_ebook.png';
    image.setAttribute('style', 'width: 100%; height: 100%; display: block;');
    this.contentContainer.createComponent(componentFactory, null, null, [[image]]);
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onItemClick(item) {
    this.currentItem = item;

    if (item.tierIndex === 0) {
      this.emails = [];
      return;
    }
    this.emails = item.emails
      .map(x => ({
        id: x.id,
        subject: x.subject,
        body: this.sanitizer.bypassSecurityTrustHtml(x.body),
      }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

}

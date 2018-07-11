import { Component, OnInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  public height: number;
  public emails: Array<SafeHtml> = [];
  public currentItem: any;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.setHeight();
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

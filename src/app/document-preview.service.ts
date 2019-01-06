import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DocumentPreviewService {
  public content: SafeHtml;
  public show: boolean;

  constructor(private sanitizer: DomSanitizer) { }

  open(body: string, emailID: string) {
    let content = body.replace(/\{0\}/g, 'Gabe').replace(/\{1\}/g, emailID).replace(/\{2\}/g, '51C5A0BE6C').replace(/\{3\}/g, 'http://www.nicheShack.com');

    this.content = this.sanitizer.bypassSecurityTrustHtml(content);
    this.show = true;
  }
}
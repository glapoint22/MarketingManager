import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class EmailPreviewService {
  public content: SafeHtml;
  public show: boolean;
  
  constructor(private sanitizer: DomSanitizer) { }

  open(body){
    this.content = this.sanitizer.bypassSecurityTrustHtml(body);
    this.show = true;
  }
}

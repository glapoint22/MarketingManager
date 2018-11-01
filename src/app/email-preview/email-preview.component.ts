import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { EmailPreviewService } from '../email-preview.service';

@Component({
  selector: 'email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  @ViewChild('content') content: ElementRef;

  constructor(public emailPreviewService: EmailPreviewService) { }
}

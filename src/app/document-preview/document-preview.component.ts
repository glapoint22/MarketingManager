import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentPreviewService } from '../document-preview.service';

@Component({
  selector: 'document-preview',
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent {
  @ViewChild('content') content: ElementRef;

  constructor(public documentPreviewService: DocumentPreviewService) { }
}

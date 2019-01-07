import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';
import { Container } from '../container';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';

@Component({
  selector: 'lead-page',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class LeadPageComponent extends DocumentComponent implements OnInit {

  ngOnInit() {
    this.documentType = 'lead page';
    this.pageWidth = 900;
    super.ngOnInit();
  }

  getNewDocument(data, id){
    this.currentItem.documents.push({
      id: id,
      title: data ? data.title : 'title',
      body: data ? data.body : this.createDocumentBody(this.defaultDocumnetColor, this.defaultDocumnetColor),
      backgroundColor: data ? data.backgroundColor : this.defaultDocumnetColor,
      pageColor: data ? data.pageColor : this.defaultDocumnetColor,
      pageTitle: 'Page Title'
    });
    let newDocument = this.currentItem.documents[this.currentItem.documents.length - 1];

    return newDocument;
  }

  createDocumentBody(backgroundColor: string, pageColor: string) {
    let main = document.createElement('DIV');

    return '';
  }

}

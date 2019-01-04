import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';

@Component({
  selector: 'email',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class EmailComponent extends DocumentComponent implements OnInit {
  ngOnInit(){
    this.documentType = 'email';
    super.ngOnInit();
  }

  deleteDocument() {
    super.deleteDocument();

    if (this.currentItem.tierIndex === 2) {
      // Reorder the days of this item's emails
      this.currentItem.documents.forEach((email, i) => {
        email.day = i + 1;
      });
    }
  }

  getNewDocument(data, id){
    this.currentItem.documents.push({
      id: id,
      subject: data ? data.subject : 'subject',
      body: data ? data.body : '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td width="100%" ' +
        'align="center"><!--[if (gte mso 9)|(IE)]><table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td>' +
        '<![endif]--><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px;"><tr><td height="' +
        '40"></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></table>',
      backgroundColor: data ? data.backgroundColor : '#ffffff',
      pageColor: data ? data.pageColor : '#ffffff'
    });
    let newDocument = this.currentItem.documents[this.currentItem.documents.length - 1];

    if (this.currentItem.tierIndex === 2) {
      newDocument.day = this.currentItem.documents.length;
    }

    return newDocument;
  }
}
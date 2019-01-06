import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';

@Component({
  selector: 'leads',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class LeadsComponent extends DocumentComponent implements OnInit {

  

  ngOnInit() {
    this.documentType = 'lead page';
    this.pageWidth = 900;
    super.ngOnInit();
  }

  getNewDocument(data, id){
    this.currentItem.documents.push({
      id: id,
      title: data ? data.title : 'title',
      body: data ? data.body : '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td width="100%" ' +
        'align="center"><!--[if (gte mso 9)|(IE)]><table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff"><tr><td>' +
        '<![endif]--><table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width: 600px;"><tr><td height="' +
        '40"></td></tr></table><!--[if (gte mso 9)|(IE)]></td></tr></table><![endif]--></td></tr></table>',
      backgroundColor: data ? data.backgroundColor : '#ffffff',
      pageColor: data ? data.pageColor : '#ffffff',
      pageTitle: 'Page Title'
    });
    let newDocument = this.currentItem.documents[this.currentItem.documents.length - 1];

    
    return newDocument;
  }

}

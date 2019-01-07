import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';
import { Container } from '../container';
import { EditBoxService } from '../edit-box.service';
import { DocumentPreviewService } from '../document-preview.service';
import { MenuService } from '../menu.service';
import { ColorService } from '../color.service';
import { PromptService } from '../prompt.service';
import { LinkService } from '../link.service';
import { SaveService } from '../save.service';
import { TableService } from '../table.service';

@Component({
  selector: 'email',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class EmailComponent extends DocumentComponent implements OnInit {
  constructor(editBoxService: EditBoxService, documentPreviewService: DocumentPreviewService, menuService: MenuService,
    colorService: ColorService, promptService: PromptService, linkService: LinkService, saveService: SaveService,
    private tableService: TableService) {
    super(editBoxService, documentPreviewService, menuService, colorService, promptService, linkService, saveService)
  }

  ngOnInit() {
    this.documentType = 'email';
    this.pageWidth = 600;
    super.ngOnInit();
  }

  loadDocument(input) {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentDocument.body, "text/html"),
      mainTable: HTMLTableElement = doc.body.firstElementChild as HTMLTableElement,
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement;

    // Set the colors
    this.currentDocument.backgroundColor = mainTable.bgColor;
    this.currentDocument.pageColor = pageTable.bgColor;

    // Create the boxes
    this.tableService.tableToBox(pageTable, Container.currentContainer);

    super.loadDocument(input);
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

  getNewDocument(data, id) {
    this.currentItem.documents.push({
      id: id,
      title: data ? data.title : 'subject',
      body: data ? data.body : this.createDocumentBody(this.defaultDocumnetColor, this.defaultDocumnetColor),
      backgroundColor: data ? data.backgroundColor : this.defaultDocumnetColor,
      pageColor: data ? data.pageColor : this.defaultDocumnetColor
    });
    let newDocument = this.currentItem.documents[this.currentItem.documents.length - 1];

    if (this.currentItem.tierIndex === 2) {
      newDocument.day = this.currentItem.documents.length;
    }

    return newDocument;
  }

  createDocumentBody(backgroundColor: string, pageColor: string) {
    // Create the main table
    let mainTable = this.tableService.createTable(document.createElement('div'), null, null, backgroundColor),
      tr = mainTable.appendChild(document.createElement('tr')),
      td = tr.appendChild(document.createElement('td'));

    td.width = '100%';
    td.align = 'center';

    // Create all child tables
    let pageTable = this.tableService.createTable(td, this.container, this.pageWidth, pageColor);

    // If we have no boxes
    if (!this.container || this.container.boxes.length === 0) {
      tr = pageTable.appendChild(document.createElement('tr')),
        td = tr.appendChild(document.createElement('td'));
      td.height = this.minContainerHeight.toString();
    }

    return mainTable.outerHTML;
  }
}
import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';
import { Container } from '../container';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Rect } from '../rect';
import { Row } from '../row';

@Component({
  selector: 'email',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class EmailComponent extends DocumentComponent implements OnInit {
  ngOnInit() {
    this.documentType = 'email';
    this.pageWidth = 600;
    this.newDocumentIcon = 'fa-envelope';
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
    this.tableToBox(pageTable, Container.currentContainer);

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

  copyDocument() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      let regex = RegExp(/bgcolor="(#[a-z0-9]+)"/, 'g');

      this.copy = {
        body: this.currentDocument.body,
        title: this.currentDocument.title,
        backgroundColor: regex.exec(this.currentDocument.body)[1],
        pageColor: regex.exec(this.currentDocument.body)[1]
      }
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
    let mainTable = this.createTable(document.createElement('div'), null, null, backgroundColor),
      tr = mainTable.appendChild(document.createElement('tr')),
      td = tr.appendChild(document.createElement('td'));

    td.width = '100%';
    td.align = 'center';

    // Create all child tables
    let pageTable = this.createTable(td, this.container, this.pageWidth, pageColor);

    // If we have no boxes
    if (!this.container || this.container.boxes.length === 0) {
      tr = pageTable.appendChild(document.createElement('tr')),
        td = tr.appendChild(document.createElement('td'));
      td.height = this.minContainerHeight.toString();
    }

    return mainTable.outerHTML;
  }

  createTable(parent: HTMLElement, container?: Container, maxWidth?: number, bgColor?: string, height?: number) {
    let table: HTMLTableElement = parent.appendChild(document.createElement('table'));
    let tableAttributes: string;

    // Set the table properties
    table.width = '100%';
    table.cellPadding = '0';
    table.cellSpacing = '0';
    table.border = '0';

    // Set the optional properties
    if (maxWidth) {
      table.style.maxWidth = maxWidth + 'px';
      tableAttributes = 'width="' + maxWidth + '" cellpadding="0" cellspacing="0" border="0"';
    }
    if (bgColor) {
      table.bgColor = bgColor;
      if (maxWidth) tableAttributes += ' bgcolor="' + bgColor + '"';
    }

    // For Outlook
    if (maxWidth) {
      parent.insertBefore(document.createComment('[if (gte mso 9)|(IE)]><table ' + tableAttributes + '><tr><td><![endif]'), table);
      parent.appendChild(document.createComment('[if (gte mso 9)|(IE)]></td></tr></table><![endif]'));
    }


    // If this container has boxes
    if (container && container.boxes.length > 0) {
      // Loop through each row
      container.rows.forEach((row, i, rows) => {
        let tableRow: HTMLTableRowElement = table.appendChild(document.createElement('tr')),
          column: HTMLTableDataCellElement = tableRow.appendChild(document.createElement('td')),
          paddingTop: number = i === 0 ? row.y : row.y - rows[i - 1].yMax;

        // Set the column properties
        column.style.paddingLeft = '0';
        column.style.paddingRight = '0';
        column.style.paddingBottom = '0';
        column.align = row.alignment;
        column.style.fontSize = '0';
        column.vAlign = 'top';

        // Create an empty row if there is space between the top of this row and the previous row
        if (paddingTop > 0) {
          let paddingRow = table.insertBefore(document.createElement('tr'), tableRow);
          let paddingColumn = paddingRow.insertCell();
          paddingColumn.height = paddingTop.toString();
        }

        // Create an empty row if there is space between the bottom of the container and the last row
        if (i === rows.length - 1 && height) {
          let paddingBottom = height - row.yMax;
          if (paddingBottom > 0) {
            let paddingBottomRow = table.appendChild(document.createElement('tr'));
            let paddingBottomColumn = paddingBottomRow.appendChild(document.createElement('td'));
            paddingBottomColumn.height = paddingBottom.toString();
          }
        }

        // Row has one box
        if (row.boxes.length === 1) {
          let box = row.boxes[0];

          // Box is container
          if (box instanceof ContainerBoxComponent) {
            let containerBox = box as ContainerBoxComponent;

            containerBox.boxToTable(this.createTable(column, containerBox.boxContainer, containerBox.rect.width, containerBox.backgroundColor, containerBox.rect.height));

            // Box is text, button, or image
          } else {
            box.boxToTable(this.createTable(column, null, box instanceof ButtonBoxComponent ? null : box.rect.width));
          }

          // Row has multiple boxes
        } else {
          // Sort the boxes horizontally
          let sortedBoxes = row.sortBoxes();

          // Loop through each box
          sortedBoxes.forEach((currentBox, i) => {
            let box = row.getBox(currentBox),
              div: HTMLElement,
              comment;

            // Don't add width if this is a button
            let width = box instanceof ButtonBoxComponent ? '' : 'width="' + box.rect.width + '"';

            // For Outlook
            if (i === 0) {
              comment = document.createComment('[if (gte mso 9)|(IE)]><table cellpadding="0" cellspacing="0" border="0"><tr><td valign="top" ' + width + 'style="text-align:center"><![endif]');
            } else {
              comment = document.createComment('[if (gte mso 9)|(IE)]></td><td valign="top" ' + width + 'style="text-align:center"><![endif]');
            }

            column.appendChild(comment);

            // Set the div
            div = document.createElement('DIV');
            div.style.width = '100%';
            div.style.maxWidth = box.rect.width + 'px';
            div.style.display = 'inline-block';
            div.style.verticalAlign = 'top';
            column.appendChild(div);

            // Box is container
            if (box instanceof ContainerBoxComponent) {
              let containerBox = box as ContainerBoxComponent;

              containerBox.boxToTable(this.createTable(div, containerBox.boxContainer, null, containerBox.backgroundColor, containerBox.rect.height));

              // Box is text, button, or image
            } else {
              box.boxToTable(this.createTable(div));
            }

            // Last box in the row
            if (i === sortedBoxes.length - 1) {
              comment = document.createComment('[if (gte mso 9)|(IE)]></td></tr></table><![endif]');
              column.appendChild(comment);
            }
          });
        }
      });
    }
    return table;
  }

  tableToBox(table: HTMLTableElement, container: Container) {
    if (table.summary !== '') {
      let rect = this.getRect(table.summary, table.summary.indexOf('-') + 1),
        box: EditBoxComponent;

      // Text box
      if (table.summary.substr(0, 7) === 'textBox') {
        let content = document.createElement('div');

        Array.from(table.rows).forEach(row => {
          let rowContent;

          rowContent = document.createElement('div');
          rowContent.setAttribute('style', row.firstElementChild.getAttribute('style'));
          rowContent.innerHTML = row.firstElementChild.innerHTML;
          content.appendChild(rowContent);
        });

        let boxData = {
          content: content.innerHTML,
          backgroundColor: table.bgColor === '' ? null : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }
        Container.currentContainer = container;

        box = this.editBoxService.createTextBox(boxData);
        this.editBoxService.loadedBoxes.push(box);

        // Container box
      } else if (table.summary.substr(0, 12) === 'containerBox') {
        let boxData = {
          backgroundColor: table.bgColor === '' ? null : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }

        Container.currentContainer = container;
        box = this.editBoxService.createContainerBox(boxData);
        this.editBoxService.loadedBoxes.push(box);
        container = Container.currentContainer;

        // Button box
      } else if (table.summary.substr(0, 9) === 'buttonBox') {
        let anchor = table.getElementsByTagName('a')[0];
        
        let boxData = {
          content: anchor.innerHTML,
          backgroundColor: anchor.style.backgroundColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          link: anchor.getAttribute('href')
        }
        Container.currentContainer = container;
        box = this.editBoxService.createButtonBox(boxData);
        this.editBoxService.loadedBoxes.push(box);

        // Image box
      } else if (table.summary.substr(0, 8) === 'imageBox') {
        let anchor = table.getElementsByTagName('a');

        let boxData = {
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          link: anchor.length > 0 ? anchor[0].getAttribute('href') : null,
          src: table.getElementsByTagName('img')[0].getAttribute('src')
        }
        Container.currentContainer = container;

        box = this.editBoxService.createImageBox(boxData);
        this.editBoxService.loadedBoxes.push(box);
      }

      // Add the box to a row when it has been loaded
      let interval = window.setInterval(() => {
        if (box.isLoaded) {
          let row: Row;

          // Loop through the rows to see if this box belongs to one of them
          // based on the row's and box's Y
          for (let i = 0; i < box.container.rows.length; i++) {
            if (box.container.rows[i].y === rect[1]) {
              row = box.container.rows[i];
              break;
            }
          }

          // Row was not found, so create a new one
          if (!row) {
            let parentElement: HTMLElement = table.parentElement;

            // Find the TD element
            while (parentElement.tagName !== 'TD') {
              parentElement = parentElement.parentElement;
            }

            // Create the row
            row = box.container.addRow(parentElement.getAttribute('align'), box.rect.y);
          }

          // Add the box to the row
          row.addBox(box);
          window.clearInterval(interval);
        }
      }, 1);
    }

    Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
      Array.from(row.children).forEach((td: HTMLTableColElement) => {
        if (td.firstElementChild && (td.firstElementChild.tagName === 'TABLE' || td.firstElementChild.tagName === 'DIV')) {
          Array.from(td.children).forEach((child: any) => {
            let childTable: HTMLTableElement = child.tagName === 'TABLE' ? child : child.firstElementChild as HTMLTableElement;
            this.tableToBox(childTable, container);
          });
        }
      });
    });
  }
}
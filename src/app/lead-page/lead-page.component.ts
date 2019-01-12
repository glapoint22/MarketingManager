import { Component, OnInit } from '@angular/core';
import { DocumentComponent } from '../document/document.component';
import { Container } from '../container';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Rect } from '../rect';
import { Row } from '../row';

@Component({
  selector: 'lead-page',
  templateUrl: '../document/document.component.html',
  styleUrls: ['../document/document.component.scss']
})
export class LeadPageComponent extends DocumentComponent implements OnInit {

  ngOnInit() {
    this.documentType = 'lead page';
    this.pageWidth = 800;
    this.newDocumentIcon = 'fa-magnet';
    super.ngOnInit();
  }

  copyDocument() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      let regex = RegExp(/background-color: rgb\(\d+,\s\d+,\s\d+\)/, 'g');

      this.copy = {
        body: this.currentDocument.body,
        title: this.currentDocument.title,
        backgroundColor: '#' + this.colorService.rgbToHex(this.colorService.rgbStringToRgbObject(regex.exec(this.currentDocument.body)[0])),
        pageColor: '#' + this.colorService.rgbToHex(this.colorService.rgbStringToRgbObject(regex.exec(this.currentDocument.body)[0])),
        pageTitle: this.currentDocument.pageTitle,
        leadMagnet: this.currentDocument.leadMagnet
      }
    }
  }

  getNewDocument(data, id) {
    this.currentItem.documents.push({
      id: id,
      title: data ? data.title : 'title',
      body: data ? data.body : this.createDocumentBody(this.defaultDocumnetColor, this.defaultDocumnetColor),
      backgroundColor: data ? data.backgroundColor : this.defaultDocumnetColor,
      pageColor: data ? data.pageColor : this.defaultDocumnetColor,
      pageTitle: data ? data.pageTitle : '',
      leadMagnet: data ? data.leadMagnet : ''
    });
    let newDocument = this.currentItem.documents[this.currentItem.documents.length - 1];

    return newDocument;
  }

  createDocumentBody(backgroundColor: string, pageColor: string) {
    let documentBody = this.createHtml(document.createElement('div'), null, null, backgroundColor)
    documentBody.style.fontSize = '0';

    let page = this.createHtml(documentBody, this.container, this.pageWidth, pageColor);
    page.style.margin = 'auto';

    // If we have no boxes
    if (!this.container || this.container.boxes.length === 0) {
      let div = page.appendChild(document.createElement('DIV'));

      div.style.height = this.minContainerHeight + 'px';
    }

    return documentBody.outerHTML;
  }

  loadDocument(input) {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentDocument.body, "text/html"),
      main: HTMLElement = doc.body.firstElementChild as HTMLElement,
      page: HTMLElement = doc.body.firstElementChild.firstElementChild as HTMLElement;

    // Set the colors
    this.currentDocument.backgroundColor = main.style.backgroundColor;
    this.currentDocument.pageColor = page.style.backgroundColor;

    // Create the boxes
    this.htmlToBox(page, Container.currentContainer);

    super.loadDocument(input);
  }

  createHtml(parent: HTMLElement, container?: Container, maxWidth?: number, backgroundColor?: string, height?: number) {
    let div: HTMLElement = parent.appendChild(document.createElement('DIV'));

    // Set the div properties
    div.style.width = '100%';

    // Set the optional properties
    if (maxWidth) div.style.maxWidth = maxWidth + 'px';
    if (backgroundColor) div.style.backgroundColor = backgroundColor;

    // If this container has boxes
    if (container && container.boxes.length > 0) {
      // Loop through each row
      container.rows.forEach((row, i, rows) => {
        let divRow: HTMLElement = div.appendChild(document.createElement('DIV')),
          paddingTop: number = i === 0 ? row.y : row.y - rows[i - 1].yMax;

        // Set the alignment
        divRow.style.textAlign = row.alignment;

        // Create an empty row if there is space between the top of this row and the previous row
        if (paddingTop > 0) {
          let paddingRow = div.insertBefore(document.createElement('DIV'), divRow);
          paddingRow.style.height = paddingTop + 'px';
        }

        // Create an empty row if there is space between the bottom of the container and the last row
        if (i === rows.length - 1 && height) {
          let paddingBottom = height - row.yMax;
          if (paddingBottom > 0) {
            let paddingBottomRow = div.appendChild(document.createElement('DIV'));
            paddingBottomRow.style.height = paddingBottom + 'px';
          }
        }

        let sortedBoxes = row.sortBoxes();

        // Loop through each box
        sortedBoxes.forEach((currentBox, i) => {
          let box = row.getBox(currentBox),
            div: HTMLElement;

          // Set the div
          div = document.createElement('DIV');
          div.style.width = '100%';
          div.style.maxWidth = box.rect.width + 'px';
          div.style.display = 'inline-block';
          div.style.verticalAlign = 'top';
          divRow.appendChild(div);

          // Box is container
          if (box instanceof ContainerBoxComponent) {
            let containerBox = box as ContainerBoxComponent;

            containerBox.boxToHtml(this.createHtml(div, containerBox.boxContainer, null, containerBox.backgroundColor, containerBox.rect.height));
            // Box is text, button, or image
          } else {
            box.boxToHtml(div);
          }
        });
      });
    }
    return div;
  }

  htmlToBox(div: HTMLElement, container: Container) {
    if (div.title !== '') {
      let rect = this.getRect(div.title, div.title.indexOf('-') + 1),
        box: EditBoxComponent;

      // Text box
      if (div.title.substr(0, 7) === 'textBox') {
        let content = document.createElement('div');

        Array.from(div.children).forEach(child => {
          let foo;

          foo = document.createElement('div');
          foo.setAttribute('style', child.getAttribute('style'));
          foo.innerHTML = child.innerHTML;
          content.appendChild(foo);
        });

        let boxData = {
          content: content.innerHTML,
          backgroundColor: div.style.backgroundColor === '' ? null : div.style.backgroundColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }
        Container.currentContainer = container;

        box = this.editBoxService.createTextBox(boxData);
        this.editBoxService.loadedBoxes.push(box);

        // Container box
      } else if (div.title.substr(0, 12) === 'containerBox') {
        let boxData = {
          backgroundColor: div.style.backgroundColor === '' ? null : div.style.backgroundColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }

        Container.currentContainer = container;
        box = this.editBoxService.createContainerBox(boxData);
        this.editBoxService.loadedBoxes.push(box);
        container = Container.currentContainer;

        // Button box
      } else if (div.title.substr(0, 9) === 'buttonBox') {
        let boxData = {
          content: div.innerHTML,
          backgroundColor: div.style.backgroundColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }
        Container.currentContainer = container;
        box = this.editBoxService.createButtonBox(boxData);
        this.editBoxService.loadedBoxes.push(box);

        // Image box
      } else if (div.title.substr(0, 8) === 'imageBox') {
        // let anchor = div.getElementsByTagName('a');

        let boxData = {
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          // link: anchor.length > 0 ? anchor[0].getAttribute('href') : null,
          src: div.getElementsByTagName('img')[0].getAttribute('src')
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
            let parentElement: HTMLElement = div.parentElement;


            while (parentElement.style.textAlign.length === 0) {
              parentElement = parentElement.parentElement;
            }

            // Create the row
            row = box.container.addRow(parentElement.style.textAlign, box.rect.y);
          }

          // Add the box to the row
          row.addBox(box);
          window.clearInterval(interval);
        }
      }, 1);
    }

    Array.from(div.children).forEach((child: HTMLElement) => {
      this.htmlToBox(child, container);
    });
  }
}
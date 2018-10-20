import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { EmailGridComponent } from '../email-grid/email-grid.component';
import { EmailPreviewService } from '../email-preview.service';
import { Rect } from '../rect';
import { TextBoxComponent } from '../text-box/text-box.component';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  @ViewChild(EmailGridComponent) emailGridComponent: EmailGridComponent;
  @ViewChild('edit') editInput: ElementRef;
  public height: number;
  public emails: Array<any> = [];
  public pageWidth: number = 600;
  public pageHeight: number;
  public colorType: string;
  public change: number = 0;
  public currentItem;
  private emailContentContainerArray: Array<any>;
  private colorPalette: HTMLInputElement;
  private currentEmail;
  private currentToggleButton;


  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService) { }

  ngOnInit() {
    this.setHeight();
    this.colorPalette = document.createElement('input');
    this.colorPalette.type = 'color';
    this.colorPalette.onchange = (event: any) => {
      if (this.colorType === 'page') {
        this.currentEmail.pageColor = event.path[0].value;
      } else {
        this.currentEmail.backgroundColor = event.path[0].value;
      }
      EditBoxComponent.change.next();
    }

    EditBoxComponent.change.subscribe(() => {
      let div = document.body.appendChild(document.createElement('div'));

      let mainTable = this.createTable(div, '100%', null, null, null, null, this.currentEmail.backgroundColor);
      mainTable.style.lineHeight = 'normal';
      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.width = '100%';


      this.createTable(td, '100%', EditBoxComponent.mainContainer.boxes, null, this.pageWidth + 'px', 'center', this.currentEmail.pageColor);


      if (this.currentEmail.body !== mainTable.outerHTML) {
        this.currentEmail.body = mainTable.outerHTML;
        this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      }


      div.remove();


    });
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x: QueryList<ViewContainerRef>) => {
      this.emailContentContainerArray = x.toArray();
    });
  }

  ngDoCheck() {
    this.pageHeight = EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes && EditBoxComponent.mainContainer.boxes.length > 0 ? Math.max(...EditBoxComponent.mainContainer.boxes.map(x => x.rect.yMax)) : 0;
  }



  createTable(parent: HTMLElement, width: string, boxes?: Array<EditBoxComponent>, position?: Vector2, maxWidth?: string, align?: string, bgColor?: string) {
    let table: HTMLTableElement = parent.appendChild(document.createElement('table'));

    // Set the table properties
    table.width = width;
    table.cellPadding = '0';
    table.cellSpacing = '0';
    table.border = '0';

    // Set the optional properties
    if (maxWidth) table.style.maxWidth = maxWidth;
    if (align) table.align = align;
    if (bgColor) table.bgColor = bgColor;

    // If this table has boxes
    if (boxes && boxes.length > 0) {
      // Create rows based on the boxes position
      let rows = this.createRows(boxes, table, new Vector2(position ? position.x : 0, position ? position.y : 0));

      // Loop through each row
      rows.forEach(row => {
        // Create the columns for this row
        let parent: HTMLElement = rows.length > 1 ? this.createTable(row.element.appendChild(document.createElement('td')), '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        // Loop through each column
        columns.forEach((column) => {
          // Set the column properties
          let columnWidth = column.width / row.width * 100 + '%';

          if (columnWidth !== '100%') {
            column.element.vAlign = 'top';
            column.element.width = columnWidth;
          }


          // If this colum has 4 or more boxes, this means there are uneven columns and rows
          if (column.boxes.length >= 4) {

          } else if (column.boxes.length > 1) {
            // Group the boxes into another table if there are more than one box
            this.createTable(column.element, '100%', column.boxes, new Vector2(column.x, column.y));
          } else {
            // Set this box
            let box: EditBoxComponent = column.boxes[0],
              boxTableColumn = column.element;

            // If the box has a left or top margin
            if (box.rect.x > 0 || box.rect.y > 0) {
              let leftMarginWidth = (box.rect.x - column.x) / column.width * 100,
                boxTableContainerWidth = 100 - leftMarginWidth,
                topMarginHeight = box.rect.y - column.y,
                containerTable = this.createTable(column.element, '100%');

              // If the box as a top margin
              if (box.rect.y > 0) {
                let blankRow = containerTable.appendChild(document.createElement('tr'));

                // Create a td for the left margin and height
                if (leftMarginWidth > 0) {
                  let leftMargin = blankRow.appendChild(document.createElement('td'));
                  leftMargin.width = leftMarginWidth + '%';
                  leftMargin.height = topMarginHeight.toString();
                }

                // Create a blank td for the height
                let blankTd = blankRow.appendChild(document.createElement('td'));
                blankTd.width = boxTableContainerWidth + '%';
                blankTd.height = topMarginHeight.toString();
              }

              // Create a row for the boxTable
              let tr = containerTable.appendChild(document.createElement('tr'));

              // Create a td for the left margin 
              if (box.rect.x > 0) {
                tr.appendChild(document.createElement('td')).width = leftMarginWidth + '%';
              }

              // Create a column for the boxTable
              boxTableColumn = tr.appendChild(document.createElement('td'));
              boxTableColumn.width = boxTableContainerWidth + '%';
            }


            if (box instanceof ContainerBoxComponent) {
              let containerBox = box as ContainerBoxComponent;
              let boxTable = this.createTable(boxTableColumn, box.rect.width / boxTableColumn.offsetWidth * 100 + '%');
              boxTable.bgColor = box.backgroundColor;
              boxTable.className = 'container-box';


              let td = boxTable.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
              td.width = '100%';
              td.height = containerBox.rect.height.toString();
              td.vAlign = 'top';


              this.createTable(td, '100%', containerBox.container.boxes);

            } else {
              box.boxToTable(this.createTable(boxTableColumn, box.rect.width / boxTableColumn.offsetWidth * 100 + '%'));
            }


          }
        });
      });
    }
    return table;
  }


  createRows(boxes: Array<EditBoxComponent>, table: HTMLTableElement, position: Vector2) {
    let rows = [], currentRow, j;

    // Sort the boxes vertically
    boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.y > b.rect.y) return 1;
      return -1;
    });

    // Create the first row based on the top box
    rows.push({
      boxes: [boxes[0]],
      element: table.appendChild(document.createElement('tr')),
      x: position.x,
      y: position.y,
      width: table.clientWidth,
      height: boxes[0].rect.yMax - position.y
    });
    currentRow = rows[0];

    // See if any other box belongs to this row
    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentRow.boxes.length; j++) {
        if (boxes[i].rect.y < currentRow.boxes[j].rect.yMax) {
          currentRow.boxes.push(boxes[i]);
          currentRow.height = Math.max(currentRow.height, boxes[i].rect.yMax - currentRow.y);
          break;
        }
      }

      // Create a new row
      if (j === currentRow.boxes.length) {
        rows.push({
          boxes: [boxes[i]],
          element: table.appendChild(document.createElement('tr')),
          x: position.x,
          y: currentRow.height + currentRow.y,
          width: table.clientWidth,
          height: boxes[i].rect.yMax - (currentRow.height + currentRow.y)
        });
        currentRow = rows[rows.length - 1];
      }
    }

    return rows;
  }




  createColumns(row, parent: HTMLElement) {
    let columns = [], currentColumn, j, boxes: Array<EditBoxComponent>;

    // Sort the boxes horizontally
    boxes = row.boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.x > b.rect.x) return 1;
      return -1;
    });


    // Create the first column based on the most left box
    columns.push({
      boxes: [boxes[0]],
      element: parent.appendChild(document.createElement('td')),
      x: row.x,
      y: row.y,
      width: boxes[0].rect.xMax - row.x,
      height: row.height
    });
    currentColumn = columns[0];

    // See if any other box belongs to this column
    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentColumn.boxes.length; j++) {
        if (boxes[i].rect.x < currentColumn.boxes[j].rect.xMax) {
          currentColumn.boxes.push(boxes[i]);
          currentColumn.width = Math.max(currentColumn.width, boxes[i].rect.xMax - currentColumn.x);
          break;
        }
      }

      // Create a new column
      if (j === currentColumn.boxes.length) {
        columns.push({
          boxes: [boxes[i]],
          element: parent.appendChild(document.createElement('td')),
          x: currentColumn.width + currentColumn.x,
          y: row.y,
          width: boxes[i].rect.xMax - (currentColumn.width + currentColumn.x),
          height: row.height
        });
        currentColumn = columns[columns.length - 1];
      }
    }

    // Set the last column's width
    if (columns.length > 1) {
      currentColumn.width = row.width - currentColumn.x;
    } else {
      currentColumn.width = row.width;
    }

    return columns;
  }


  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index, email) {
    if (input.checked) {
      input.checked = false;
      EditBoxComponent.currentContainer = null;
    } else {
      this.onEmailClick(email);
      input.checked = true;
      EditBoxComponent.currentContainer = EditBoxComponent.mainContainer = this.emailContentContainerArray[index];
      this.currentToggleButton = input;
      this.loadEmail();
    }
  }

  loadEmail() {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentEmail.body, "text/html"),
      mainTable: HTMLTableElement = document.body.appendChild(doc.body).firstElementChild as HTMLTableElement,
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement,
      rect = pageTable.getBoundingClientRect();

    // Set the colors
    this.currentEmail.backgroundColor = mainTable.bgColor;
    this.currentEmail.pageColor = pageTable.bgColor;


    this.tableToBox(pageTable, new Vector2(rect.left, rect.top), EditBoxComponent.currentContainer);


    document.body.lastElementChild.remove();
  }

  tableToBox(table: HTMLTableElement, offset: Vector2, container: ViewContainerRef) {
    let rect = table.getBoundingClientRect();

    // Text box
    if (table.className === 'text-box') {
      let content = document.createElement('div');

      content.setAttribute('style', table.rows[0].firstElementChild.getAttribute('style'));
      content.innerHTML = table.rows[0].firstElementChild.innerHTML;
      let box = {
        content: content.outerHTML,
        backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
        rect: new Rect(rect.left - offset.x, rect.top - offset.y, rect.width, rect.height),
        loading: true
      }
      EditBoxComponent.currentContainer = container;
      this.editBoxService.createTextBox(box);

      // Container box
    } else if (table.className === 'container-box') {
      let box = {
        backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
        rect: new Rect(rect.left - offset.x, rect.top - offset.y, rect.width, rect.height),
        loading: true
      }
      offset = new Vector2(rect.left, rect.top);
      EditBoxComponent.currentContainer = container;
      this.editBoxService.createContainerBox(box);
      container = EditBoxComponent.currentContainer;

      // Button box
    } else if (table.className === 'button-box') {
      let box = {
        content: table.getElementsByTagName('table')[0].rows[0].firstElementChild.innerHTML,
        backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
        rect: new Rect(rect.left - offset.x, rect.top - offset.y, rect.width, rect.height),
        loading: true,
        link: table.getElementsByTagName('a')[0].getAttribute('href')
      }
      EditBoxComponent.currentContainer = container;
      this.editBoxService.createButtonBox(box);

      // Image box
    } else if (table.className === 'image-box') {
      let box = {
        rect: new Rect(rect.left - offset.x, rect.top - offset.y, rect.width, rect.height),
        loading: true,
        link: table.getElementsByTagName('a')[0].getAttribute('href'),
        src: table.getElementsByTagName('img')[0].getAttribute('src')
      }
      EditBoxComponent.currentContainer = container;
      this.editBoxService.createImageBox(box);
    }

    Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
      Array.from(row.children).forEach((td: HTMLTableColElement) => {
        if (td.firstElementChild && td.firstElementChild.tagName === 'TABLE') {
          this.tableToBox(td.firstElementChild as HTMLTableElement, offset, container);
        }
      });
    });
  }

  onItemClick(item) {
    if (item.tierIndex === 0) {
      this.emails = [];
      this.currentItem = null;
      return;
    }
    this.emails = item.emails;
    this.currentItem = item;
  }

  onEmailClick(email) {
    if (this.currentEmail && this.currentEmail !== email) {
      this.currentEmail.selected = false;
      if (this.currentToggleButton) this.currentToggleButton.checked = false;
      EditBoxComponent.currentContainer = null;
    }
    this.currentEmail = email;
    email.selected = true;
  }

  onEmailDelete() {
    if (this.currentEmail && this.currentEmail.selected) {
      this.currentEmail.isDeleted = true;
      this.currentEmail.selected = false;
      this.change += 1;
      this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      this.currentItem.emails.splice(this.currentItem.emails.findIndex(x => x === this.currentEmail), 1);

      // Reorder the days of this item's emails
      this.currentItem.emails.forEach((email, i) => {
        email.day = i + 1;
      });
    }

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape') {
      if (this.currentEmail && this.currentEmail.selected) {
        if (this.currentEmail.isInEditMode) {
          this.currentEmail.isInEditMode = false;
        } else if (!EditBoxComponent.currentEditBox || !EditBoxComponent.currentEditBox.isSelected) {
          if (this.currentToggleButton && this.currentToggleButton.checked) {
            this.currentToggleButton.checked = false;
            EditBoxComponent.currentContainer = null;
          } else {
            this.currentEmail.selected = false;
          }
        } else {
          EditBoxComponent.currentEditBox.unSelect();
        }
      }
    } else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (this.currentEmail.isInEditMode) {
        this.currentEmail.isInEditMode = false;

        if (this.currentEmail.subject !== this.editInput.nativeElement.value) {
          this.currentEmail.subject = this.editInput.nativeElement.value;
          this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
        }


      }
    }
  }

  onMouseDown() {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.unSelect();
  }

  setColor(colorType: string) {
    this.colorType = colorType;
    this.colorPalette.click();
  }

  editEmail(email) {
    email.isInEditMode = true;
    window.setTimeout(() => {
      this.editInput.nativeElement.focus();
    }, 1);

  }

  newEmail() {
    let day = this.currentItem.emails.length + 1;

    this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
    this.currentItem.emails.push({
      id: Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase(),
      subject: 'subject',
      body: '',
      day: day
    });
    this.change += 1;
    this.currentEmail = this.currentItem.emails[this.currentItem.emails.length - 1];
    this.editEmail(this.currentEmail);
  }
}
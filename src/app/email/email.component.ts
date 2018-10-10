import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('emailContentContainer', { read: ViewContainerRef }) emailContentContainer: QueryList<ViewContainerRef>;
  public height: number;
  public emails: Array<any> = [];
  public pageWidth: number = 600;
  public pageHeight: number;
  public backgroundColor: string = '#ffffff';
  public pageColor: string = '#ffffff';
  public colorType: string;
  private emailContentContainerArray: Array<any>;
  private colorPalette: HTMLInputElement;



  // temp
  @ViewChild('tempTable') tempTable: ElementRef;

  constructor(public editBoxService: EditBoxService) { }

  ngOnInit() {
    this.setHeight();
    this.colorPalette = document.createElement('input');
    this.colorPalette.type = 'color';
    this.colorPalette.onchange = (event: any) => {
      if (this.colorType === 'page') {
        this.pageColor = event.path[0].value;
      } else {
        this.backgroundColor = event.path[0].value;
      }

    }
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x: QueryList<ViewContainerRef>) => {
      this.emailContentContainerArray = x.toArray();
    });
  }

  ngDoCheck() {
    this.pageHeight = EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes && EditBoxComponent.mainContainer.boxes.length > 0 ? Math.max(...EditBoxComponent.mainContainer.boxes.map(x => x.rect.yMax)) : 0;

    // this.setTable();
  }

  setTable() {
    if (EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes) {
      let mainTable = this.createTable(this.tempTable.nativeElement, '100%', null, null, null, null, this.backgroundColor);
      mainTable.style.lineHeight = 'normal';
      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.width = '100%';


      let pageTable = this.createTable(td, '100%', EditBoxComponent.mainContainer.boxes, null, this.pageWidth + 'px', 'center', this.pageColor);
    }

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
    if (boxes) {
      // Create rows based on the boxes position
      let rows = this.createRows(boxes, table, new Vector2(position ? position.x : 0, position ? position.y : 0));

      // Loop through each row
      rows.forEach(row => {
        // Create the columns for this row
        let parent: HTMLElement = rows.length > 1 ? this.createTable(row.element, '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        // Loop through each column
        columns.forEach((column) => {
          // Set the column properties
          column.element.vAlign = 'top';
          column.element.width = column.width / row.width * 100 + '%';

          // If this colum has 4 or more boxes, this means there are uneven columns and rows
          if (column.boxes.length >= 4) {

          } else if (column.boxes.length > 1) {
            // Group the boxes into another table if there are more than one box
            this.createTable(column.element, '100%', column.boxes, new Vector2(column.x, column.y));
          } else {
            // Set this box
            let box = column.boxes[0],
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

            // Create the box table
            let boxTable = this.createTable(boxTableColumn, box.rect.width / boxTableColumn.offsetWidth * 100 + '%');

            boxTable.style.backgroundColor = box.editBox.nativeElement.style.backgroundColor;
            Array.from(box.content.children).forEach((content: HTMLElement) => {
              let td = boxTable.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));

              if (content.tagName === 'OL' || content.tagName === 'UL') {
                let list = td.appendChild(document.createElement(content.tagName));
                list.setAttribute('style', content.getAttribute('style'));
                list.innerHTML = content.innerHTML;
              } else {
                td.style.textAlign = content.style.textAlign;
                td.innerHTML = content.innerHTML;
              }


            });
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

  onToggleButtonClick(input, index) {
    if (input.checked) {
      input.checked = false;
      EditBoxComponent.currentContainer = null;
    } else {
      input.checked = true;
      EditBoxComponent.currentContainer = EditBoxComponent.mainContainer = this.emailContentContainerArray[index];
    }
  }

  onItemClick(item) {
    if (item.tierIndex === 0) {
      this.emails = [];
      return;
    }
    this.emails = item.emails
      .map(x => ({
        id: x.id,
        subject: x.subject,
        body: x.body
      }));
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

  onMouseDown() {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.unSelect();
  }

  setColor(colorType: string) {
    this.colorType = colorType;
    this.colorPalette.click();
  }
}
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
    let table = document.getElementById('table');
    if (table) table.remove();

    if (EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes) {


      let mainTable = this.createTable(this.tempTable.nativeElement, '100%');
      mainTable.bgColor = this.backgroundColor;

      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.width = '100%';


      let pageTable = this.createTable(td, '100%', EditBoxComponent.mainContainer.boxes, null, this.pageWidth + 'px');
      pageTable.align = 'center';
      pageTable.bgColor = this.pageColor;
    }

  }

  createTable(parent, width, boxes?, position?: Vector2, maxWidth?) {
    let table = parent.appendChild(document.createElement('table'));
    table.width = width;
    table.cellPadding = 0;
    table.cellSpacing = 0;
    table.border = 0;
    if (maxWidth) {
      table.style.maxWidth = maxWidth;
    }

    if (boxes) {
      let rows = this.createRows(boxes, table, new Vector2(position ? position.x : 0, position ? position.y : 0));

      rows.forEach(row => {
        let parent = rows.length > 1 ? this.createTable(row.element, '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        columns.forEach((column) => {
          column.element.vAlign = 'top';
          column.element.width = column.width / row.width * 100 + '%';

          if (column.boxes.length >= 4) {

          } else if (column.boxes.length > 1) {
            this.createTable(column.element, '100%', column.boxes, new Vector2(column.x, column.y));
          } else {

            let box = column.boxes[0];
            let boxTable = this.createTable(column.element, box.rect.width / column.width * 100 + '%');

            // boxTable.style.marginLeft = (box.rect.x - column.x) / column.width * 100 + '%';
            // boxTable.style.marginTop = (box.rect.y - column.y) + 'px';
            boxTable.style.backgroundColor = box.editBox.nativeElement.style.backgroundColor;

            Array.from(box.content.children).forEach((content: HTMLElement) => {
              let td = boxTable.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
              td.style.textAlign = content.style.textAlign;
              td.innerHTML = content.innerHTML;
            });

          }
        });
      });
    }
    return table;
  }





  createRows(boxes: Array<EditBoxComponent>, parent, position: Vector2) {
    let rows = [], currentRow, j;

    boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.y > b.rect.y) return 1;
      return -1;
    });



    rows.push({
      boxes: [boxes[0]],
      element: parent.appendChild(document.createElement('tr')),
      x: position.x,
      y: position.y,
      width: parent.clientWidth,
      height: boxes[0].rect.yMax - position.y
    });
    currentRow = rows[0];


    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentRow.boxes.length; j++) {
        if (boxes[i].rect.y < currentRow.boxes[j].rect.yMax) {
          currentRow.boxes.push(boxes[i]);
          currentRow.height = Math.max(currentRow.height, boxes[i].rect.yMax - currentRow.y);
          break;
        }
      }
      if (j === currentRow.boxes.length) {
        rows.push({
          boxes: [boxes[i]],
          element: parent.appendChild(document.createElement('tr')),
          x: position.x,
          y: currentRow.height + currentRow.y,
          width: parent.clientWidth,
          height: boxes[i].rect.yMax - (currentRow.height + currentRow.y)
        });
        currentRow = rows[rows.length - 1];
      }
    }

    return rows;
  }




  createColumns(row, parent) {
    let columns = [], currentColumn, j, boxes: Array<EditBoxComponent>;

    boxes = row.boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.x > b.rect.x) return 1;
      return -1;
    });



    columns.push({
      boxes: [boxes[0]],
      element: parent.appendChild(document.createElement('td')),
      x: row.x,
      y: row.y,
      width: boxes[0].rect.xMax - row.x,
      height: row.height
    });
    currentColumn = columns[0];


    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentColumn.boxes.length; j++) {
        if (boxes[i].rect.x < currentColumn.boxes[j].rect.xMax) {
          currentColumn.boxes.push(boxes[i]);
          currentColumn.width = Math.max(currentColumn.width, boxes[i].rect.xMax - currentColumn.x);
          break;
        }
      }
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
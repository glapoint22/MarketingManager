import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';

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
  public backgroundColor: string = '#00000000';
  public pageColor: string = '#00000000';
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
  }

  setTable() {
    if (EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes) {


      let mainTable = this.createTable(this.tempTable.nativeElement, 0, 0, '100%');

      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.style.padding = 0;

      let pageTable = this.createTable(td, 0, 0, '600px', EditBoxComponent.mainContainer.boxes);
      pageTable.style.margin = 'auto';
    }

  }

  createTable(parent, x, y, width, boxes?) {
    let table = parent.appendChild(document.createElement('table'));
    table.style.marginLeft = x + 'px';
    table.style.marginTop = y + 'px';
    table.style.width = width;
    table.style.borderCollapse = 'collapse';

    if (boxes) {
      let rows = this.createRows(boxes, table);

      rows.forEach(row => {
        let parent = rows.length > 1 ? this.createTable(row.element, 0, 0, '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        columns.forEach((column) => {
          let table

          // Set the column style
          column.element.style.padding = '0';
          column.element.style.outline = '1px solid white';
          column.element.style.verticalAlign = 'top';
          column.element.style.width = column.width + 'px';

          if (column.boxes.length >= 4) {
            let a = 0;
          } else if (column.boxes.length > 1) {
            table = this.createTable(column.element, 0, 0, column.width + 'px', column.boxes);
            column.element.style.outline = '1px solid white';
          } else {

            let box = column.boxes[0];
            table = this.createTable(column.element, box.rect.x - column.x, box.rect.y - column.y, box.rect.width + 'px');

            // temp
            table.style.height = box.rect.height + 'px';
            table.style.outline = '1px solid red';
          }
        });
      });
    }
    return table;
  }





  createRows(boxes: Array<EditBoxComponent>, parent) {
    let rows = [], currentRow, j;

    boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.y > b.rect.y) return 1;
      return -1;
    });



    rows.push({
      boxes: [boxes[0]],
      element: parent.appendChild(document.createElement('tr')),
      x: parent.parentElement.offsetLeft,
      y: parent.parentElement.offsetTop,
      width: parent.clientWidth,
      height: boxes[0].rect.yMax - parent.offsetTop
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
          x: parent.parentElement.offsetLeft,
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


    currentColumn.width = row.width - currentColumn.x;


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
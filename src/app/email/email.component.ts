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

    // this.setTable();
  }

  setTable() {
    let table = document.getElementById('table');
    if (table) table.remove();

    if (EditBoxComponent.mainContainer && EditBoxComponent.mainContainer.boxes) {


      let mainTable = this.createTable(this.tempTable.nativeElement, '100%');
      mainTable.id = 'table';

      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      // td.style.padding = 0;

      let pageTable = this.createTable(td, '600', EditBoxComponent.mainContainer.boxes);
      pageTable.align = 'center';
      pageTable.style.backgroundColor = '#000000';
      // pageTable.style.margin = 'auto';
    }

  }

  createTable(parent, width, boxes?, position?: Vector2) {
    let table = parent.appendChild(document.createElement('table'));
    // table.style.marginLeft = x + 'px';
    // table.style.marginTop = y + 'px';
    // table.style.width = width;
    table.width = width;
    table.cellPadding = 0;
    table.cellSpacing = 0;
    // table.style.borderCollapse = 'collapse';
    // table.style.tableLayout = 'fixed';





    if (boxes) {
      let rows = this.createRows(boxes, table, new Vector2(position ? position.x : 0, position ? position.y : 0));

      rows.forEach(row => {
        let parent = rows.length > 1 ? this.createTable(row.element, '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        columns.forEach((column) => {
          let table

          // Set the column style
          // column.element.style.padding = '0';
          column.element.style.outline = '1px solid white';
          column.element.style.verticalAlign = 'top';
          column.element.style.width = column.width + 'px';

          if (column.boxes.length >= 4) {
            let a = 0;
          } else if (column.boxes.length > 1) {
            table = this.createTable(column.element, column.width, column.boxes, new Vector2(column.x, column.y));
            column.element.style.outline = '1px solid white';
          } else {

            let box = column.boxes[0];
            table = this.createTable(column.element, box.rect.width);

            table.style.marginLeft = box.rect.x - column.x + 'px';
            table.style.marginTop = box.rect.y - column.y + 'px';
            table.style.height = box.rect.height + 'px';
            // table.style.outline = '1px solid red';

            let td = table.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
              td.style.outline = '1px solid red';
              td.style.color = '#ffffff';
              // td.style.padding = '0';
              td.style.fontSize = '16px';
              td.style.fontFamily = '"Times New Roman", Times, serif';
              td.style.lineHeight = 'normal';
              td.style.verticalAlign = 'top';
              // td.style.wordWrap = 'break-word';
              td.appendChild(document.createTextNode('This is a temporary paragraph. Double click to edit this text.'));
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
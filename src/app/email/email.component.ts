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


      let mainTable = this.foo(this.tempTable.nativeElement, 0, 0, '100%');

      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.style.padding = 0;

      let pageTable = this.foo(td, 0, 0, '600px');
      pageTable.style.margin = 'auto';
      tr = pageTable.appendChild(document.createElement('tr'));
      td = tr.appendChild(document.createElement('td'));




      // let rows = this.groupBoxes(EditBoxComponent.mainContainer.boxes, true);
      // rows.forEach(row => {
      //   row.columns = this.groupBoxes(row.boxes);
      // });


      let table = this.createTable(EditBoxComponent.mainContainer.boxes);


    }

  }

  foo(parent, x, y, width) {
    let table = parent.appendChild(document.createElement('table'));
    table.style.marginLeft = x + 'px';
    table.style.marginTop = y + 'px';
    table.style.width = width;
    table.style.borderCollapse = 'collapse';
    return table;
  }

  createTable(boxes: Array<EditBoxComponent>) {
    let rows = this.groupBoxes(boxes, true);
    rows.forEach(row => {
      let columns = this.groupBoxes(row.boxes);
      for (let i = 0; i < columns.length; i++) {
        if (columns[i].boxes.length > 1) {
          columns[i] = { table: this.createTable(columns[i].boxes) }
        } else {
          columns[i] = { box: columns[i].boxes[0] }
        }
      }
      row.columns = columns;

    });

    return {
      rows: rows.map(x => ({
        columns: x.columns
      }))
    }
  }

  groupBoxes(boxes: Array<EditBoxComponent>, isHorizontal?: boolean) {
    let groups = [],
      currentGroup,
      j,
      component = isHorizontal ? 'y' : 'x',
      max = isHorizontal ? 'yMax' : 'xMax';



    boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect[component] > b.rect[component]) return 1;
      return -1;
    });



    groups.push({ boxes: [boxes[0]] });
    currentGroup = groups[0];


    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentGroup.boxes.length; j++) {
        if (boxes[i].rect[component] < currentGroup.boxes[j].rect[max]) {
          currentGroup.boxes.push(boxes[i]);
          break;
        }
      }
      if (j === currentGroup.boxes.length) {
        groups.push({ boxes: [boxes[i]] });
        currentGroup = groups[groups.length - 1];
      }
    }

    return groups;
  }

  // createColumns(boxes: Array<EditBoxComponent>) {
  //   let columns = [],
  //     currentColumn,
  //     j;

  //   boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
  //     if (a.rect.x > b.rect.x) return 1;
  //     return -1;
  //   });


  //   columns.push({ boxes: [boxes[0]] });
  //   currentColumn = columns[0];



  //   for (let i = 1; i < boxes.length; i++) {
  //     for (j = 0; j < currentColumn.boxes.length; j++) {
  //       if (boxes[i].rect.x < currentColumn.boxes[j].rect.xMax) {
  //         currentColumn.boxes.push(boxes[i]);
  //         break;
  //       }
  //     }

  //     if (j === currentColumn.boxes.length) {
  //       columns.push({ boxes: [boxes[i]] });
  //       currentColumn = columns[columns.length - 1];
  //     }

  //   }

  //   return columns;

  // }

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
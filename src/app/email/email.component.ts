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
      // tr = pageTable.appendChild(document.createElement('tr'));
      // td = tr.appendChild(document.createElement('td'));




      // let rows = this.groupBoxes(EditBoxComponent.mainContainer.boxes, true);
      // rows.forEach(row => {
      //   row.columns = this.groupBoxes(row.boxes);
      // });


      // this.createRowsColumns(pageTable, EditBoxComponent.mainContainer.boxes);


    }

  }

  createTable(parent, x, y, width, boxes?) {
    let table = parent.appendChild(document.createElement('table'));
    table.style.marginLeft = x + 'px';
    table.style.marginTop = y + 'px';
    table.style.width = width;
    table.style.borderCollapse = 'collapse';




    if (boxes) {
      let rows = this.groupBoxes(boxes, table, 'tr');

      rows.forEach(row => {
        // let tableData = row.element.appendChild(document.createElement('td'));

        // let t = this.createTable(tableData, 0, 0, '100%');
        // let r = t.appendChild(document.createElement('tr'));


        let columns = this.groupBoxes(row.boxes, row.element, 'td');
        columns.forEach((column) => {
          column.element.style.padding = '0';
          column.element.style.border = '1px solid white';
          column.element.style.verticalAlign = 'top';
          
          
          
          let table
          if (column.boxes.length > 1) {
            table = this.createTable(column.element, column.element.offsetLeft, column.element.offsetTop, column.element.offsetWidth + 'px', column.boxes);
            
            column.element.style.border = '1px solid white';
          } else {
            let box = column.boxes[0];

            
            // column.element.style.width = column.element.parentElement.offsetWidth - column.element.offsetLeft + 'px';
            


            table = this.createTable(column.element, box.rect.x - column.element.offsetLeft, box.rect.y - column.element.offsetTop, box.rect.width + 'px');


            table.style.height = column.boxes[0].rect.height + 'px';
            let tr = table.appendChild(document.createElement('tr'));
            let td = tr.appendChild(document.createElement('td'));
            td.style.outline = '1px solid red';
            td.style.padding = '0';
            td.style.verticalAlign = 'top';

          }
        });
      });
    }


    return table;
  }

  

  groupBoxes(boxes: Array<EditBoxComponent>, parent, elementType) {
    let groups = [],
      currentGroup,
      j,
      component = elementType === 'tr' ? 'y' : 'x',
      max = elementType === 'tr' ? 'yMax' : 'xMax';



    boxes = boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect[component] > b.rect[component]) return 1;
      return -1;
    });



    groups.push({
      boxes: [boxes[0]],
      element: parent.appendChild(document.createElement(elementType))
    });
    currentGroup = groups[0];


    for (let i = 1; i < boxes.length; i++) {
      for (j = 0; j < currentGroup.boxes.length; j++) {
        if (boxes[i].rect[component] < currentGroup.boxes[j].rect[max]) {
          currentGroup.boxes.push(boxes[i]);
          break;
        }
      }
      if (j === currentGroup.boxes.length) {
        groups.push({
          boxes: [boxes[i]],
          element: parent.appendChild(document.createElement(elementType))
        });
        currentGroup = groups[groups.length - 1];
      }
    }

    return groups;
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
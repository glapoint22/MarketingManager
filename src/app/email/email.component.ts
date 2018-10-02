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
      

      let mainTable =  this.createTable(this.tempTable.nativeElement, 0, 0, '100%');

      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.style.padding = 0;
      
      let pageTable =  this.createTable(td, 0,0,'600px');
      pageTable.style.margin = 'auto';
      tr = pageTable.appendChild(document.createElement('tr'));
      td = tr.appendChild(document.createElement('td'));


      let boxes: Array<EditBoxComponent> = EditBoxComponent.mainContainer.boxes.sort((a: EditBoxComponent, b: EditBoxComponent) => {
        if (a.rect.y > b.rect.y) return 1;
        return -1;
      });

      let rows = [];

      rows.push({
        boxes: [boxes[0]],
        columns: []
      });
      let currentRow = rows[0];
      let j;

      for(let i = 1; i < boxes.length; i++){
        for(j = 0; j < currentRow.boxes.length; j++){
          if(boxes[i].rect.y < currentRow.boxes[j].rect.yMax){
            currentRow.boxes.push(boxes[i]);
            break;
          }
        }
        if(j === currentRow.boxes.length){
          rows.push({
            boxes: [boxes[i]],
            columns: []
          });
          currentRow = rows[rows.length - 1];
        }
      }

    }
  }

  createTable(parent, x, y, width) {
    let table = parent.appendChild(document.createElement('table'));
    table.style.marginLeft = x + 'px';
    table.style.marginTop = y + 'px';
    table.style.width = width;
    table.style.borderCollapse = 'collapse';
    return table;
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
import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { EmailGridComponent } from '../email-grid/email-grid.component';
import { EmailPreviewService } from '../email-preview.service';
import { TableService } from '../table.service';

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
  public speed: number;
  private emailContentContainerArray: Array<any>;
  private colorPalette: HTMLInputElement;
  private currentEmail;
  private currentToggleButton;


  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService, private tableService: TableService) { }

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

      let mainTable = this.tableService.createTable(div, '100%', null, null, null, null, this.currentEmail.backgroundColor);
      mainTable.style.lineHeight = 'normal';
      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.width = '100%';


      this.tableService.createTable(td, '100%', EditBoxComponent.mainContainer.boxes, null, this.pageWidth + 'px', 'center', this.currentEmail.pageColor);


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


  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index, email) {
    if (input.checked) {
      this.speed = 0.5;
      input.checked = false;
      EditBoxComponent.currentContainer = null;
    } else {
      this.onEmailClick(email);
      input.checked = true;
      EditBoxComponent.currentContainer = EditBoxComponent.mainContainer = this.emailContentContainerArray[index];
      this.currentToggleButton = input;
      if (email.body !== '') this.loadEmail();
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


    this.tableService.tableToBox(pageTable, new Vector2(rect.left, rect.top), EditBoxComponent.currentContainer);


    document.body.lastElementChild.remove();
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
    this.speed = 0.5;
    if (this.currentEmail && this.currentEmail !== email) {
      this.currentEmail.selected = false;
      // this.currentEmail.isInEditMode = false;
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
      day: day,
      backgroundColor: '#ffffff',
      pageColor: '#ffffff'
    });
    this.change += 1;
    let email = this.currentItem.emails[this.currentItem.emails.length - 1];


    this.editEmail(email);
    this.onEmailClick(email);
    this.currentEmail = email;
  }

  transitionEnd() {
    if (this.currentToggleButton.checked) {
      this.speed = 0;
    }
  }
}
import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EmailGridComponent } from '../email-grid/email-grid.component';
import { EmailPreviewService } from '../email-preview.service';
import { TableService } from '../table.service';
import { EditBoxManagerService } from '../edit-box-manager.service';

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
  public colorType: string;
  public change: number = 0;
  public currentItem;
  public speed: number;
  private emailContentContainerArray: Array<any>;
  private colorPalette: HTMLInputElement;
  private currentEmail;
  private currentToggleButton;
  private closedContainer: any;
  private defaultSpeed: number = 0.5;
  private copy: any;

  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService, private tableService: TableService, public editBoxManagerService: EditBoxManagerService) { }

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
      this.editBoxManagerService.change.next();
    }

    this.editBoxManagerService.change.subscribe(() => {
      let div = document.body.appendChild(document.createElement('div'));

      let mainTable = this.tableService.createTable(div, null, null, this.currentEmail.backgroundColor);
      mainTable.style.lineHeight = 'normal';
      let tr = mainTable.appendChild(document.createElement('tr'));
      let td = tr.appendChild(document.createElement('td'));
      td.width = '100%';
      td.align = 'center';


      this.tableService.createTable(td, this.editBoxManagerService.mainContainer.boxes, this.pageWidth, this.currentEmail.pageColor);


      if (this.currentEmail.body !== mainTable.outerHTML) {
        this.currentEmail.body = mainTable.outerHTML;
        this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      }

      div.remove();
    });
    this.editBoxManagerService.minContainerHeight = 40;
  }

  ngAfterViewInit() {
    this.emailContentContainer.changes.subscribe((x: QueryList<ViewContainerRef>) => {
      this.emailContentContainerArray = x.toArray();
    });
  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index, email) {
    this.speed = this.defaultSpeed;
    if (input.checked) {
      input.checked = false;
      this.closedContainer = this.editBoxManagerService.currentContainer;
      this.editBoxManagerService.currentContainer = null;
    } else {
      this.closedContainer = null;
      this.onEmailClick(email);
      input.checked = true;
      this.editBoxManagerService.currentContainer = this.editBoxManagerService.mainContainer = this.emailContentContainerArray[index];
      this.currentToggleButton = input;
      if (this.currentEmail.body !== '' && (!this.editBoxManagerService.currentContainer.boxes || this.editBoxManagerService.currentContainer.boxes.length === 0)) {
        this.loadEmail();
      }
      this.editBoxManagerService.setContainerHeight(this.editBoxManagerService.mainContainer);
    }
  }

  loadEmail() {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentEmail.body, "text/html"),
      mainTable: HTMLTableElement = doc.body.firstElementChild as HTMLTableElement,
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement;

    // Set the colors
    this.currentEmail.backgroundColor = mainTable.bgColor;
    this.currentEmail.pageColor = pageTable.bgColor;

    // Create the boxes
    this.tableService.tableToBox(pageTable, this.editBoxManagerService.currentContainer);

    // Set the current container as this page
    this.editBoxManagerService.currentContainer = this.editBoxManagerService.mainContainer;
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
      if (this.currentToggleButton) {
        this.speed = this.defaultSpeed;
        this.currentToggleButton.checked = false;
        this.closedContainer = this.editBoxManagerService.currentContainer;
      }
      this.editBoxManagerService.currentContainer = null;
    }
    this.currentEmail = email;
    email.selected = true;
  }

  deleteEmail() {
    if (this.currentEmail && this.currentEmail.selected) {
      // this.currentEmail.isDeleted = true;
      this.currentEmail.selected = false;
      this.change += 1;
      this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      this.currentItem.emails.splice(this.currentItem.emails.findIndex(x => x === this.currentEmail), 1);

      if (this.currentItem.tierIndex === 2) {
        // Reorder the days of this item's emails
        this.currentItem.emails.forEach((email, i) => {
          email.day = i + 1;
        });
      }

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
        } else if (!this.editBoxManagerService.currentEditBox || !this.editBoxManagerService.currentEditBox.isSelected) {
          if (this.currentToggleButton && this.currentToggleButton.checked) {
            this.currentToggleButton.checked = false;
            this.closedContainer = this.editBoxManagerService.currentContainer;
            this.editBoxManagerService.currentContainer = null;
            this.speed = this.defaultSpeed;
          } else {
            this.currentEmail.selected = false;
          }
        } else {
          this.editBoxManagerService.currentEditBox.unSelect();
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

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.editBoxManagerService.currentEditBox) this.editBoxManagerService.currentEditBox.onMouseMove(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (this.editBoxManagerService.currentEditBox) this.editBoxManagerService.currentEditBox.onMouseUp();
  }

  onMouseDown() {
    if (this.editBoxManagerService.currentEditBox) this.editBoxManagerService.currentEditBox.unSelect();
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

  newEmail(data?) {
    if ((this.currentItem.tierIndex === 1 && this.currentItem.emails.length === 0) || this.currentItem.tierIndex === 2) {
      this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      this.currentItem.emails.push({
        id: Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase(),
        subject: data ? data.subject : 'subject',
        body: data ? data.body : '',
        backgroundColor: data ? data.backgroundColor : '#ffffff',
        pageColor: data ? data.pageColor : '#ffffff'
      });
      let email = this.currentItem.emails[this.currentItem.emails.length - 1];

      if (this.currentItem.tierIndex === 2) {
        email.day = this.currentItem.emails.length;
      }

      this.change += 1;
      this.onEmailClick(email);
      this.currentEmail = email;
      this.editEmail(email);
    }


  }

  transitionEnd(event) {
    if (event.elapsedTime >= this.defaultSpeed) {
      this.speed = 0;
      if (this.closedContainer) {
        this.closedContainer.clear();
        if (this.closedContainer.boxes) {
          this.closedContainer.boxes = [];
        }
        this.closedContainer = null;
      }
    }
  }

  copyEmail() {
    if (this.currentEmail && this.currentEmail.selected) {
      let regex = RegExp(/bgcolor="(#[a-z0-9]+)"/, 'g');

      this.copy = {
        body: this.currentEmail.body,
        subject: this.currentEmail.subject,
        backgroundColor: regex.exec(this.currentEmail.body)[1],
        pageColor: regex.exec(this.currentEmail.body)[1]
      }
    }
  }

  pasteEmail() {
    if (this.copy) this.newEmail(this.copy);
  }

  cutEmail() {
    this.copyEmail();
    this.deleteEmail();
  }
}
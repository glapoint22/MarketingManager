import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EmailGridComponent } from '../email-grid/email-grid.component';
import { EmailPreviewService } from '../email-preview.service';
import { TableService } from '../table.service';
import { Container } from '../container';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { MenuService } from '../menu.service';
import { ColorService } from '../color.service';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  @ViewChildren('viewContainerRef', { read: ViewContainerRef }) viewContainerRefs: QueryList<ViewContainerRef>;
  @ViewChild(EmailGridComponent) emailGridComponent: EmailGridComponent;
  @ViewChild('edit') editInput: ElementRef;
  @ViewChild('page') page: ElementRef;
  public height: number;
  public emails: Array<any> = [];
  public pageWidth: number = 600;
  public change: number = 0;
  public currentItem;
  public speed: number;
  private currentEmail;
  private currentToggleButton;
  private container: Container;
  private closedContainer: Container;
  private defaultSpeed: number = 0.5;
  private copy: any;
  private minContainerHeight: number = 40;
  private changeTimeStamp: number;
  private isTimeOut: boolean;

  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService, private tableService: TableService, private menuService: MenuService, private colorService: ColorService, private promptService: PromptService) { }

  ngOnInit() {
    this.setHeight();

    this.changeTimeStamp = Date.now();
    EditBoxComponent.change.subscribe(() => {
      let currentTime = Date.now(),
        deltaTime = currentTime - this.changeTimeStamp,
        waitTime = 500;

      this.changeTimeStamp = currentTime;

      // Only call email change if delta time is greater than wait time
      if (deltaTime < waitTime && !this.isTimeOut) {
        this.isTimeOut = true;
        window.setTimeout(() => {
          this.onEmailChange();
          this.isTimeOut = false;
        }, waitTime);
      } else {
        if (!this.isTimeOut) this.onEmailChange();
      }
    });
  }

  onEmailChange() {
    // Create the main table
    let mainTable = this.tableService.createTable(document.createElement('div'), null, null, this.currentEmail.backgroundColor),
      tr = mainTable.appendChild(document.createElement('tr')),
      td = tr.appendChild(document.createElement('td'));

    td.width = '100%';
    td.align = 'center';

    // Create all child tables
    let pageTable = this.tableService.createTable(td, this.container, this.pageWidth, this.currentEmail.pageColor);

    // If we have no boxes
    if (!this.container || this.container.boxes.length === 0) {
      tr = pageTable.appendChild(document.createElement('tr')),
        td = tr.appendChild(document.createElement('td'));
      td.height = this.minContainerHeight.toString();
    }

    // If the main table differs from what has been saved
    if (this.currentEmail.body !== mainTable.outerHTML) {
      this.currentEmail.body = mainTable.outerHTML;
      this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
    }
  }


  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index, email) {
    // Set the speed the page expands and collapses
    this.speed = this.defaultSpeed;

    // Collapse the page
    if (input.checked) {
      input.checked = false;
      this.closedContainer = this.container;
      Container.currentContainer = null;

      // Expand the page
    } else {
      this.closedContainer = null;
      this.onEmailClick(email);
      input.checked = true;

      // Create the container for this page
      Container.currentContainer = this.container = new Container(this.viewContainerRefs.toArray()[index], this.page.nativeElement, this.minContainerHeight);
      Container.currentContainer.width = this.pageWidth;

      this.currentToggleButton = input;

      // Load the email
      if (this.currentEmail.body !== '' && (!Container.currentContainer.boxes || Container.currentContainer.boxes.length === 0)) {
        this.loadEmail();
      }

      // Set the container height
      this.container.setHeight();
    }
  }

  loadEmail() {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentEmail.body, "text/html"),
      mainTable: HTMLTableElement = doc.body.firstElementChild as HTMLTableElement,
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement,
      interval: number;

    // Set the colors
    this.currentEmail.backgroundColor = mainTable.bgColor;
    this.currentEmail.pageColor = pageTable.bgColor;


    // Create the boxes
    this.tableService.tableToBox(pageTable, Container.currentContainer);


    // Set the current container as this page when all boxes have loaded
    interval = window.setInterval(() => {
      if (this.tableService.loadedBoxes.every(x => x.isLoaded)) {
        this.tableService.loadedBoxes = [];

        // Set the container
        Container.currentContainer = this.container;

        window.clearInterval(interval);
      }
    }, 1);
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
        this.closedContainer = this.container;
      }
      Container.currentContainer = null;
    }
    this.currentEmail = email;
    email.selected = true;
  }

  deleteEmail() {
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

  delete() {
    if (this.currentEmail && this.currentEmail.selected) {
      this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete this email?', [
        {
          text: 'Yes',
          callback: () => {
            this.deleteEmail();
          }
        },
        {
          text: 'No',
          callback: () => { }
        }
      ]);
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
      if (!this.colorService.showColorPicker) {
        if (this.currentEmail && this.currentEmail.selected) {
          if (this.currentEmail.isInEditMode) {
            this.currentEmail.isInEditMode = false;
          } else if (!EditBoxComponent.currentEditBox || !EditBoxComponent.currentEditBox.isSelected) {
            if (this.currentToggleButton && this.currentToggleButton.checked) {
              this.currentToggleButton.checked = false;
              this.closedContainer = this.container;
              Container.currentContainer = null;
              this.speed = this.defaultSpeed;
            } else {
              this.currentEmail.selected = false;
            }
          } else {
            if (this.menuService.show) {
              this.menuService.show = false;
            } else {
              EditBoxComponent.currentEditBox.unSelect(this.container);
            }
          }
        }
      }

    } else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (this.currentEmail && this.currentEmail.isInEditMode) {
        this.currentEmail.isInEditMode = false;

        if (this.currentEmail.subject !== this.editInput.nativeElement.value && /\w/.test(this.editInput.nativeElement.value)) {
          this.currentEmail.subject = this.editInput.nativeElement.value.trim();
          this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
        }
      }else if(EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected){
        EditBoxComponent.currentEditBox.setEditMode();
      }
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.onMouseMove(event);
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.onMouseUp();
  }

  onMouseDown() {
    if (EditBoxComponent.currentEditBox) EditBoxComponent.currentEditBox.unSelect(this.container);
  }


  editEmail(email) {
    email.isInEditMode = true;
    window.setTimeout(() => {
      this.editInput.nativeElement.focus();
    }, 1);

  }

  newEmail(data?) {
    if ((this.currentItem.tierIndex === 1 && this.currentItem.emails.length === 0) || this.currentItem.tierIndex === 2) {
      // this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
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
      this.onEmailChange();
    }
  }

  transitionEnd(event) {
    if (event.elapsedTime >= this.defaultSpeed) {
      this.speed = 0;
      if (this.closedContainer) {
        this.closedContainer.viewContainerRef.clear();
        this.closedContainer.removeRows();
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
    this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
  }

  cutEmail() {
    if (this.currentEmail && this.currentEmail.selected) {
      this.promptService.prompt('Confirm Cut', 'Are you sure you want to cut this email?', [
        {
          text: 'Yes',
          callback: () => {
            this.copyEmail();
            this.deleteEmail();
          }
        },
        {
          text: 'No',
          callback: () => { }
        }
      ]);
    }
  }

  setColor() {
    if (this.colorService.colorElements[0] === this.page.nativeElement) {
      this.currentEmail.pageColor = this.colorService.newColor;
    } else {
      this.currentEmail.backgroundColor = this.colorService.newColor;
    }

    EditBoxComponent.change.next();
  }

  showColorPicker(element: HTMLElement) {
    let currentColor;
    if (element === this.page.nativeElement) {
      currentColor = this.currentEmail.pageColor;
    } else {
      currentColor = this.currentEmail.backgroundColor;
    }

    this.colorService.openColorPicker([element], 'backgroundColor', currentColor, () => { this.setColor() }, () => { this.cancelColor() });
  }

  cancelColor() {
    this.colorService.colorElements[0].style.background = this.colorService.currentColor;
  }

  getEditBoxType() {
    if (!EditBoxComponent.currentEditBox || !EditBoxComponent.currentEditBox.isSelected) return '';
    return '(' + EditBoxComponent.currentEditBox.type + ')';
  }
}
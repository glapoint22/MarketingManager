import { Component, OnInit, HostListener, ViewContainerRef, ViewChildren, QueryList, ViewChild, ElementRef } from '@angular/core';
import { EditBoxService } from '../edit-box.service';
import { EmailGridComponent } from '../email-grid/email-grid.component';
import { EmailPreviewService } from '../email-preview.service';
import { TableService } from '../table.service';
import { Container } from '../container';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { MenuService } from '../menu.service';
import { ColorService } from '../color.service';

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

  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService, private tableService: TableService, private menuService: MenuService, private colorService: ColorService) { }

  ngOnInit() {
    this.setHeight();

    EditBoxComponent.change.subscribe(() => {
      // Create the main table
      let mainTable = this.tableService.createTable(document.createElement('div'), null, null, this.currentEmail.backgroundColor),
        tr = mainTable.appendChild(document.createElement('tr')),
        td = tr.appendChild(document.createElement('td'));

      td.width = '100%';
      td.align = 'center';

      // Create all child tables
      this.tableService.createTable(td, this.container, this.pageWidth, this.currentEmail.pageColor);

      // If the main table differs from what has been saved
      if (this.currentEmail.body !== mainTable.outerHTML) {
        this.currentEmail.body = mainTable.outerHTML;
        this.emailGridComponent.saveUpdate(this.currentItem, this.emailGridComponent.tiers[this.currentItem.tierIndex]);
      }
    });
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
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement;

    // Set the colors
    this.currentEmail.backgroundColor = mainTable.bgColor;
    this.currentEmail.pageColor = pageTable.bgColor;

    // Create the boxes
    this.tableService.tableToBox(pageTable, Container.currentContainer);

    // Set the current container as this page
    Container.currentContainer = this.container;
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
    if (this.currentEmail && this.currentEmail.selected) {
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
    } else if (event.code === 'Enter' || event.code === 'NumpadEnter') {
      if (this.currentEmail && this.currentEmail.isInEditMode) {
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
  }

  cutEmail() {
    this.copyEmail();
    this.deleteEmail();
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
    if (element === this.page.nativeElement){
      currentColor = this.currentEmail.pageColor;
    }else{
      currentColor = this.currentEmail.backgroundColor;
    }

    this.colorService.openColorPicker([element], 'backgroundColor', currentColor,  () => { this.setColor() });
  }
}
import { Component, OnInit, ViewChildren, ViewChild, ViewContainerRef, QueryList, ElementRef, HostListener } from '@angular/core';
import { Container } from '../container';
import { Subscription } from 'rxjs';
import { EditBoxService } from '../edit-box.service';
import { EmailPreviewService } from '../email-preview.service';
import { TableService } from '../table.service';
import { MenuService } from '../menu.service';
import { ColorService } from '../color.service';
import { PromptService } from '../prompt.service';
import { LinkService } from '../link.service';
import { SaveService } from '../save.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { GridComponent } from '../grid/grid.component';
import { EmailGridComponent } from '../email-grid/email-grid.component';

@Component({
  selector: 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  @ViewChildren('viewContainerRef', { read: ViewContainerRef }) viewContainerRefs: QueryList<ViewContainerRef>;
  @ViewChild(EmailGridComponent) gridComponent: GridComponent;
  @ViewChild('edit') editInput: ElementRef;
  @ViewChild('page') page: ElementRef;
  public height: number;
  public documents: Array<any> = [];
  public pageWidth: number = 600;
  public change: number = 0;
  public currentItem;
  public speed: number;
  public pageLoading: boolean;
  public documentType: string;
  private currentDocument;
  private currentToggleButton;
  private container: Container;
  private closedContainer: Container;
  private defaultSpeed: number = 0.5;
  private copy: any;
  private minContainerHeight: number = 40;
  private changeTimeStamp: number;
  private isTimeOut: boolean;
  private subscription: Subscription;

  constructor(public editBoxService: EditBoxService, public emailPreviewService: EmailPreviewService,
    private tableService: TableService, private menuService: MenuService, private colorService: ColorService,
    private promptService: PromptService, private linkService: LinkService, private saveService: SaveService) { }

  ngOnInit() {
    this.setHeight();

    this.changeTimeStamp = Date.now();
    this.subscription = EditBoxComponent.change.subscribe(() => {
      let currentTime = Date.now(),
        deltaTime = currentTime - this.changeTimeStamp,
        waitTime = 500;

      this.changeTimeStamp = currentTime;

      // Only call onDocumentChange if delta time is greater than wait time
      if (deltaTime < waitTime && !this.isTimeOut) {
        this.isTimeOut = true;
        window.setTimeout(() => {
          this.onDocumentChange();
          this.isTimeOut = false;
        }, waitTime);
      } else {
        if (!this.isTimeOut) this.onDocumentChange();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  onDocumentChange() {
    // Create the main table
    let mainTable = this.tableService.createTable(document.createElement('div'), null, null, this.currentDocument.backgroundColor),
      tr = mainTable.appendChild(document.createElement('tr')),
      td = tr.appendChild(document.createElement('td'));

    td.width = '100%';
    td.align = 'center';

    // Create all child tables
    let pageTable = this.tableService.createTable(td, this.container, this.pageWidth, this.currentDocument.pageColor);

    // If we have no boxes
    if (!this.container || this.container.boxes.length === 0) {
      tr = pageTable.appendChild(document.createElement('tr')),
        td = tr.appendChild(document.createElement('td'));
      td.height = this.minContainerHeight.toString();
    }

    // If the main table differs from what has been saved
    if (this.currentDocument.body !== mainTable.outerHTML) {
      this.gridComponent.saveUpdate(this.currentItem, this.gridComponent.tiers[this.currentItem.tierIndex]);
      this.currentDocument.body = mainTable.outerHTML;
      this.saveService.checkForNoChanges();
    }

  }

  setHeight() {
    this.height = window.innerHeight - 22;
  }

  onToggleButtonClick(input, index, document) {
    if (this.pageLoading) return;

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
      this.onDocumentClick(document);

      // Create the container for this page
      Container.currentContainer = this.container = new Container(this.viewContainerRefs.toArray()[index], this.page.nativeElement, this.minContainerHeight);
      Container.currentContainer.width = this.pageWidth;

      this.currentToggleButton = input;

      // Load the document
      this.loadDocument(input);

      // Set the container height
      this.container.setHeight();
    }
  }

  loadDocument(input) {
    let parser = new DOMParser(),
      doc = parser.parseFromString(this.currentDocument.body, "text/html"),
      mainTable: HTMLTableElement = doc.body.firstElementChild as HTMLTableElement,
      pageTable: HTMLTableElement = mainTable.firstElementChild.firstElementChild.firstElementChild.firstElementChild as HTMLTableElement,
      interval: number;

    // Set the colors
    this.currentDocument.backgroundColor = mainTable.bgColor;
    this.currentDocument.pageColor = pageTable.bgColor;


    // Create the boxes
    this.tableService.tableToBox(pageTable, Container.currentContainer);


    this.pageLoading = true;

    // Set the current container as this page when all boxes have loaded
    interval = window.setInterval(() => {
      if (this.tableService.loadedBoxes.every(x => x.isLoaded)) {
        this.tableService.loadedBoxes = [];

        // Set the container
        Container.currentContainer = this.container;

        input.checked = true;
        this.pageLoading = false;
        window.clearInterval(interval);
      }
    }, 1);
  }

  onItemClick(item) {
    if (item.tierIndex === 0) {
      this.documents = [];
      this.currentItem = null;
      return;
    }
    this.documents = item.documents;
    this.currentItem = item;
  }

  onDocumentClick(document) {
    if (this.currentDocument && this.currentDocument !== document) {
      this.currentDocument.isSelected = false;
      if (this.currentToggleButton) {
        this.speed = this.defaultSpeed;
        this.currentToggleButton.checked = false;
        this.closedContainer = this.container;
      }
      Container.currentContainer = null;
    }
    this.currentDocument = document;
    document.isSelected = true;
  }

  deleteDocument() {
    this.currentDocument.isSelected = false;
    this.change += 1;
    this.gridComponent.saveUpdate(this.currentItem, this.gridComponent.tiers[this.currentItem.tierIndex]);
    this.currentItem.documents.splice(this.currentItem.documents.findIndex(x => x === this.currentDocument), 1);
  }

  delete() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete ' + this.documentType + ' "' + this.currentDocument.subject + '"?', [
        {
          text: 'Yes',
          callback: () => {
            this.deleteDocument();
            this.saveService.checkForNoChanges();
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
      if (!this.colorService.showColorPicker && !this.linkService.show && !this.promptService.show) {
        if (this.currentDocument && this.currentDocument.isSelected) {
          if (this.currentDocument.isInEditMode) {
            this.currentDocument.isInEditMode = false;
          } else if (!EditBoxComponent.currentEditBox || !EditBoxComponent.currentEditBox.isSelected) {
            if (this.currentToggleButton && this.currentToggleButton.checked) {
              this.currentToggleButton.checked = false;
              this.closedContainer = this.container;
              Container.currentContainer = null;
              this.speed = this.defaultSpeed;
            } else {
              this.currentDocument.isSelected = false;
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
      if (this.currentDocument && this.currentDocument.isInEditMode) {
        this.currentDocument.isInEditMode = false;

        if (this.currentDocument.subject !== this.editInput.nativeElement.value && /\w/.test(this.editInput.nativeElement.value)) {
          this.gridComponent.saveUpdate(this.currentItem, this.gridComponent.tiers[this.currentItem.tierIndex]);
          this.currentDocument.subject = this.editInput.nativeElement.value.trim();
          this.saveService.checkForNoChanges();
        }
      } else if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox.isSelected && !this.colorService.showColorPicker
        && !this.linkService.show && !this.promptService.show) {
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


  editDocument(document) {
    document.isInEditMode = true;
    window.setTimeout(() => {
      this.editInput.nativeElement.focus();
    }, 1);

  }

  newDocument(data?) {
    if ((this.currentItem.tierIndex === 1 && this.currentItem.documents.length === 0) || this.currentItem.tierIndex === 2) {
      let id: string = '', index = 0,
        arrays = this.gridComponent.tiers[this.currentItem.tierIndex].items.map(x => x.documents.map(z => z.id)),
        ids = [].concat.apply([], arrays);

      // Create a unique id that is 10 characters long
      while (index > -1 || id.length < 10 || id.length > 10) {
        id = Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase();
        index = ids.findIndex(x => x == id);
      }

      this.gridComponent.saveUpdate(this.currentItem, this.gridComponent.tiers[this.currentItem.tierIndex]);
      let document = this.getNewDocument(data, id);

      this.change += 1;
      this.onDocumentClick(document);
      this.currentDocument = document;
      this.editDocument(document);
      this.saveService.checkForNoChanges();
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

  copyDocument() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      let regex = RegExp(/bgcolor="(#[a-z0-9]+)"/, 'g');

      this.copy = {
        body: this.currentDocument.body,
        subject: this.currentDocument.subject,
        backgroundColor: regex.exec(this.currentDocument.body)[1],
        pageColor: regex.exec(this.currentDocument.body)[1]
      }
    }
  }

  pasteDocument() {
    if (this.copy) this.newDocument(this.copy);
  }

  cutDocument() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      this.promptService.prompt('Confirm Cut', 'Are you sure you want to cut ' + this.documentType + ' "' + this.currentDocument.subject + '"?', [
        {
          text: 'Yes',
          callback: () => {
            this.copyDocument();
            this.deleteDocument();
            this.saveService.checkForNoChanges();
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
      this.currentDocument.pageColor = this.colorService.newColor;
    } else {
      this.currentDocument.backgroundColor = this.colorService.newColor;
    }

    EditBoxComponent.change.next();
  }

  showColorPicker(element: HTMLElement) {
    let currentColor;
    if (element === this.page.nativeElement) {
      currentColor = this.currentDocument.pageColor;
    } else {
      currentColor = this.currentDocument.backgroundColor;
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

  getNewDocument(data, id) { }
}

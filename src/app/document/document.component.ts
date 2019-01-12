import { Component, OnInit, ViewChildren, ViewChild, ViewContainerRef, QueryList, ElementRef, HostListener, Input } from '@angular/core';
import { Container } from '../container';
import { Subscription } from 'rxjs';
import { EditBoxService } from '../edit-box.service';
import { DocumentPreviewService } from '../document-preview.service';
import { MenuService } from '../menu.service';
import { ColorService } from '../color.service';
import { PromptService } from '../prompt.service';
import { LinkService } from '../link.service';
import { SaveService } from '../save.service';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  @ViewChildren('viewContainerRef', { read: ViewContainerRef }) viewContainerRefs: QueryList<ViewContainerRef>;
  @ViewChild('edit') editInput: ElementRef;
  @ViewChild('page') page: ElementRef;
  @Input() grid: GridComponent;
  public height: number;
  public documents: Array<any> = [];
  public pageWidth: number;
  public change: number = 0;
  public currentItem;
  public speed: number;
  public pageLoading: boolean;
  public documentType: string;
  public defaultDocumnetColor: string = '#ffffff';
  public container: Container;
  public minContainerHeight: number = 40;
  public currentDocument;
  public copy: any;
  public newDocumentIcon: string;
  private currentToggleButton;
  private closedContainer: Container;
  private defaultSpeed: number = 0.5;
  private changeTimeStamp: number;
  private isTimeOut: boolean;
  private subscription: Subscription;

  constructor(public editBoxService: EditBoxService, public documentPreviewService: DocumentPreviewService,
    private menuService: MenuService, public colorService: ColorService,
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
    let documentBody = this.createDocumentBody(this.currentDocument.backgroundColor, this.currentDocument.pageColor);

    // If the new document body differs from what has been saved
    if (this.currentDocument.body !== documentBody) {
      this.grid.saveUpdate(this.currentItem, this.grid.tiers[this.currentItem.tierIndex]);
      this.currentDocument.body = documentBody;
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
      EditBoxComponent.currentEditBox = null;
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
    let interval: number;

    this.pageLoading = true;

    // Set the current container as this page when all boxes have loaded
    interval = window.setInterval(() => {
      if (this.editBoxService.loadedBoxes.every(x => x.isLoaded)) {
        this.editBoxService.loadedBoxes = [];

        // Set the container
        Container.currentContainer = this.container;

        input.checked = true;
        this.pageLoading = false;
        window.clearInterval(interval);
      }
    }, 1);
  }

  onItemClick(item) {
    EditBoxComponent.currentEditBox = null;
    if (item.tierIndex === 0) {
      this.documents = [];
      this.currentItem = null;
      return;
    }
    this.documents = item.documents;
    this.currentItem = item;
    if (this.currentDocument) this.currentDocument.isSelected = false;
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
    this.grid.saveUpdate(this.currentItem, this.grid.tiers[this.currentItem.tierIndex]);
    this.currentItem.documents.splice(this.currentItem.documents.findIndex(x => x === this.currentDocument), 1);
  }

  delete() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete ' + this.documentType + ' "' + this.currentDocument.title + '"?', [
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

        if (this.currentDocument.title !== this.editInput.nativeElement.value && /\w/.test(this.editInput.nativeElement.value)) {
          this.grid.saveUpdate(this.currentItem, this.grid.tiers[this.currentItem.tierIndex]);
          this.currentDocument.title = this.editInput.nativeElement.value.trim();
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
        arrays = this.grid.tiers[this.currentItem.tierIndex].items.map(x => x.documents.map(z => z.id)),
        ids = [].concat.apply([], arrays);

      // Create a unique id that is 10 characters long
      while (index > -1 || id.length < 10 || id.length > 10) {
        id = Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase();
        index = ids.findIndex(x => x == id);
      }

      this.grid.saveUpdate(this.currentItem, this.grid.tiers[this.currentItem.tierIndex]);
      this.container = null;
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


  pasteDocument() {
    if (this.copy) this.newDocument(this.copy);
  }

  cutDocument() {
    if (this.currentDocument && this.currentDocument.isSelected) {
      this.promptService.prompt('Confirm Cut', 'Are you sure you want to cut ' + this.documentType + ' "' + this.currentDocument.title + '"?', [
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

  getRect(data: string, index: number, rect: Array<number> = []) {
    let nextIndex = data.indexOf('-', index);
    if (nextIndex === -1) nextIndex = data.length;

    rect.push(parseFloat(data.substr(index, nextIndex - index)));
    if (nextIndex === data.length) return rect;
    return this.getRect(data, nextIndex + 1, rect);
  }

  onCollapsedTier() {
    if (EditBoxComponent) EditBoxComponent.currentEditBox = null;
  }

  getNewDocument(data, id) { }

  createDocumentBody(backgroundColor: string, pageColor: string) { }

  copyDocument() { }
}
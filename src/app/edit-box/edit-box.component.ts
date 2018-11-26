import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { Vector2 } from "../vector2";
import { Rect } from '../rect';
import { Style } from '../style';
import { EditBoxManagerService } from '../edit-box-manager.service';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;

  constructor(public app: ApplicationRef, public editBoxManagerService: EditBoxManagerService) { }

  private isMousedown: boolean;
  private currentPosition: Vector2;
  private parentElement: HTMLElement;
  private containerWidth: number;
  private containerHeight: number;
  public showTopLeftHandle: boolean;
  public showTopHandle: boolean;
  public showTopRightHandle: boolean;
  public showLeftHandle: boolean;
  public showRightHandle: boolean;
  public showBottomLeftHandle: boolean;
  public showBottomHandle: boolean;
  public showBottomRightHandle: boolean;
  public rect: Rect;
  public handle: string;
  public parentContainer: any;
  public inEditMode: boolean;
  public content: any;
  public isSelected: boolean;
  public styles: Array<Style>;
  public contentContainer;
  public link: string;
  public backgroundColor: string;
  public isLoaded: boolean = false;
  public row;

  ngOnInit() {
    this.editBox.nativeElement.focus();
  }

  onMouseDown(event, handle) {
    event.preventDefault();
    this.editBoxManagerService.currentContainer.currentRow = this.row;
    if (event.button === 0) {
      this.isMousedown = true;
      this.handle = handle;
      this.currentPosition = new Vector2(event.clientX, event.clientY);
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaPosition = new Vector2(event.clientX - this.currentPosition.x, event.clientY - this.currentPosition.y);
      this.currentPosition = new Vector2(event.clientX, event.clientY);

      switch (this.handle) {
        case 'center':
          this.setCenterHandle(deltaPosition);
          break;
        case 'right':
          this.setRightHandle(deltaPosition);
          break;
        case 'left':
          this.setLeftHandle(deltaPosition);
          break;
        case 'bottom':
          this.setBottomHandle(deltaPosition);
          break;
        case 'top':
          this.setTopHandle(deltaPosition);
          break;
        case 'topLeft':
          this.setTopLeftHandle(deltaPosition);
          break;
        case 'topRight':
          this.setTopRightHandle(deltaPosition);
          break;
        case 'bottomLeft':
          this.setBottomLeftHandle(deltaPosition);
          break;
        case 'bottomRight':
          this.setBottomRightHandle(deltaPosition);
          break;
      }
      this.editBoxManagerService.setContainerHeight(this.parentContainer);
    }
  }

  setCenterHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y + deltaPosition.y, this.rect.width, this.rect.height);
    });
  }

  setRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width + deltaPosition.x, this.rect.height);
    });
  }

  setLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y, this.rect.width - deltaPosition.x, this.rect.height);
    });
  }

  setBottomHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height + deltaPosition.y);
    });
  }

  setTopHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y + deltaPosition.y, this.rect.width, this.rect.height - deltaPosition.y);
    });
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y + deltaPosition.y, this.rect.width - deltaPosition.x, this.rect.height - deltaPosition.y);
    });
  }


  setTopRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y + deltaPosition.y, this.rect.width + deltaPosition.x, this.rect.height - deltaPosition.y);
    });
  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y, this.rect.width - deltaPosition.x, this.rect.height + deltaPosition.y);
    });
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width + deltaPosition.x, this.rect.height + deltaPosition.y);
    });
  }

  onMouseUp(event: MouseEvent) {
    if (this.isMousedown) this.editBoxManagerService.change.next();
    this.isMousedown = false;
  }

  setVisibleHandles(showLeftTopHandle, showTopHandle, showRightTopHandle, showLeftHandle, showRightHandle, showBottomLeftHandle, showBottomHandle, showBottomRightHandle) {
    this.showTopLeftHandle = showLeftTopHandle;
    this.showTopHandle = showTopHandle;
    this.showTopRightHandle = showRightTopHandle;
    this.showLeftHandle = showLeftHandle;
    this.showRightHandle = showRightHandle;
    this.showBottomLeftHandle = showBottomLeftHandle;
    this.showBottomHandle = showBottomHandle;
    this.showBottomRightHandle = showBottomRightHandle;
  }

  setElement() {
    this.editBox.nativeElement.style.left = this.rect.x + 'px';
    this.editBox.nativeElement.style.top = this.rect.y + 'px';
    this.editBox.nativeElement.style.width = this.rect.width + 'px';
    this.editBox.nativeElement.style.height = this.rect.height + 'px';
  }

  setRect(action, response?) {
    let tempRect: Rect = action(), direction: Vector2 = tempRect.center.subtract(this.rect.center);
    // containerWidth = this.parentContainer.element.nativeElement.parentElement.clientWidth,
    // containerHeight = this.parentContainer.element.nativeElement.parentElement.clientHeight;

    // Test rect against container
    if (tempRect.x < 0) {
      this.setRightCollision(tempRect, new Rect(0, 0, 0, 0));
      if (response) tempRect = response();
    }
    if (tempRect.xMax > this.containerWidth) {
      this.setLeftCollision(tempRect, new Rect(this.containerWidth, 0, 0, 0));
      if (response) tempRect = response();
    }
    if (tempRect.y < 0) {
      this.setBottomCollision(tempRect, new Rect(0, 0, 0, 0));
      if (response) tempRect = response();
    }
    if (this.parentContainer.injector.view.component.rect) {
      if (tempRect.yMax > this.containerHeight) {
        if (this.parentContainer.injector.view.component.parentContainer.boxes.some(x => x.rect.y === this.parentContainer.injector.view.component.rect.yMax)) {
          this.setTopCollision(tempRect, new Rect(0, this.containerHeight, 0, 0));
        }
      }
    }


    // Test rect against other rects
    for (let i = 0; i < this.parentContainer.boxes.length; i++) {
      let otherRect = this.parentContainer.boxes[i].rect;

      if (otherRect && this.rect !== otherRect) {
        if (+(tempRect.xMax.toFixed(2)) > +(otherRect.x.toFixed(2)) && +(tempRect.x.toFixed(2)) < +(otherRect.xMax.toFixed(2)) &&
          +(tempRect.yMax.toFixed(2)) > +(otherRect.y.toFixed(2)) && +(tempRect.y.toFixed(2)) < +(otherRect.yMax.toFixed(2))) {

          if (direction.y > 0) {
            if (+(this.rect.yMax.toFixed(2)) <= +(otherRect.y.toFixed(2))) {
              // Top of other rect
              this.setTopCollision(tempRect, otherRect);
              if (response) tempRect = response(tempRect);
              continue;
            }
          } else {
            if (+(this.rect.y.toFixed(2)) >= +(otherRect.yMax.toFixed(2))) {
              // Bottom of other rect
              this.setBottomCollision(tempRect, otherRect);
              if (response) tempRect = response(tempRect);
              continue;
            }
          }

          if (direction.x > 0) {
            // Left of other rect
            this.setLeftCollision(tempRect, otherRect);
            if (response) tempRect = response(tempRect);
          } else {
            // Right of other rect
            this.setRightCollision(tempRect, otherRect);
            if (response) tempRect = response(tempRect);
          }
        }
      }
    }
    this.rect = tempRect;
    this.setElement();
  }

  setTopCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.y = otherRect.y - this.rect.height;
    } else {
      tempRect.yMax = otherRect.y;
    }
  }

  setBottomCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.y = otherRect.yMax;
    } else {
      let diff = otherRect.yMax - tempRect.y;
      tempRect.y = otherRect.yMax;
      tempRect.height -= diff;
    }
  }

  setLeftCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.x = otherRect.x - this.rect.width;
    } else {
      tempRect.xMax = otherRect.x;
    }
  }

  setRightCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.x = otherRect.xMax;
    } else {
      let diff = otherRect.xMax - tempRect.x;
      tempRect.x = otherRect.xMax;
      tempRect.width -= diff;
    }
  }

  setSelection() {
    this.isSelected = true;
    if (this.editBoxManagerService.currentEditBox && this.editBoxManagerService.currentEditBox !== this) {
      this.editBoxManagerService.currentEditBox.isSelected = false;
      if (this.editBoxManagerService.currentEditBox.inEditMode && this.editBoxManagerService.currentEditBox.content) {
        this.editBoxManagerService.currentEditBox.inEditMode = false;
        this.editBoxManagerService.currentEditBox.content.setAttribute('contenteditable', 'false');
        this.editBoxManagerService.currentEditBox.content.style.setProperty('cursor', '');
        this.editBoxManagerService.currentEditBox.content.ownerDocument.getSelection().empty();
      }
    }
    this.editBoxManagerService.currentEditBox = this;
    this.setCurrentContainer();
  }

  setCurrentContainer() {
    this.editBoxManagerService.currentContainer = this.parentContainer;
  }


  setEditMode() {
    if (this.content) {
      this.content.setAttribute('contenteditable', 'true');

      let selection = this.content.ownerDocument.getSelection(),
        node: any = this.content,
        firstChild = this.getChild(node.firstChild),
        lastChild = this.getChild(node.lastChild.lastChild);

      selection.setBaseAndExtent(firstChild, 0, lastChild, lastChild.length);
      this.content.style.setProperty('cursor', 'text');
      this.inEditMode = true;
      this.content.focus();
      this.checkSelectionForStyles();
    }

  }

  getChild(parent) {
    let node = parent;

    while (node.nodeType !== 3 && node.tagName !== 'BR') {
      node = node.firstChild;
    }

    return node;
  }

  getBox(boxes: Array<EditBoxComponent>, box: EditBoxComponent) {
    return boxes.find(x => x.rect === box.rect);
  }

  initialize(rect?: Rect, isSelected?: boolean) {
    // Initialize the container properties
    this.parentElement = this.parentContainer.element.nativeElement.parentElement;
    this.containerWidth = this.parentElement.clientWidth;
    this.containerHeight = this.parentElement.clientHeight;

    if (rect.x === null) {
      let x: number, y: number;
      // If there are no rows for this container
      if (!this.parentContainer.rows) this.parentContainer.rows = [];

      // If this editBox is being inserted
      if (this.editBoxManagerService.insertType) {

        // Insert type is left or right
        if (this.editBoxManagerService.insertType === 'left' || this.editBoxManagerService.insertType === 'right') {
          // Sort the boxes horizontally
          let sortedBoxes = this.parentContainer.currentRow.boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
            if (a.rect.x > b.rect.x) return 1;
            return -1;
          });

          // Align left
          if (this.parentContainer.currentRow.align === 'left') {
            if (this.editBoxManagerService.insertType === 'left') {
              x = this.editBoxManagerService.currentEditBox.rect.x;
            } else if (this.editBoxManagerService.insertType === 'right') {
              x = this.editBoxManagerService.currentEditBox.rect.xMax;
            }

            for (let i = sortedBoxes.length - 1; i > -1; i--) {
              if (sortedBoxes[i].rect.x >= x) {
                let box = this.getBox(this.parentContainer.currentRow.boxes, sortedBoxes[i]);
                box.rect.x = box.rect.x + rect.width;
                box.setElement();
              }
            }

            // Align center
          } else if (this.parentContainer.currentRow.align === 'center') {
            let boxesWidth = rect.width;
            this.parentContainer.currentRow.boxes.forEach(box => {
              boxesWidth += box.rect.width;
            });
            let currentX = (this.containerWidth * 0.5) - (boxesWidth * 0.5);

            for (let i = 0; i < sortedBoxes.length; i++) {
              let box = this.getBox(this.parentContainer.currentRow.boxes, sortedBoxes[i]);

              if (box === this.editBoxManagerService.currentEditBox) {
                if (this.editBoxManagerService.insertType === 'left') {
                  x = currentX;
                  currentX = rect.width + currentX;

                  box.rect.x = currentX;
                  currentX = box.rect.width + currentX;
                } else {
                  box.rect.x = currentX;
                  currentX = box.rect.width + currentX;

                  x = currentX;
                  currentX = rect.width + currentX;
                }

              } else {
                box.rect.x = currentX;
                currentX = box.rect.width + currentX;
              }

              box.setElement();

            }

            // Align right
          } else if (this.parentContainer.currentRow.align === 'right') {
            if (this.editBoxManagerService.insertType === 'left') {
              x = this.editBoxManagerService.currentEditBox.rect.x - rect.width;
            } else if (this.editBoxManagerService.insertType === 'right') {
              x = this.editBoxManagerService.currentEditBox.rect.xMax - rect.width;
            }

            for (let i = 0; i < sortedBoxes.length; i++) {
              if (sortedBoxes[i].rect.xMax <= x + rect.width) {
                let box = this.getBox(this.parentContainer.currentRow.boxes, sortedBoxes[i]);
                box.rect.x = box.rect.x - rect.width;
                box.setElement();
              }
            }
          }

          // Check to see if the ymax has changed. If so, move rows down
          let yMax = Math.max(this.parentContainer.currentRow.yMax, this.parentContainer.currentRow.y + rect.yMax);
          if(yMax > this.parentContainer.currentRow.yMax){
            this.parentContainer.currentRow.yMax = yMax;
            let startIndex = this.parentContainer.rows.findIndex(x => x === this.parentContainer.currentRow) + 1;
            this.moveRowsDown(startIndex);
          }

          // Insert type is top or bottom
        } else {
          // Get the new inserted row index
          let insertedRowIndex = this.parentContainer.rows.findIndex(x => x === this.parentContainer.currentRow) + (this.editBoxManagerService.insertType === 'bottom' ? 1 : 0);

          // Insert the new row
          this.parentContainer.rows.splice(insertedRowIndex, 0, {
            boxes: [],
            align: 'center',
            y: this.editBoxManagerService.insertType === 'bottom' ? this.parentContainer.currentRow.yMax : this.parentContainer.currentRow.y,
            yMax: this.editBoxManagerService.insertType === 'bottom' ? this.parentContainer.currentRow.yMax + rect.height : this.parentContainer.currentRow.y + rect.height
          });
          this.parentContainer.currentRow = this.parentContainer.rows[insertedRowIndex];

          this.moveRowsDown(insertedRowIndex + 1);

          // Set the new x
          x = (this.containerWidth * 0.5) - (rect.width * 0.5);
        }
        // Set the new y
        y = this.parentContainer.currentRow.y;
        this.editBoxManagerService.insertType = null;
      } else {
        x = (this.containerWidth * 0.5) - (rect.width * 0.5);
        y = this.parentContainer.boxes && this.parentContainer.boxes.length > 0 ? Math.max(...this.parentContainer.boxes.map(x => x.rect ? x.rect.yMax : 0)) : 0;

        this.parentContainer.rows.push({
          boxes: [],
          align: 'center',
          y: y,
          yMax: rect.yMax + y
        });
        this.parentContainer.currentRow = this.parentContainer.rows[this.parentContainer.rows.length - 1];
      }

      this.rect = new Rect(x, y, rect.width, rect.height);
      this.parentContainer.currentRow.boxes.push(this);
      this.row = this.parentContainer.currentRow;

    } else {
      this.rect = rect;
    }

    this.setElement();

    if (isSelected) this.setSelection();
    this.isLoaded = true;
  }

  moveRowsDown(startIndex){
    // Loop through all the rows and see if we need to move them down
    for (let i = startIndex; i < this.parentContainer.rows.length; i++) {
      let currentRow = this.parentContainer.rows[i],
        previousRow = this.parentContainer.rows[i - 1];

      // Test to see if we need to move this current row down
      if (currentRow.y < previousRow.yMax) {
        // Set the new y for the row
        currentRow.y = previousRow.yMax;

        // Move all the boxes in this row
        for (let j = 0; j < currentRow.boxes.length; j++) {
          let box = currentRow.boxes[j];
          box.rect.y = currentRow.y;
          box.setElement();
        }

        // Set the new ymax
        currentRow.yMax = Math.max(...currentRow.boxes.map(x => x.rect.yMax));

      } else {
        break;
      }
    }
  }


  unSelect() {
    if (this.content && this.inEditMode) {
      this.inEditMode = false;
      this.content.ownerDocument.getSelection().empty();
      this.content.setAttribute('contenteditable', 'false');
      this.content.style.setProperty('cursor', '');
      this.styles.forEach(x => x.setSelectedFalse());
      this.app.tick();
      this.editBox.nativeElement.focus();
    } else {
      this.isSelected = false;
      this.editBoxManagerService.currentContainer = this.editBoxManagerService.mainContainer;
    }
  }

  checkSelectionForStyles() {
    window.setTimeout(() => {
      Style.setSelection(this.content);
      this.styles.forEach(x => x.checkSelection());
      this.app.tick();
    }, 1);
  }

  onContentChange() {
    this.editBoxManagerService.change.next();
  }
  boxToTable(table: HTMLTableElement) { }

  getTableRect(boxType) {
    return boxType + '-' + this.rect.x + '-' + this.rect.y + '-' + this.rect.width + '-' + this.rect.height;
  }
}
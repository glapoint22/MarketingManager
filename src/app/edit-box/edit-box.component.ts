import { Component, ViewChild, ElementRef, ApplicationRef } from '@angular/core';
import { Vector2 } from "../vector2";
import { Rect } from '../rect';
import { Style } from '../style';
import { Container } from '../container';
import { Row } from '../row';
import { BoxContainer } from '../box-container';
import { MenuService } from '../menu.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;

  constructor(public app: ApplicationRef, public menuService: MenuService) { }

  private isMousedown: boolean;
  private currentPosition: Vector2;
  private tempRect: Rect;
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
  public container: Container;
  public inEditMode: boolean;
  public content: any;
  public isSelected: boolean;
  public styles: Array<Style>;
  public contentContainer;
  public link: string;
  public backgroundColor: string;
  public isLoaded: boolean = false;
  public row: Row;
  public spawnPosition: string;

  // Static
  public static currentEditBox: EditBoxComponent;
  public static change = new Subject<void>();

  ngOnInit() {
    this.editBox.nativeElement.focus();
  }

  initialize(rect?: Rect, isSelected?: boolean) {
    if (rect.x === null) {
      let x: number, y: number;

      // If this editBox has a spawn position
      if (this.spawnPosition) {

        // spawn position is left or right
        if (this.spawnPosition === 'left' || this.spawnPosition === 'right') {

          // Align left
          if (this.container.currentRow.alignment === 'left') {
            x = this.spawnPosition === 'left' ? EditBoxComponent.currentEditBox.rect.x : EditBoxComponent.currentEditBox.rect.xMax;
            this.container.currentRow.shiftBoxesRightAtPoint(x, rect.width);

            // Align center
          } else if (this.container.currentRow.alignment === 'center') {
            let boxesWidth = this.container.currentRow.getBoxesWidth() + rect.width,
              currentX = this.container.currentRow.getCenterX(boxesWidth),
              sortedBoxes = this.container.currentRow.sortBoxes();

            // Loop through the boxes and set their x's center
            for (let i = 0; i < sortedBoxes.length; i++) {
              let box = this.container.currentRow.getBox(sortedBoxes[i]);

              // Box is current selected box
              if (box === EditBoxComponent.currentEditBox) {
                // Spawn position is left
                if (this.spawnPosition === 'left') {
                  x = currentX;
                  currentX += rect.width;

                  box.rect.x = currentX;
                  currentX += box.rect.width;

                  // Insert type is right
                } else {
                  box.rect.x = currentX;
                  currentX += box.rect.width;

                  x = currentX;
                  currentX += rect.width;
                }

                // box is other box in the row
              } else {
                box.rect.x = currentX;
                currentX += box.rect.width;
              }

              box.setElement();
            }

            // Align right
          } else if (this.container.currentRow.alignment === 'right') {
            x = this.spawnPosition === 'left' ? EditBoxComponent.currentEditBox.rect.x - rect.width : EditBoxComponent.currentEditBox.rect.xMax - rect.width;
            this.container.currentRow.shiftBoxesLeftAtPoint(x, rect.width);
          }

          // Check to see if the ymax has changed. If so, move rows down
          let yMax = Math.max(this.container.currentRow.yMax, this.container.currentRow.y + rect.yMax);
          if (yMax > this.container.currentRow.yMax) {
            this.container.currentRow.yMax = yMax;
            let startingRowIndex = this.container.getRowIndex(this.container.currentRow) + 1;
            this.container.moveRowsDown(startingRowIndex);
          }

          // Insert type is top or bottom
        } else {
          // Get the new inserted row index
          let insertedRowIndex = this.container.rows.findIndex(x => x === this.container.currentRow) + (this.spawnPosition === 'bottom' ? 1 : 0),
            yPos: number, yMax: number;

            // Spawn position is bottom
          if (this.spawnPosition === 'bottom') {
            yPos = this.container.currentRow.yMax;
            yMax = this.container.currentRow.yMax + rect.height;

            // Insert type is top
          } else {
            yPos = this.container.currentRow.y - rect.height;

            // If top row, make sure yPos is not less than zero
            if (insertedRowIndex === 0) {
              yPos = Math.max(yPos, 0);

              // Make sure yPos is not less than its top row's yMax
            } else {
              if (yPos < this.container.rows[insertedRowIndex - 1].yMax) {
                yPos = this.container.rows[insertedRowIndex - 1].yMax;
              }
            }

            // Set the new yMax
            yMax = yPos + rect.height;
          }

          // Create the new row
          this.container.currentRow = this.container.addRow('center', yPos);
          this.container.currentRow.yMax = yMax;

          // Move other rows down
          this.container.moveRowsDown(insertedRowIndex + 1);

          // Set the new x
          x = (this.container.width * 0.5) - (rect.width * 0.5);
        }
        // Set the new y
        y = this.container.currentRow.y;

        // New box does not have a spawn position so spawn it at the bottom of the container
      } else {
        x = (this.container.width * 0.5) - (rect.width * 0.5);
        y = this.container.boxes && this.container.boxes.length > 0 ? Math.max(...this.container.boxes.map(x => x.rect ? x.rect.yMax : 0)) : 0;

        this.container.currentRow = this.container.addRow('center', y);
      }
      // Set the new rect
      this.rect = new Rect(x, y, rect.width, rect.height);
      
      // Add this new box to the row
      this.container.currentRow.addBox(this);

    } else {
      this.rect = rect;
    }

    this.setCurrentContainer();
    this.setElement();

    if (isSelected) this.setSelection();
    this.isLoaded = true;
  }

  onMouseDown(event, handle) {
    event.preventDefault();
    this.container.currentRow = this.row;
    this.tempRect = new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
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
      this.container.setHeight();
    }
  }

  onMouseUp() {
    if (this.isMousedown) {
      let rowFound: boolean = false;

      if (this.rect.x !== this.tempRect.x || this.rect.y !== this.tempRect.y || this.rect.width !== this.tempRect.width || this.rect.height !== this.tempRect.height) {
        for (let i = 0; i < this.container.rows.length; i++) {
          let row = this.container.rows[i];

          if (this.rect.y >= row.y && this.rect.y < row.yMax) {
            // box is in its current row
            if (row === this.row) {
              rowFound = true;
              this.rect.y = row.y;
              this.row.setYMax();
              break;

              // Box is in another row
            } else {
              let rowIndex = this.container.getRowIndex(this.row);

              rowFound = true;

              // Remove this box from its current row
              this.row.removeBox(this);

              if (this.row.boxes.length === 0) {
                // No boxes in this row so remove the row
                this.container.removeRow(this.row);
              } else {
                // Reset this row's yMax and re-align
                this.row.setYMax();
                this.row.alignBoxes();
              }

              // Add the box to this row
              this.container.currentRow = row;
              this.rect.y = this.container.currentRow.y;
              this.container.currentRow.addBox(this);
              
              // Move other rows down
              if (rowIndex > 0) this.container.moveRowsDown(rowIndex);
              break;
            }
          }
        }
        // Box is not in an existing row
        if (!rowFound) {
          // Remove this box from its current row
          this.row.removeBox(this);

          if (this.row.boxes.length === 0) {
            // No boxes in this row so remove the row
            this.container.removeRow(this.row);
          } else {
            // Reset this row's yMax and re-align
            this.row.setYMax();
            this.row.alignBoxes();
          }

          // Create a new row and add this box to it
          this.container.currentRow = this.container.addRow('center', this.rect.y);
          this.container.currentRow.addBox(this);
          let rowIndex = this.container.getRowIndex(this.container.currentRow);
          this.container.moveRowsDown(rowIndex + 1);
        }

        // Align the boxes in the current row and set the container height
        this.container.currentRow.alignBoxes();
        this.container.setHeight();

        // Mark that there has been a change
        EditBoxComponent.change.next();
      }
      this.isMousedown = false;
    }
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


  setElement() {
    this.editBox.nativeElement.style.left = this.rect.x + 'px';
    this.editBox.nativeElement.style.top = this.rect.y + 'px';
    this.editBox.nativeElement.style.width = this.rect.width + 'px';
    this.editBox.nativeElement.style.height = this.rect.height + 'px';
  }

  setRect(action, response?) {
    let rect: Rect = action(), direction: Vector2 = rect.center.subtract(this.rect.center);

    // Test rect against container
    if (rect.x < 0) {
      this.setRightCollision(rect, new Rect(0, 0, 0, 0));
      if (response) rect = response();
    }
    if (rect.xMax > this.container.width) {
      this.setLeftCollision(rect, new Rect(this.container.width, 0, 0, 0));
      if (response) rect = response();
    }
    if (rect.y < 0) {
      this.setBottomCollision(rect, new Rect(0, 0, 0, 0));
      if (response) rect = response();
    }
    if (this.container instanceof BoxContainer) {
      let boxContainer: BoxContainer = this.container as BoxContainer;

      if (rect.yMax > boxContainer.height) {
        if (boxContainer.containerBox.container.boxes.some(x => x.rect.y === boxContainer.containerBox.rect.yMax)) {
          this.setTopCollision(rect, new Rect(0, boxContainer.height, 0, 0));
        }
      }
    }


    // Test rect against other rects
    for (let i = 0; i < this.container.boxes.length; i++) {
      let otherRect = this.container.boxes[i].rect;

      if (otherRect && this.rect !== otherRect) {
        if (+(rect.xMax.toFixed(2)) > +(otherRect.x.toFixed(2)) && +(rect.x.toFixed(2)) < +(otherRect.xMax.toFixed(2)) &&
          +(rect.yMax.toFixed(2)) > +(otherRect.y.toFixed(2)) && +(rect.y.toFixed(2)) < +(otherRect.yMax.toFixed(2))) {

          if (direction.y > 0) {
            if (+(this.rect.yMax.toFixed(2)) <= +(otherRect.y.toFixed(2))) {
              // Top of other rect
              this.setTopCollision(rect, otherRect);
              if (response) rect = response(rect);
              continue;
            }
          } else {
            if (+(this.rect.y.toFixed(2)) >= +(otherRect.yMax.toFixed(2))) {
              // Bottom of other rect
              this.setBottomCollision(rect, otherRect);
              if (response) rect = response(rect);
              continue;
            }
          }

          if (direction.x > 0) {
            // Left of other rect
            this.setLeftCollision(rect, otherRect);
            if (response) rect = response(rect);
          } else {
            // Right of other rect
            this.setRightCollision(rect, otherRect);
            if (response) rect = response(rect);
          }
        }
      }
    }
    this.rect = rect;
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
    if (EditBoxComponent.currentEditBox && EditBoxComponent.currentEditBox !== this) {
      EditBoxComponent.currentEditBox.isSelected = false;
      if (EditBoxComponent.currentEditBox.inEditMode && EditBoxComponent.currentEditBox.content) {
        EditBoxComponent.currentEditBox.inEditMode = false;
        EditBoxComponent.currentEditBox.content.setAttribute('contenteditable', 'false');
        EditBoxComponent.currentEditBox.content.style.setProperty('cursor', '');
        EditBoxComponent.currentEditBox.content.ownerDocument.getSelection().empty();
      }
    }
    EditBoxComponent.currentEditBox = this;
    this.setCurrentContainer();
  }

  setCurrentContainer() {
    Container.currentContainer = this.container;
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


  unSelect(container?: Container) {
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
      Container.currentContainer = container;
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
    EditBoxComponent.change.next();
  }
  boxToTable(table: HTMLTableElement) { }

  getTableRect(boxType) {
    return boxType + '-' + this.rect.x + '-' + this.rect.y + '-' + this.rect.width + '-' + this.rect.height;
  }
}
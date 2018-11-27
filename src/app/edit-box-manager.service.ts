import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Rect } from './rect';
import { EditBoxComponent } from './edit-box/edit-box.component';

@Injectable({
  providedIn: 'root'
})
export class EditBoxManagerService {
  public currentEditBox: EditBoxComponent;
  public currentContainer: any;
  public mainContainer: any;
  public change = new Subject<void>();
  public minContainerHeight: number;
  public insertType: string = null;
  public showMenu: boolean;
  public menuLeft: number;
  public menuTop: number;

  constructor() { }

  setContainerHeight(container) {
    // If container has any boxes
    if (container.boxes && container.boxes.length > 0) {

      // If every box has a rect
      if (container.boxes.every(x => x.rect)) {

        // Container box
        if (container.injector.view.component.rect) {
          let yMax = Math.max(...container.boxes.map(x => x.rect.yMax));
          let rect = container.injector.view.component.rect;

          container.injector.view.component.handle = '';
          container.injector.view.component.setRect(() => {
            return new Rect(rect.x, rect.y, rect.width, Math.max(container.injector.view.component.fixedHeight, yMax));
          });
          this.setContainerHeight(container.injector.view.component.parentContainer);

          // Main container
        } else {
          container.height = Math.max(...container.boxes.map(x => x.rect.yMax));
        }

        // Wait until all boxes have their rects
      } else {
        container.height = this.minContainerHeight;
        let interval = window.setInterval(() => {
          if (container.boxes.every(x => x.rect)) {
            this.setContainerHeight(container);
            window.clearInterval(interval);
          }
        }, 1);
      }

      // Container has no boxes
    } else {
      if (container.injector.view.component.rect) {
        // Set parent container height
        this.setContainerHeight(container.injector.view.component.parentContainer);
      } else {
        // Set the default container height
        container.height = this.minContainerHeight;
      }
    }
  }

  setMenu(event) {
    event.preventDefault();
    this.menuLeft = event.clientX;
    this.menuTop = event.clientY;
    this.showMenu = true;
  }

  getBox(boxes: Array<EditBoxComponent>, box: EditBoxComponent): EditBoxComponent {
    return boxes.find(x => x.rect === box.rect);
  }

  sortBoxes(boxes): Array<EditBoxComponent> {
    let sortedBoxes = boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.x > b.rect.x) return 1;
      return -1;
    });

    return sortedBoxes;
  }

  sortRows(rows){
    let sortedRows = rows.sort((a, b) => {
      if (a.y > b.y) return 1;
      return -1;
    });

    return sortedRows;
  }

  alignBoxes(row){
    switch (row.align) {
      case 'left':
        this.alignBoxesLeft(row.boxes);
        break;
      case 'center':
        this.alignBoxesCenter(row.boxes);
        break;
      case 'right':
        this.alignBoxesRight(row.boxes);
        break;
    }
  }

  alignBoxesLeft(boxes: Array<EditBoxComponent>) {
    let sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(boxes),
      currentX: number = 0;

    // Align the boxes left
    sortedBoxes.forEach((sortedBox: EditBoxComponent) => {
      let box: EditBoxComponent = this.getBox(boxes, sortedBox);
      box.rect.x = currentX;
      box.setElement();
      currentX = box.rect.xMax;
    });
  }

  alignBoxesCenter(boxes: Array<EditBoxComponent>) {
    let boxesWidth: number = 0,
      sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(boxes),
      currentX: number;

    // Get the combined width from all the boxes
    sortedBoxes.forEach((box: EditBoxComponent) => {
      boxesWidth += box.rect.width;
    });

    // Calculate the starting x
    currentX = (boxes[0].containerWidth * 0.5) - (boxesWidth * 0.5);

    // Align the boxes center
    sortedBoxes.forEach((sortedBox: EditBoxComponent) => {
      let box: EditBoxComponent = this.getBox(boxes, sortedBox);
      box.rect.x = currentX;
      box.setElement();
      currentX = box.rect.xMax;
    });
  }

  alignBoxesRight(boxes: Array<EditBoxComponent>) {
    let sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(boxes),
      currentX: number = boxes[0].containerWidth;

    // Align the boxes right
    for (let i = sortedBoxes.length - 1; i > -1; i--) {
      let box: EditBoxComponent = this.getBox(boxes, sortedBoxes[i]);

      box.rect.x = currentX - box.rect.width;
      box.setElement();
      currentX = box.rect.x;
    }

  }
}
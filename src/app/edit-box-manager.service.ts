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
  public insertType: string;

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
}
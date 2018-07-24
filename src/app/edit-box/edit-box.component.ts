import { Component, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { Vector2 } from "../vector2";
import { Rect } from '../rect';
import { Line } from '../line';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;
  @Input() parentContainer: any;
  private isMousedown: boolean;
  private currentPosition: Vector2;

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

  ngAfterViewInit() {
    var interval = window.setInterval(() => {
      if (this.editBox.nativeElement.clientWidth > 0) {
        clearInterval(interval);
        this.rect = new Rect(0, 0, this.editBox.nativeElement.clientWidth, this.editBox.nativeElement.clientHeight);
      }
    }, 1);
  }

  onMouseDown(event, handle) {
    event.preventDefault();
    this.isMousedown = true;
    this.handle = handle;
    this.currentPosition = new Vector2(event.clientX, event.clientY);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaPosition = new Vector2(event.clientX - this.currentPosition.x, event.clientY - this.currentPosition.y);
      this.currentPosition = new Vector2(event.clientX, event.clientY);

      switch (this.handle) {
        case 'center':
          this.setRect(() => {
            return new Rect(this.rect.x + deltaPosition.x, this.rect.y + deltaPosition.y, this.rect.width, this.rect.height);
          });

          // this.setElement();
          break;
        case 'right':
          this.rect.width += deltaPosition.x;
          this.foo();
          this.setElement();
          break;
        case 'left':
          this.rect.width -= deltaPosition.x;
          this.rect.x += deltaPosition.x;
          this.foo();
          this.setElement();
          break;
        case 'bottom':
          this.rect.height += deltaPosition.y;
          this.foo();
          this.setElement();
          break;
        case 'top':
          this.rect.height -= deltaPosition.y;
          this.rect.y += deltaPosition.y;
          this.foo();
          this.setElement();
          break;
        case 'topLeft':
          this.setTopLeft(deltaPosition);
          break;
        case 'topRight':
          this.setTopRight(deltaPosition);
          break;
        case 'bottomLeft':
          this.setBottomLeft(deltaPosition);
          break;
        case 'bottomRight':
          this.setBottomRight(deltaPosition);
          break;
      }
    }
  }


  setTopLeft(deltaPosition: Vector2) {
    this.rect.height -= deltaPosition.y;
    this.rect.y += deltaPosition.y;
    this.rect.width -= deltaPosition.x;
    this.rect.x += deltaPosition.x;
    this.foo();
    this.setElement();
  }


  setTopRight(deltaPosition: Vector2) {
    this.rect.height -= deltaPosition.y;
    this.rect.y += deltaPosition.y;
    this.rect.width += deltaPosition.x;
    this.foo();
    this.setElement();
  }

  setBottomLeft(deltaPosition: Vector2) {
    this.rect.height += deltaPosition.y;
    this.rect.width -= deltaPosition.x;
    this.rect.x += deltaPosition.x;
    this.foo();
    this.setElement();
  }

  setBottomRight(deltaPosition: Vector2) {
    this.rect.width += deltaPosition.x;
    this.rect.height += deltaPosition.y;
    this.foo();
    this.setElement();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
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


  foo() {
    if (this.rect.x < 0) {
      let diff = 0 - this.rect.x;
      this.rect.x = 0;
      this.rect.width -= diff;
    }

    if (this.rect.xMax > 600) {
      this.rect.xMax = 600;
    }

    if (this.rect.y < 0) {
      let diff = 0 - this.rect.y;
      this.rect.y = 0;
      this.rect.height -= diff;
    }


    for (let i = 0; i < this.parentContainer.length; i++) {
      let otherRect = this.parentContainer._embeddedViews[i].nodes[1].instance.rect;

      if (this.rect !== otherRect) {
        if (this.rect.xMax > otherRect.x && this.rect.x < otherRect.xMax &&
          this.rect.yMax > otherRect.y && this.rect.y < otherRect.yMax) {

          let x = (otherRect.center.x - this.rect.center.x) / otherRect.width;
          let y = (otherRect.center.y - this.rect.center.y) / otherRect.height;

          if (Math.abs(x) > Math.abs(y)) {
            if (x > 0) {
              // Collision is on left side of other rect
              this.rect.xMax = otherRect.x;

            } else {
              //  Collision is on right side of other rect
              let diff = otherRect.xMax - this.rect.x;
              this.rect.x = otherRect.xMax;
              this.rect.width -= diff;
            }
          } else {
            if (y > 0) {
              // Collision is on top side of other rect
              this.rect.yMax = otherRect.y;
            } else {
              //Collision is on bottom side of other rect
              let diff = otherRect.yMax - this.rect.y;
              this.rect.y = otherRect.yMax;
              this.rect.height -= diff;
            }
          }
        }
      }
    }

  }


  setRect(action, response?) {
    let tempRect: Rect = action(), direction: Vector2 = tempRect.center.subtract(this.rect.center);

    for (let i = 0; i < this.parentContainer.length; i++) {
      let otherRect = this.parentContainer._embeddedViews[i].nodes[1].instance.rect;

      if (this.rect !== otherRect) {
        if (tempRect.xMax > otherRect.x && tempRect.x < otherRect.xMax &&
          tempRect.yMax > otherRect.y && tempRect.y < otherRect.yMax) {

          if (direction.y > 0) {
            if (+(this.rect.yMax.toFixed(2)) <= +(otherRect.y.toFixed(2))) {
              // Top of other rect
              // tempRect.y = otherRect.y - this.rect.height;
              this.setTopCollision(tempRect, otherRect);
              if (response) tempRect = response();
              continue;
            }
          } else {
            if (+(this.rect.y.toFixed(2)) >= +(otherRect.yMax.toFixed(2))) {
              // Bottom of other rect
              // tempRect.y = otherRect.yMax;
              this.setBottomCollision(tempRect, otherRect);
              if (response) tempRect = response();
              continue;
            }
          }

          if (direction.x > 0) {
            // Left of other rect
            // tempRect.x = otherRect.x - this.rect.width;
            this.setLeftCollision(tempRect, otherRect);
            if (response) tempRect = response();
          } else {
            // Right of other rect
            // tempRect.x = otherRect.xMax;
            this.setRightCollision(tempRect, otherRect);
            if (response) tempRect = response();
          }
        }

      }
    }
    this.rect = tempRect;

    this.setElement();
  }

  setTopCollision(tempRect: Rect, otherRect: Rect) {
    tempRect.y = otherRect.y - this.rect.height;
  }

  setBottomCollision(tempRect: Rect, otherRect: Rect) {
    tempRect.y = otherRect.yMax;
  }

  setLeftCollision(tempRect: Rect, otherRect: Rect) {
    tempRect.x = otherRect.x - this.rect.width;
  }

  setRightCollision(tempRect: Rect, otherRect: Rect) {
    tempRect.x = otherRect.xMax;
  }
}
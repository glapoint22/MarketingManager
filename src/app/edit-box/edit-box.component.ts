import { Component, HostListener, ViewChild, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { Vector2 } from "../vector2";

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;
  @Input() parentContainer: ViewContainerRef;
  private isMousedown: boolean;
  private handle: string;
  private currentPosition: Vector2;

  public showTopLeftHandle: boolean;
  public showTopHandle: boolean;
  public showTopRightHandle: boolean;
  public showLeftHandle: boolean;
  public showRightHandle: boolean;
  public showBottomLeftHandle: boolean;
  public showBottomHandle: boolean;
  public showBottomRightHandle: boolean;

  onMouseDown(event, handle) {
    event.preventDefault();
    this.isMousedown = true;
    this.handle = handle;
    this.currentPosition = {
      x: event.clientX,
      y: event.clientY
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaPosition = new Vector2(event.clientX - this.currentPosition.x, event.clientY - this.currentPosition.y);
      this.currentPosition = {
        x: event.clientX,
        y: event.clientY
      }

      switch (this.handle) {
        case 'center':
          let position: Vector2 = new Vector2(this.editBox.nativeElement.offsetLeft + deltaPosition.x, this.editBox.nativeElement.offsetTop + deltaPosition.y);

          position = this.checkCollision(position);
          this.editBox.nativeElement.style.left = position.x + 'px';
          this.editBox.nativeElement.style.top = position.y + 'px';
          break;
        case 'right':
          this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaPosition.x) + 'px';
          break;
        case 'left':
          this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaPosition.x) + 'px';
          this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaPosition.x) + 'px';
          break;
        case 'bottom':
          this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaPosition.y) + 'px';
          break;
        case 'top':
          this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaPosition.y) + 'px';
          this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaPosition.y) + 'px';
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
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaPosition.x) + 'px';
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaPosition.x) + 'px';
  }


  setTopRight(deltaPosition: Vector2) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaPosition.x) + 'px';
  }

  setBottomLeft(deltaPosition: Vector2) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaPosition.x) + 'px';
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaPosition.x) + 'px';
  }

  setBottomRight(deltaPosition: Vector2) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaPosition.y) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaPosition.x) + 'px';
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

  checkCollision(position: Vector2): Vector2 {
    // Check collision with the page
    position = {
      x: Math.min(600 - this.editBox.nativeElement.clientWidth, Math.max(0, position.x)),
      y: Math.max(0, position.y)
    }

    // Loop through all the objects on the page
    for (let i = 0; i < this.parentContainer.length; i++) {
      let viewRef: any = this.parentContainer.get(i);
      let other = viewRef.rootNodes[0].firstChild;

      // Test to see if there is a collision
      if (other !== this.editBox.nativeElement) {
        if (position.x + this.editBox.nativeElement.clientWidth >= other.offsetLeft && position.x <= other.offsetLeft + other.clientWidth &&
          position.y + this.editBox.nativeElement.clientHeight >= other.offsetTop && position.y <= other.offsetTop + other.clientHeight) {

          // There was a collision!

          // Get the centers
          let thisCenter: Vector2 = new Vector2(
            this.editBox.nativeElement.offsetLeft + (this.editBox.nativeElement.clientWidth * 0.5),
            this.editBox.nativeElement.offsetTop + (this.editBox.nativeElement.clientHeight * 0.5)
          );

          let otherCenter: Vector2 = new Vector2(
            other.offsetLeft + (other.clientWidth * 0.5),
            other.offsetTop + (other.clientHeight * 0.5)
          );


          // Here we test which side to place the box
          let x = (otherCenter.x - thisCenter.x) / other.clientWidth;
          let y = (otherCenter.y - thisCenter.y) / other.clientHeight;

          if (Math.abs(x) > Math.abs(y)) {
            if (x > 0) {
              //left
              position.x = other.offsetLeft - this.editBox.nativeElement.clientWidth;
            } else {
              //right
              position.x = other.offsetLeft + other.clientWidth;
            }
          } else {
            if (y > 0) {
              //top
              position.y = other.offsetTop - this.editBox.nativeElement.clientHeight;
            } else {
              //bottom
              position.y = other.offsetTop + other.clientHeight;
            }
          }
        }
      }
    }
    return position;
  }
}
import { Component, HostListener, ViewChild, ElementRef, Input } from '@angular/core';
import { Vector2 } from "../vector2";
import { Rect } from '../rect';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;
  @Input() parentContainer: any;
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
  public rect: Rect;

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
          this.rect.x += deltaPosition.x;
          this.rect.y += deltaPosition.y;
          this.setPosition();
          this.setElement();

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


  setPosition() {
    this.rect.x = Math.min(600 - this.rect.width, Math.max(0, this.rect.x));
    this.rect.y = Math.max(0, this.rect.y);


    for (let i = 0; i < this.parentContainer.length; i++) {
      let otherRect = this.parentContainer._embeddedViews[i].nodes[1].instance.rect;

      if (this.rect !== otherRect) {
        if (this.rect.xMax > otherRect.x && this.rect.x < otherRect.xMax &&
          this.rect.yMax > otherRect.y && this.rect.y < otherRect.yMax) {
          let x = (otherRect.center.x - this.rect.center.x) / otherRect.width;
          let y = (otherRect.center.y - this.rect.center.y) / otherRect.height;

          if (Math.abs(x) > Math.abs(y)) {
            if (x > 0) {
              //left
              this.rect.x = otherRect.x - this.rect.width;
            } else {
              //right
              this.rect.x = otherRect.xMax;
            }
          } else {
            if (y > 0) {
              //top
              this.rect.y = otherRect.y - this.rect.height;
            } else {
              //bottom
              this.rect.y = otherRect.yMax;
            }
          }
        }
      }
    }
  }

  setElement() {
    this.editBox.nativeElement.style.left = this.rect.x + 'px';
    this.editBox.nativeElement.style.top = this.rect.y + 'px';
    this.editBox.nativeElement.style.width = this.rect.width + 'px';
    this.editBox.nativeElement.style.height = this.rect.height + 'px';
  }
}
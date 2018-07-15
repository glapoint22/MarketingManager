import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;

  private isMousedown: boolean;
  private currentX: number;
  private currentY: number;
  private handle: string;

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
    this.currentX = event.clientX;
    this.currentY = event.clientY;
    this.handle = handle;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaX = event.clientX - this.currentX;
      let deltaY = event.clientY - this.currentY;
      this.currentX = event.clientX;
      this.currentY = event.clientY;

      switch (this.handle) {
        case 'center':
          let left = this.editBox.nativeElement.offsetLeft + deltaX;
          left = Math.max(0, left);
          left = Math.min(600 - this.editBox.nativeElement.clientWidth, left);
          this.editBox.nativeElement.style.left = left + 'px';

          let top = this.editBox.nativeElement.offsetTop + deltaY;
          top = Math.max(0, top);
          this.editBox.nativeElement.style.top = top + 'px';
          break;
        case 'right':
          this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaX) + 'px';
          break;
        case 'left':
          this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaX) + 'px';
          this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
          break;
        case 'bottom':
          this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaY) + 'px';
          break;
        case 'top':
          this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaY) + 'px';
          this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
          break;
        case 'topLeft':
          this.setTopLeft(deltaX, deltaY);
          break;
        case 'topRight':
          this.setTopRight(deltaX, deltaY);
          break;
        case 'bottomLeft':
          this.setBottomLeft(deltaX, deltaY);
          break;
        case 'bottomRight':
          this.setBottomRight(deltaX, deltaY);
          break;
      }
    }
  }


  setTopLeft(deltaX: number, deltaY: number) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaY) + 'px';
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaX) + 'px';
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
  }


  setTopRight(deltaX: number, deltaY: number) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaY) + 'px';
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaX) + 'px';
  }

  setBottomLeft(deltaX: number, deltaY: number) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaY) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaX) + 'px';
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
  }

  setBottomRight(deltaX: number, deltaY: number) {
    this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaY) + 'px';
    this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaX) + 'px';
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
}
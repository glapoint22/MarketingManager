import { Component, HostListener, ViewChild, ElementRef, Input, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;
  @Input() parentContainer: ViewContainerRef;

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
          let top = this.editBox.nativeElement.offsetTop + deltaY;



          left = Math.max(0, left);
          left = Math.min(600 - this.editBox.nativeElement.clientWidth, left);
          top = Math.max(0, top);

          for (let i = 0; i < this.parentContainer.length; i++) {
            let viewRef: any = this.parentContainer.get(i);
            let child = viewRef.rootNodes[0].firstChild;

            if (child !== this.editBox.nativeElement) {
              if (left + this.editBox.nativeElement.clientWidth >= child.offsetLeft && left <= child.offsetLeft + child.clientWidth &&
                top + this.editBox.nativeElement.clientHeight >= child.offsetTop && top <= child.offsetTop + child.clientHeight) {


                let x1 = this.editBox.nativeElement.offsetLeft + (this.editBox.nativeElement.clientWidth * 0.5);
                let y1 = this.editBox.nativeElement.offsetTop + (this.editBox.nativeElement.clientHeight * 0.5);

                let x2 = child.offsetLeft + (child.clientWidth * 0.5);
                let y2 = child.offsetTop + (child.clientHeight * 0.5);


                let x = (x2 - x1) / child.clientWidth;
                let y = (y2 - y1) / child.clientHeight;


                if (Math.abs(x) > Math.abs(y)) {
                  if (x > 0) {
                    //left
                    left = child.offsetLeft - this.editBox.nativeElement.clientWidth;
                  } else {
                    //right
                    left = child.offsetLeft + child.clientWidth;
                  }
                } else {
                  if (y > 0) {
                    //top
                    top = child.offsetTop - this.editBox.nativeElement.clientHeight;
                  } else {
                    //bottom
                    top = child.offsetTop + child.clientHeight;
                  }
                }
              }
            }
          }






          this.editBox.nativeElement.style.left = left + 'px';
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

  checkCollision(left: number, top: number) {





  }


}
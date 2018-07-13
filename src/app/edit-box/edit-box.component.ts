import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent implements OnInit {
  @ViewChild('editBox') editBox: ElementRef;
  public isUniform: boolean = true;
  private isMousedown: boolean;
  private currentX: number;
  private currentY: number;
  private handle: string;
  private scale: number;
  private height: number;
  private width: number;
  private scaleSpeed: number;


  constructor() { }

  ngOnInit() {
  }

  onMouseDown(event, handle) {
    event.preventDefault();
    this.isMousedown = true;
    this.currentX = event.clientX;
    this.currentY = event.clientY;
    this.handle = handle;

    if (this.isUniform) {
      this.scale = 1;
      this.width = this.editBox.nativeElement.clientWidth;
      this.height = this.editBox.nativeElement.clientHeight;
      this.scaleSpeed = 1 / (this.width > this.height ? this.width : this.height);
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    let bottomPos1;
    let bottomPos2;
    let rightPos1;
    let rightPos2;

    if (this.isMousedown) {
      let deltaX = event.clientX - this.currentX;
      let deltaY = event.clientY - this.currentY;
      this.currentX = event.clientX;
      this.currentY = event.clientY;

      switch (this.handle) {
        case 'center':
          this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
          this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
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
          if (this.isUniform) {
            // Get the initial position of the bottom and right side
            bottomPos1 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;
            rightPos1 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

            // Set the scale, width, and height
            this.setScale(deltaX, deltaY, Math.sign(-deltaX + -deltaY));
            this.setWidthHeight();

            // Get the positions of bottom and right
            bottomPos2 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;
            rightPos2 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

            // Set the top and left positions
            this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop - (bottomPos2 - bottomPos1)) + 'px';
            this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + (rightPos1 - rightPos2)) + 'px';
          } else {
            this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaY) + 'px';
            this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
            this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaX) + 'px';
            this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
          }
          break;
        case 'topRight':
          if (this.isUniform) {
            // Get the initial position of the bottom
            bottomPos1 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;

            // Set the scale, width, and height
            this.setScale(deltaX, deltaY, Math.sign(deltaX + -deltaY));
            this.setWidthHeight();

            // Get the bottom position
            bottomPos2 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;

            // Set the top position
            this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop - (bottomPos2 - bottomPos1)) + 'px';
          } else {
            this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight - deltaY) + 'px';
            this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop + deltaY) + 'px';
            this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaX) + 'px';
          }
          break;
        case 'bottomLeft':
          if (this.isUniform) {
            // Get the initial position of the right
            rightPos1 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

            // Set the scale, width, and height
            this.setScale(deltaX, deltaY, Math.sign(-deltaX + deltaY));
            this.setWidthHeight();

            // Get the right position
            rightPos2 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

            // Set the left position
            this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + (rightPos1 - rightPos2)) + 'px';
          } else {
            this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaY) + 'px';
            this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth - deltaX) + 'px';
            this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + deltaX) + 'px';
          }
          break;
        case 'bottomRight':
          if (this.isUniform) {
            // Set the scale, width, and height
            this.setScale(deltaX, deltaY, Math.sign(deltaX + deltaY));
            this.setWidthHeight();
          } else {
            this.editBox.nativeElement.style.height = (this.editBox.nativeElement.clientHeight + deltaY) + 'px';
            this.editBox.nativeElement.style.width = (this.editBox.nativeElement.clientWidth + deltaX) + 'px';
          }
          break;
      }
    }
  }

  setScale(deltaX: number, deltaY: number, sign: number) {
    let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    this.scale += (distance * sign * this.scaleSpeed);
  }

  setWidthHeight() {
    this.editBox.nativeElement.style.width = (this.width * this.scale) + 'px';
    this.editBox.nativeElement.style.height = (this.height * this.scale) + 'px';
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isMousedown = false;
  }


}

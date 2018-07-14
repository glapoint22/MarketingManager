import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';

@Component({
  template: '',
})
export class UniformBoxComponent extends EditBoxComponent {
  private scale: number;
  private height: number;
  private width: number;
  private scaleSpeed: number;

  onMouseDown(event, handle) {
    super.onMouseDown(event, handle);
    this.scale = 1;
    this.width = this.editBox.nativeElement.clientWidth;
    this.height = this.editBox.nativeElement.clientHeight;

    // 1 / diagonal length of the rectangle
    this.scaleSpeed = 1 / Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  setScale(deltaX: number, deltaY: number, sign: number) {
    let distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    this.scale += (distance * sign * this.scaleSpeed);
    this.scale = Math.max(0, this.scale);
  }

  setWidthHeight() {
    this.editBox.nativeElement.style.width = (this.width * this.scale) + 'px';
    this.editBox.nativeElement.style.height = (this.height * this.scale) + 'px';
  }

  setTopLeft(deltaX: number, deltaY: number) {
    // Get the initial position of the bottom and right side
    let bottomPos1 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;
    let rightPos1 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // Set the scale, width, and height
    this.setScale(deltaX, deltaY, Math.sign(-deltaX + -deltaY));
    this.setWidthHeight();

    // Get the positions of bottom and right
    let bottomPos2 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;
    let rightPos2 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // Set the top and left positions
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop - (bottomPos2 - bottomPos1)) + 'px';
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + (rightPos1 - rightPos2)) + 'px';
  }

  setTopRight(deltaX: number, deltaY: number) {
    // Get the initial position of the bottom
    let bottomPos1 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;

    // Set the scale, width, and height
    this.setScale(deltaX, deltaY, Math.sign(deltaX + -deltaY));
    this.setWidthHeight();

    // Get the bottom position
    let bottomPos2 = this.editBox.nativeElement.offsetTop + this.editBox.nativeElement.clientHeight;

    // Set the top position
    this.editBox.nativeElement.style.top = (this.editBox.nativeElement.offsetTop - (bottomPos2 - bottomPos1)) + 'px';
  }

  setBottomLeft(deltaX: number, deltaY: number) {
    // Get the initial position of the right
    let rightPos1 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // Set the scale, width, and height
    this.setScale(deltaX, deltaY, Math.sign(-deltaX + deltaY));
    this.setWidthHeight();

    // Get the right position
    let rightPos2 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // Set the left position
    this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + (rightPos1 - rightPos2)) + 'px';
  }

  setBottomRight(deltaX: number, deltaY: number) {
    // Set the scale, width, and height
    this.setScale(deltaX, deltaY, Math.sign(deltaX + deltaY));
    this.setWidthHeight();
  }

}

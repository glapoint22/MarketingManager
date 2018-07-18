import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';

@Component({
  template: '',
})
export class UniformBoxComponent extends EditBoxComponent {
  private scale: number;
  private left: number;
  private top: number;
  private height: number;
  private width: number;
  private scaleSpeed: number;

  onMouseDown(event, handle) {
    super.onMouseDown(event, handle);
    this.scale = 1;
    this.left = this.rect.x;
    this.top = this.rect.y;
    this.width = this.rect.width;
    this.height = this.rect.height;

    // 1 / diagonal length of the rectangle
    this.scaleSpeed = 1 / Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  setTopLeft(deltaPosition: Vector2) {
    let scale = this.getScale(this.scale, deltaPosition, Math.sign(-deltaPosition.x + -deltaPosition.y));
    let size = this.getSize(scale);

    this.rect = new Rect(
      (this.width - size.x) + this.left,
      (this.height - size.y) + this.top,
      size.x,
      size.y
    );

    if (!this.isCollision()) {
      this.setElement();
      this.scale = scale;
    }
  }

  setTopRight(deltaPosition: Vector2) {
    let scale = this.getScale(this.scale, deltaPosition, Math.sign(deltaPosition.x + -deltaPosition.y));
    let size = this.getSize(scale);

    this.rect = new Rect(
      this.rect.x,
      (this.height - size.y) + this.top,
      size.x,
      size.y
    );

    if (!this.isCollision()) {
      this.setElement();
      this.scale = scale;
    }
  }

  setBottomLeft(deltaPosition: Vector2) {
    // // Get the initial position of the right
    // let rightPos1 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // // Set the scale, width, and height
    // this.setScale(deltaPosition, Math.sign(-deltaPosition.x + deltaPosition.y));
    // this.setWidthHeight();

    // // Get the right position
    // let rightPos2 = this.editBox.nativeElement.offsetLeft + this.editBox.nativeElement.clientWidth;

    // // Set the left position
    // this.editBox.nativeElement.style.left = (this.editBox.nativeElement.offsetLeft + (rightPos1 - rightPos2)) + 'px';
  }

  setBottomRight(deltaPosition: Vector2) {
    // // Set the scale, width, and height
    // this.setScale(deltaPosition, Math.sign(deltaPosition.x + deltaPosition.y));
    // this.setWidthHeight();
  }

  getScale(currentScale: number, deltaPosition: Vector2, sign: number): number {
    let scale = currentScale;
    let distance = Math.sqrt(Math.pow(deltaPosition.x, 2) + Math.pow(deltaPosition.y, 2));
    scale += (distance * sign * this.scaleSpeed);
    scale = Math.max(0, scale);

    return scale;
  }

  getSize(scale: number):Vector2{
    return new Vector2(this.width * scale, this.height * scale)
  }

}

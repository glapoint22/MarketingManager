import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';

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
    this.width = this.rect.width;
    this.height = this.rect.height;

    // 1 / diagonal length of the rectangle
    this.scaleSpeed = 1 / Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2));
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(-deltaPosition.x + -deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.xMax - size.x, this.rect.yMax - size.y, size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.rect.xMax - size.x, this.rect.yMax - size.y, size.x, size.y);
    }
    );
  }

  setTopRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(deltaPosition.x + -deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.x, this.rect.yMax - size.y, size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.rect.x, this.rect.yMax - size.y, size.x, size.y);
    });

  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(-deltaPosition.x + deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.xMax - size.x, this.rect.y, size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.rect.xMax - size.x, this.rect.y, size.x, size.y);
    })
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(deltaPosition.x + deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.x, this.rect.y, size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.rect.x, this.rect.y, size.x, size.y);
    });
  }

  setScale(deltaPosition: Vector2, sign: number) {
    let distance = Math.sqrt(Math.pow(deltaPosition.x, 2) + Math.pow(deltaPosition.y, 2));
    this.scale += (distance * sign * this.scaleSpeed);
    this.scale = Math.max(0, this.scale);
  }

  getSize(): Vector2 {
    return new Vector2(this.width * this.scale, this.height * this.scale);
  }

  resetScale(diff: number, rectDimension: number, dimension: number) {
    let value = rectDimension - diff;
    this.scale = value / dimension;
  }


  setRightCollision(tempRect: Rect, otherRect: Rect) {
    super.setRightCollision(tempRect, otherRect);

    if (this.handle !== 'center') {
      this.resetScale(otherRect.xMax - tempRect.x, tempRect.width, this.width);
    }
  }

  setTopCollision(tempRect: Rect, otherRect: Rect) {
    super.setTopCollision(tempRect, otherRect);

    if (this.handle !== 'center') {
      this.resetScale(tempRect.yMax - otherRect.y, tempRect.height, this.height);
    }
  }

  setBottomCollision(tempRect: Rect, otherRect: Rect) {
    super.setBottomCollision(tempRect, otherRect);

    if (this.handle !== 'center') {
      this.resetScale(otherRect.yMax - tempRect.y, tempRect.height, this.height);
    }
  }

  setLeftCollision(tempRect: Rect, otherRect: Rect) {
    super.setLeftCollision(tempRect, otherRect);

    if (this.handle !== 'center') {
      this.resetScale(tempRect.xMax - otherRect.x, tempRect.width, this.width);
    }
  }
}
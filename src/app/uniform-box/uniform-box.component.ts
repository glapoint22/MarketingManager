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
    // this.setScale(deltaPosition, Math.sign(-deltaPosition.x + -deltaPosition.y));
    // let size = this.getSize();

    // this.rect = new Rect(this.getX(size.x), this.getY(size.y), size.x, size.y);

    // if (this.isCollision()) {
    //   size = this.getSize();
    //   this.rect = new Rect(this.getX(size.x), this.getY(size.y), size.x, size.y);
    // }
    // this.setElement();

    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(-deltaPosition.x + -deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.getX(size.x), this.getY(size.y), size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.getX(size.x), this.getY(size.y), size.x, size.y);
    }
    );
  }

  setTopRight(deltaPosition: Vector2) {
    // this.setScale(deltaPosition, Math.sign(deltaPosition.x + -deltaPosition.y));
    // let size = this.getSize();

    // this.rect = new Rect(this.rect.x, this.getY(size.y), size.x, size.y);

    // if (this.isCollision()) {
    //   size = this.getSize();
    //   this.rect = new Rect(this.rect.x, this.getY(size.y), size.x, size.y);
    // }

    // this.setElement();

    this.setRect(()=>{
      this.setScale(deltaPosition, Math.sign(deltaPosition.x + -deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.x, this.getY(size.y), size.x, size.y);
    }, ()=>{
      let size = this.getSize();
      return new Rect(this.rect.x, this.getY(size.y), size.x, size.y);
    });

  }

  setBottomLeft(deltaPosition: Vector2) {
    // this.setScale(deltaPosition, Math.sign(-deltaPosition.x + deltaPosition.y));
    // let size = this.getSize();

    // this.rect = new Rect(this.getX(size.x), this.rect.y, size.x, size.y);

    // if (this.isCollision()) {
    //   size = this.getSize();
    //   this.rect = new Rect(this.getX(size.x), this.rect.y, size.x, size.y);
    // }

    // this.setElement();

    this.setRect(() => {
      this.setScale(deltaPosition, Math.sign(-deltaPosition.x + deltaPosition.y));
      let size = this.getSize();
      // return new Rect(this.rect.xMax - size.x, this.rect.y, size.x, size.y);
      return new Rect(this.getX(size.x), this.rect.y, size.x, size.y);
    }, () => {
      let size = this.getSize();
      return new Rect(this.getX(size.x), this.rect.y, size.x, size.y);
    })
  }

  setBottomRight(deltaPosition: Vector2) {
    // this.setScale(deltaPosition, Math.sign(deltaPosition.x + deltaPosition.y));
    // let size = this.getSize();

    // this.rect = new Rect(this.rect.x, this.rect.y, size.x, size.y);

    // if (this.isCollision()) {
    //   size = this.getSize();
    //   this.rect = new Rect(this.rect.x, this.rect.y, size.x, size.y);
    // }

    // this.setElement();

    this.setRect(()=>{
      this.setScale(deltaPosition, Math.sign(deltaPosition.x + deltaPosition.y));
      let size = this.getSize();
      return new Rect(this.rect.x, this.rect.y, size.x, size.y);
    }, ()=>{
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
    return new Vector2(this.width * this.scale, this.height * this.scale)
  }

  isCollision() {
    // if (this.rect.x < 0) {
    //   this.resetScale(0 - this.rect.x, this.rect.width, this.width);
    //   return true;
    // }

    // if (this.rect.xMax > 600) {
    //   this.resetScale(this.rect.xMax - 600, this.rect.width, this.width);
    //   return true;
    // }

    // if (this.rect.y < 0) {
    //   this.resetScale(0 - this.rect.y, this.rect.height, this.height);
    //   return true;
    // }


    // for (let i = 0; i < this.parentContainer.length; i++) {
    //   let otherRect = this.parentContainer._embeddedViews[i].nodes[1].instance.rect;

    //   if (this.rect !== otherRect) {
    //     if (this.rect.xMax > otherRect.x && this.rect.x < otherRect.xMax &&
    //       this.rect.yMax > otherRect.y && this.rect.y < otherRect.yMax) {

    //       let x = (otherRect.center.x - this.rect.center.x) / otherRect.width;
    //       let y = (otherRect.center.y - this.rect.center.y) / otherRect.height;

    //       if (Math.abs(x) > Math.abs(y)) {
    //         if (x > 0) {
    //           // Collision is on left side of other rect
    //           this.resetScale(this.rect.xMax - otherRect.x, this.rect.width, this.width);
    //           return true;
    //         } else {
    //           //  Collision is on right side of other rect
    //           this.resetScale(otherRect.xMax - this.rect.x, this.rect.width, this.width);
    //           return true;
    //         }
    //       } else {
    //         if (y > 0) {
    //           // Collision is on top side of other rect
    //           this.resetScale(this.rect.yMax - otherRect.y, this.rect.height, this.height);
    //           return true;
    //         } else {
    //           //Collision is on bottom side of other rect
    //           this.resetScale(otherRect.yMax - this.rect.y, this.rect.height, this.height);
    //           return true;
    //         }
    //       }
    //     }
    //   }
    // }
    // return false;
  }

  resetScale(diff: number, rectDimension: number, dimension: number) {
    let value = rectDimension - diff;
    this.scale = value / dimension;
  }

  getX(size): number {
    return (this.width - size) + this.left;
  }

  getY(size): number {
    return (this.height - size) + this.top;
  }

  setRightCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      super.setRightCollision(tempRect, otherRect);
    } else {
      this.resetScale(otherRect.xMax - tempRect.x, tempRect.width, this.width);
    }

  }

  setTopCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      super.setTopCollision(tempRect, otherRect);
    } else {
      this.resetScale(tempRect.yMax - otherRect.y, tempRect.height, this.height);
    }
  }

  setBottomCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      super.setBottomCollision(tempRect, otherRect);
    } else {
      this.resetScale(otherRect.yMax - tempRect.y, tempRect.height, this.height);
    }
  }

  setLeftCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      super.setLeftCollision(tempRect, otherRect);
    } else {
      this.resetScale(tempRect.xMax - otherRect.x, tempRect.width, this.width);
    }
  }


}
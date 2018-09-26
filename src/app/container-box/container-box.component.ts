import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { BackgroundColor } from '../background-color';
import { Rect } from '../rect';

@Component({
  selector: 'container-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ContainerBoxComponent extends EditBoxComponent {
  private minSize: number = 8;

  initialize(copy) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      bgColor,
      size;

    // Assign the style
    this.styles = [backgroundColor];

    //set the handles
    this.setVisibleHandles(true, true, true, true, true, true, true, true);

    // Set copy or default
    if (copy) {
      size = copy.size;
      bgColor = copy.backgroundColor;
    } else {
      size = new Vector2(600, 150);
      bgColor = '#c1c1c1';
    }

    // Set the content container style
    this.contentContainer.style.width = '100%';
    this.contentContainer.style.height = '100%';
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = bgColor;

    super.initialize(size);
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.minSize, this.rect.height);
      });
    }
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x - (this.minSize - this.rect.width), this.rect.y, this.minSize, this.rect.height);
      });
    }
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.minSize);
      });
    }
  }

  setTopHandle(deltaPosition: Vector2) {
    super.setTopHandle(deltaPosition);

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (this.minSize - this.rect.height), this.rect.width, this.minSize);
      });
    }
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    super.setTopLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x - (this.minSize - this.rect.width), this.rect.y, this.minSize, this.rect.height);
      });
    }

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (this.minSize - this.rect.height), this.rect.width, this.minSize);
      });
    }
  }

  setTopRightHandle(deltaPosition: Vector2) {
    super.setTopRightHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.minSize, this.rect.height);
      });
    }

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (this.minSize - this.rect.height), this.rect.width, this.minSize);
      });
    }
  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    super.setBottomLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x - (this.minSize - this.rect.width), this.rect.y, this.minSize, this.rect.height);
      });
    }

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.minSize);
      });
    }
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    super.setBottomRightHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.minSize, this.rect.height);
      });
    }

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.minSize);
      });
    }
  }
}
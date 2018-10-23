import { Component, ViewChild, ViewContainerRef } from '@angular/core';
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
  @ViewChild('container', { read: ViewContainerRef }) container: any;
  private minSize: number = 8;

  initialize(boxData) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      rect;

    // Assign the style
    this.styles = [backgroundColor];

    //set the handles
    this.setVisibleHandles(true, true, true, true, true, true, true, true);

    // Set box properties or default
    if (boxData) {
      rect = boxData.rect;
      this.backgroundColor = boxData.backgroundColor;
    } else {
      rect = new Rect(null, null, 350, 150);
      this.backgroundColor = '#494949';
    }

    // Set the content container style
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = this.backgroundColor;

    super.initialize(rect, !boxData || boxData.isSelected);

    // if (!boxData || !boxData.loading) EditBoxComponent.change.next();
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

  setCurrentContainer() {
    EditBoxComponent.currentContainer = this.container;
  }
}
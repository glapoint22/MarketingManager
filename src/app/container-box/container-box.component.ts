import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { BackgroundColor } from '../background-color';
import { Rect } from '../rect';
import { BoxContainer } from '../box-container';
import { Container } from '../container';

@Component({
  selector: 'container-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss', './container-box.component.scss']
})
export class ContainerBoxComponent extends EditBoxComponent {
  @ViewChild('viewContainerRef', { read: ViewContainerRef }) viewContainerRef: any;
  private minSize: number = 8;
  public fixedHeight: number;
  public boxContainer: BoxContainer;

  initialize(boxData) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      rect: Rect;

    // Assign the style
    this.styles = [backgroundColor];

    //set the handles
    this.setVisibleHandles(true, true, true, true, true, true, true, true);

    // Set box properties or default
    if (boxData) {
      rect = boxData.rect;
      this.backgroundColor = boxData.backgroundColor;
    } else {
      rect = new Rect(null, null, 300, 200);
      // this.backgroundColor = '#494949';
    }
    this.fixedHeight = rect.height;

    // Set the content container style
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = this.backgroundColor;

    this.boxContainer = new BoxContainer(this.viewContainerRef, this.editBox.nativeElement, this);
    this.boxContainer.width = rect.width;

    super.initialize(this.setBoxData(rect, boxData));
  }

  setRightHandle(deltaPosition: Vector2) {
    let maxRowWidth = this.boxContainer.getMaxRowWidth();
    super.setRightHandle(deltaPosition);

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }
    this.boxContainer.width = this.rect.width;
    this.boxContainer.alignRows();
  }

  setLeftHandle(deltaPosition: Vector2) {
    let maxRowWidth = this.boxContainer.getMaxRowWidth();
    super.setLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x - (Math.max(this.minSize, maxRowWidth) - this.rect.width), this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }

    this.boxContainer.width = this.rect.width;
    this.boxContainer.alignRows();
  }

  setBottomHandle(deltaPosition: Vector2) {
    let yMax = Math.max(...this.boxContainer.boxes.map(box => box.rect.yMax));

    super.setBottomHandle(deltaPosition);

    if (this.rect.height < this.minSize || this.rect.height < yMax) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(yMax, this.minSize));
      });
    }
    this.fixedHeight = this.boxContainer.height = this.rect.height;
  }

  setTopHandle(deltaPosition: Vector2) {
    let minBoxY = Math.min(...this.boxContainer.boxes.map(box => box.rect.y)),
      maxHeight = this.rect.height - minBoxY,
      distance = deltaPosition.y,
      predictedY = this.rect.y + deltaPosition.y;

    super.setTopHandle(deltaPosition);

    if (predictedY < this.rect.y) {
      distance = (predictedY - deltaPosition.y - this.rect.y) * -1;
    }

    if (this.rect.height < this.minSize || this.rect.height < maxHeight) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (Math.max(this.minSize, maxHeight) - this.rect.height), this.rect.width, Math.max(this.minSize, maxHeight));
      });
    }

    this.boxContainer.moveRowsUp(distance);
    this.fixedHeight = this.boxContainer.height = this.rect.height;
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    let maxRowWidth = this.boxContainer.getMaxRowWidth(),
      minBoxY = Math.min(...this.boxContainer.boxes.map(box => box.rect.y)),
      maxHeight = this.rect.height - minBoxY,
      distance = deltaPosition.y,
      predictedY = this.rect.y + deltaPosition.y;

    super.setTopLeftHandle(deltaPosition);

    if (predictedY < this.rect.y) {
      distance = (predictedY - deltaPosition.y - this.rect.y) * -1;
    }

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x - (Math.max(this.minSize, maxRowWidth) - this.rect.width), this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }

    if (this.rect.height < this.minSize || this.rect.height < maxHeight) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (Math.max(this.minSize, maxHeight) - this.rect.height), this.rect.width, Math.max(this.minSize, maxHeight));
      });
    }
    this.boxContainer.moveRowsUp(distance);
    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
    this.boxContainer.alignRows();
  }

  setTopRightHandle(deltaPosition: Vector2) {
    let maxRowWidth = this.boxContainer.getMaxRowWidth(),
      minBoxY = Math.min(...this.boxContainer.boxes.map(box => box.rect.y)),
      maxHeight = this.rect.height - minBoxY,
      distance = deltaPosition.y,
      predictedY = this.rect.y + deltaPosition.y;

    super.setTopRightHandle(deltaPosition);

    if (predictedY < this.rect.y) {
      distance = (predictedY - deltaPosition.y - this.rect.y) * -1;
    }

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }

    if (this.rect.height < this.minSize || this.rect.height < maxHeight) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (Math.max(this.minSize, maxHeight) - this.rect.height), this.rect.width, Math.max(this.minSize, maxHeight));
      });
    }
    this.boxContainer.moveRowsUp(distance);
    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
    this.boxContainer.alignRows();
  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    let yMax = Math.max(...this.boxContainer.boxes.map(box => box.rect.yMax)),
      maxRowWidth = this.boxContainer.getMaxRowWidth();

    super.setBottomLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x - (Math.max(this.minSize, maxRowWidth) - this.rect.width), this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }

    if (this.rect.height < this.minSize || this.rect.height < yMax) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(yMax, this.minSize));
      });
    }

    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
    this.boxContainer.alignRows();
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    let yMax = Math.max(...this.boxContainer.boxes.map(box => box.rect.yMax)),
      maxRowWidth = this.boxContainer.getMaxRowWidth();

    super.setBottomRightHandle(deltaPosition);

    if (this.rect.width < this.minSize || this.rect.width < maxRowWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, Math.max(this.minSize, maxRowWidth), this.rect.height);
      });
    }

    if (this.rect.height < this.minSize || this.rect.height < yMax) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(yMax, this.minSize));
      });
    }
    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
    this.boxContainer.alignRows();
  }

  setCurrentContainer() {
    Container.currentContainer = this.boxContainer;
  }

  boxToTable(table: HTMLTableElement) {
    table.summary = this.getTableRect('containerBox');
    if (!this.boxContainer.boxes || this.boxContainer.boxes.length === 0) {
      let row = table.appendChild(document.createElement('tr'));
      let column = document.createElement('td');
      column.style.height = this.rect.height + 'px';
      row.appendChild(column);
    }
  }
}
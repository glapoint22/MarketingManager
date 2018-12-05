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
  styleUrls: ['../edit-box/edit-box.component.scss']
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
      this.backgroundColor = '#494949';
    }
    this.fixedHeight = rect.height;

    // Set the content container style
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = this.backgroundColor;

    this.boxContainer = new BoxContainer(this.viewContainerRef, this.editBox.nativeElement, this);
    this.boxContainer.width = rect.width;

    super.initialize(rect, !boxData || boxData.isSelected);
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.minSize, this.rect.height);
      });
    }
    this.boxContainer.width = this.rect.width;
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);

    if (this.rect.width < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x - (this.minSize - this.rect.width), this.rect.y, this.minSize, this.rect.height);
      });
    }

    this.boxContainer.width = this.rect.width;
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.minSize);
      });
    }
    this.fixedHeight = this.boxContainer.height = this.rect.height;
  }

  setTopHandle(deltaPosition: Vector2) {
    super.setTopHandle(deltaPosition);

    if (this.rect.height < this.minSize) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (this.minSize - this.rect.height), this.rect.width, this.minSize);
      });
    }

    this.boxContainer.height = this.rect.height;
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
    this.boxContainer.width = this.rect.width;
    this.boxContainer.height = this.rect.height;
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
    this.boxContainer.width = this.rect.width;
    this.boxContainer.height = this.rect.height;
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
    
    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
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
    this.boxContainer.width = this.rect.width;
    this.fixedHeight = this.boxContainer.height = this.rect.height;
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
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

  initialize(size?: Vector2) {
    if (!size) {
      this.setVisibleHandles(true, true, true, true, true, true, true, true);

      // Declare the style
      let backgroundColor: BackgroundColor = new BackgroundColor(this);

      // Assign the style
      this.styles = [backgroundColor];

      // Set the content container style
      this.contentContainer.style.width = '100%';
      this.contentContainer.style.height = '100%';
      this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = '#c1c1c1';
      size = new Vector2(600, 150);
    }

    super.initialize(size);
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);

    if (this.rect.width < 8) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, 8, this.rect.height);
      });
    }
  }
}
import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';
import { EditBoxLink } from '../edit-box-link';

@Component({
  selector: 'image-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ImageBoxComponent extends UniformBoxComponent {

  initialize(copy) {
    let editBoxLink: EditBoxLink = new EditBoxLink(this), size;

    this.styles = [editBoxLink];

    this.setVisibleHandles(true, false, true, false, false, true, false, true);

    // Set the style
    this.contentContainer.setAttribute('style', 'display: block; max-width: ' + this.parentContainer.element.nativeElement.parentElement.clientWidth + 'px;');
    
    size = copy ? copy.size : new Vector2(this.contentContainer.clientWidth, this.contentContainer.clientHeight);

    if (copy) {
      this.link = copy.link;
      editBoxLink.isSelected = this.link ? true : false;
      if (this.link) this.editBox.nativeElement.title = this.link;
    }


    super.initialize(size);

    this.contentContainer.style.width = '100%';
    this.contentContainer.style.height = '100%';
  }

  setRightHandle(deltaPosition: Vector2) {
    deltaPosition.y = deltaPosition.x;
    this.setBottomRightHandle(deltaPosition);
  }

  setBottomHandle(deltaPosition: Vector2) {
    deltaPosition.x = deltaPosition.y;
    this.setBottomRightHandle(deltaPosition);
  }

  setEditMode() { }
}
import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';
import { EditBoxLink } from '../edit-box-link';
import { Rect } from '../rect';

@Component({
  selector: 'image-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ImageBoxComponent extends UniformBoxComponent {

  initialize(copy) {
    let editBoxLink: EditBoxLink = new EditBoxLink(this), rect;

    this.styles = [editBoxLink];

    this.setVisibleHandles(true, false, true, false, false, true, false, true);

    // Set the style
    this.contentContainer.setAttribute('style', 'display: block; max-width: ' + this.parentContainer.element.nativeElement.parentElement.clientWidth + 'px;');

    rect = copy ? copy.rect : new Rect(null, null, this.contentContainer.clientWidth, this.contentContainer.clientHeight);

    if (copy) {
      this.link = copy.link;
      editBoxLink.isSelected = this.link ? true : false;
      if (this.link) this.editBox.nativeElement.title = this.link;
    }


    super.initialize(rect);

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

  convert(table: HTMLTableElement) {
    let td = table.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
    let img = document.createElement('img');
    img.src = this.contentContainer.src;
    img.style.width = '100%';

    if (this.link) {
      let anchor = td.appendChild(document.createElement('a'));
      anchor.href = this.link;
      anchor.appendChild(img);
    } else {
      td.appendChild(img);
    }
  }
}
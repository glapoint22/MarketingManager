import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';

@Component({
  selector: 'container-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ContainerBoxComponent extends EditBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, true, true, true, true, true, true, true);
  }

  initialize(content: HTMLElement, size?: Vector2) {
    if (!size) {
      // Set the HTML and style
      content.style.width = '100%';
      content.style.height = '100%';
      content.style.backgroundColor = 'red';
      size = new Vector2(560, 250);
    }

    super.initialize(content, size);
  }

  setEditMode() { }
}
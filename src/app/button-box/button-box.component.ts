import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';

@Component({
  selector: 'button-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ButtonBoxComponent extends UniformBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, true, true, true, true, true, true, true);
  }

  initialize(size?: Vector2) {
    // if (!size) {
    //   // Set the HTML and style
    //   content.innerHTML = '<span>Button</span>';
    //   content.setAttribute('style', 'outline: none; color: white; background: #c1c1c1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden;');
    //   content.setAttribute('contenteditable', 'false');
    //   size = new Vector2(144, 42);
    // }

    // super.initialize(content, size);
  }
}
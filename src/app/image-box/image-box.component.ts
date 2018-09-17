import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';

@Component({
  selector: 'image-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ImageBoxComponent extends UniformBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, false, true, false, false, true, false, true);
  }

  initialize(size?: Vector2) {
    // let pageWidth = this.parentContainer.element.nativeElement.parentElement.clientWidth;

    // let interval = window.setInterval(() => {
    //   if (content.clientWidth > 0) {
    //     clearInterval(interval);
    //     if (!size) {
    //       // Set the style
    //       content.setAttribute('style', 'display: block; max-width: ' + pageWidth + 'px;');
    //       size = new Vector2(content.clientWidth, content.clientHeight);
    //     }

    //     super.initialize(content, size);

    //     content.style.width = '100%';
    //     content.style.height = '100%';
    //   }
    // }, 1);
  }

  setEditMode() { }
}
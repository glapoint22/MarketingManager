import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Rect } from '../rect';

@Component({
  selector: 'image-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ImageBoxComponent extends UniformBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, false, true, false, false, true, false, true);
  }

  initialize(parentContainer: any, content: HTMLElement) {
    let pageWidth = parentContainer.element.nativeElement.parentElement.clientWidth;

    content.setAttribute('style', 'width: 100%; height: 100%; display: block; max-width: ' + pageWidth + 'px;');

    let interval = window.setInterval(() => {
      if (content.clientWidth > 0) {
        clearInterval(interval);
        this.rect = new Rect((pageWidth * 0.5) - (content.clientWidth * 0.5), 0, content.clientWidth, content.clientHeight);
        super.initialize(parentContainer, content);
      }
    }, 1);
  }

  setEditMode() { }
}
import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';

@Component({
  selector: 'image-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ImageBoxComponent extends UniformBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, false, true, false, false, true, false, true);
  }
}
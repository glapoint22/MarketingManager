import { Component, OnInit } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(false, false, false, true, true, false, true, false);
  }
}

import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Rect } from '../rect';

@Component({
  selector: 'container-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ContainerBoxComponent extends EditBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, true, true, true, true, true, true, true);
  }

  initialize(parentContainer: any, content: HTMLElement) {
    let pageWidth = parentContainer.element.nativeElement.parentElement.clientWidth,
      containerWidth = 560,
      containerHeight = 250;
    
    // Set the style
    // content.setAttribute('style', 'background-color: blue; width: 100%; height: 100%');

    content.style.width = '100%';
    content.style.height = '100%';
    content.style.backgroundColor = 'red';
    
    
    // Assign the rect
    this.rect = new Rect((pageWidth * 0.5) - (containerWidth * 0.5), 0, containerWidth, containerHeight);
    
    super.initialize(parentContainer, content);
  }

  setEditMode() { }
}
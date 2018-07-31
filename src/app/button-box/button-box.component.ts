import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Rect } from '../rect';

@Component({
  selector: 'button-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ButtonBoxComponent extends UniformBoxComponent{

  ngOnInit() {
    this.setVisibleHandles(true, true, true, true, true, true, true, true);
  }

  initialize(parentContainer: any, content: HTMLElement) {
    let pageWidth = parentContainer.element.nativeElement.parentElement.clientWidth,
      buttonWidth = 144,
      buttonHeight = 42;
    
    // Set the style
    content.innerHTML = '<span>Button</span>';
    content.setAttribute('style', 'outline: none; color: white; background: #c1c1c1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden;');
    
    // Assign the rect
    this.rect = new Rect((pageWidth * 0.5) - (buttonWidth * 0.5), 0, buttonWidth, buttonHeight);
    
    super.initialize(parentContainer, content);
  }
}
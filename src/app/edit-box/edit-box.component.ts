import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent implements OnInit {
  public isMousedown: boolean;
  private currentX: number;
  private element;


  constructor() { }

  ngOnInit() {
  }

  onMouseDown(event, element){
    this.isMousedown = true;
    this.element = element;
    this.currentX = event.clientX;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaX = this.currentX - event.clientX;
      this.currentX = event.clientX;
      this.element.style.left = (this.element.offsetLeft - deltaX) + 'px';
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isMousedown = false;
  }
  

}

import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {
  public isMousedown: boolean;
  private currentX: number;
  @Output() onMouse = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {
  
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if(this.isMousedown){
      let deltaX = this.currentX - event.clientX;
      this.currentX = event.clientX;
      this.el.nativeElement.parentElement.style.width = (this.el.nativeElement.parentElement.offsetWidth + deltaX) + 'px';
      this.el.nativeElement.ownerDocument.body.style.cursor = 'col-resize';
    }

  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    if(event.clientX >= this.el.nativeElement.offsetLeft && event.clientX <= this.el.nativeElement.offsetWidth + this.el.nativeElement.offsetLeft){
      this.isMousedown = true;
      this.currentX = event.clientX;
      event.preventDefault();
      this.onMouse.emit(true);
    }
    

  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    
    this.isMousedown = false;
    this.el.nativeElement.ownerDocument.body.style.cursor = 'default';
    this.onMouse.emit(false);
    
  }

}

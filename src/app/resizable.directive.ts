import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {
  private isMousedown: boolean;
  private currentX: number;

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
    }
    

  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    
    this.isMousedown = false;
    this.el.nativeElement.ownerDocument.body.style.cursor = 'default';
    
    
  }

}

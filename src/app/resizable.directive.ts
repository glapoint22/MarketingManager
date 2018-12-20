import { Directive, ElementRef, HostListener, Output, EventEmitter, Input } from '@angular/core';

@Directive({
  selector: '[resizable]'
})
export class ResizableDirective {
  private isMousedown: boolean;
  private currentX: number;
  @Output() onMouse = new EventEmitter<boolean>();
  @Input() direction: number;

  constructor(private el: ElementRef) { }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaX = event.clientX - this.currentX;
      this.currentX = event.clientX;
      this.el.nativeElement.parentElement.style.width = (this.el.nativeElement.parentElement.offsetWidth + deltaX * this.direction) + 'px';
      this.el.nativeElement.ownerDocument.body.style.cursor = 'w-resize';
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    let rect = this.el.nativeElement.getBoundingClientRect();
    if (event.clientX >= rect.left && event.clientX <= rect.right) {
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
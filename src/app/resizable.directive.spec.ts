import { ResizableDirective } from './resizable.directive';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: ''
})
class MockComponent { }

describe('ResizableDirective', () => {
  let directive;
  let fixture: ComponentFixture<MockComponent>;
  let mouseEvent: MouseEvent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent
      ]
    })
      .compileComponents();

    directive = new ResizableDirective(null);
    fixture = TestBed.createComponent(MockComponent);
    mouseEvent = new MouseEvent("mouseevent", {
      "clientX": 10
    });
    
    directive.currentX = 0;
    directive.el = fixture;
  });

  describe('onMouseMove', () => {
    beforeEach(()=>{
      directive.isMousedown = true;
    });

    it('should set parent element\'s width', () => {
      let width = fixture.nativeElement.parentElement.offsetWidth;
      directive.onMouseMove(mouseEvent);
      expect(fixture.nativeElement.parentElement.style.width).toBe((width - 10) + 'px');
    });

    it('should set cursor style to col-resize', () => {
      directive.onMouseMove(mouseEvent);
      expect(fixture.nativeElement.ownerDocument.body.style.cursor).toBe('col-resize');
    });
  });

  describe('onMouseDown', () => {
    it('should set mousedown to true', () => {
      directive.onMouseDown(mouseEvent);
      expect(directive.isMousedown).toBeTruthy();
    });

    it('should set currentX', () => {
      directive.onMouseDown(mouseEvent);
      expect(directive.currentX).toEqual(10);
    });

    it('should emit true', () => {
      let emit = spyOn(directive.onMouse, 'emit');
      directive.onMouseDown(mouseEvent);
      expect(emit).toHaveBeenCalledWith(true);
    });
  });

  describe('onMouseUp', () => {
    it('should set mousedown to false', () => {
      directive.isMousedown = true;
      directive.onMouseUp(mouseEvent);
      expect(directive.isMousedown).toBeFalsy();
    });

    it('should set cursor style to default', () => {
      directive.onMouseUp(mouseEvent);
      expect(fixture.nativeElement.ownerDocument.body.style.cursor).toBe('default');
    });

    it('should emit false', () => {
      let emit = spyOn(directive.onMouse, 'emit');
      directive.onMouseUp(mouseEvent);
      expect(emit).toHaveBeenCalledWith(false);
    });
  });
});
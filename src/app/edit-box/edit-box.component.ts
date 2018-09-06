import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Vector2 } from "../vector2";
import { Rect } from '../rect';
import { PropertiesService } from "../properties.service";
import { Style } from '../style';

@Component({
  selector: 'edit-box',
  templateUrl: './edit-box.component.html',
  styleUrls: ['./edit-box.component.scss']
})
export class EditBoxComponent {
  @ViewChild('editBox') editBox: ElementRef;

  constructor(public propertiesService: PropertiesService) { }

  private isMousedown: boolean;
  private currentPosition: Vector2;
  public showTopLeftHandle: boolean;
  public showTopHandle: boolean;
  public showTopRightHandle: boolean;
  public showLeftHandle: boolean;
  public showRightHandle: boolean;
  public showBottomLeftHandle: boolean;
  public showBottomHandle: boolean;
  public showBottomRightHandle: boolean;
  public rect: Rect;
  public handle: string;
  public parentContainer: any;
  public inEditMode: boolean;
  public content: any;
  public isSelected: boolean;
  public styles: Array<Style>;

  ngOnInit() {
    this.editBox.nativeElement.focus();
  }

  onMouseDown(event, handle) {
    event.preventDefault();
    this.isMousedown = true;
    this.handle = handle;
    this.currentPosition = new Vector2(event.clientX, event.clientY);
    this.setSelection();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isMousedown) {
      let deltaPosition = new Vector2(event.clientX - this.currentPosition.x, event.clientY - this.currentPosition.y);
      this.currentPosition = new Vector2(event.clientX, event.clientY);

      switch (this.handle) {
        case 'center':
          this.setCenterHandle(deltaPosition);
          break;
        case 'right':
          this.setRightHandle(deltaPosition);
          break;
        case 'left':
          this.setLeftHandle(deltaPosition);
          break;
        case 'bottom':
          this.setBottomHandle(deltaPosition);
          break;
        case 'top':
          this.setTopHandle(deltaPosition);
          break;
        case 'topLeft':
          this.setTopLeftHandle(deltaPosition);
          break;
        case 'topRight':
          this.setTopRightHandle(deltaPosition);
          break;
        case 'bottomLeft':
          this.setBottomLeftHandle(deltaPosition);
          break;
        case 'bottomRight':
          this.setBottomRightHandle(deltaPosition);
          break;
      }
    }
  }

  setCenterHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y + deltaPosition.y, this.rect.width, this.rect.height);
    });
  }

  setRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width + deltaPosition.x, this.rect.height);
    });
  }

  setLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y, this.rect.width - deltaPosition.x, this.rect.height);
    });
  }

  setBottomHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height + deltaPosition.y);
    });
  }

  setTopHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y + deltaPosition.y, this.rect.width, this.rect.height - deltaPosition.y);
    });
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y + deltaPosition.y, this.rect.width - deltaPosition.x, this.rect.height - deltaPosition.y);
    });
  }


  setTopRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y + deltaPosition.y, this.rect.width + deltaPosition.x, this.rect.height - deltaPosition.y);
    });
  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x + deltaPosition.x, this.rect.y, this.rect.width - deltaPosition.x, this.rect.height + deltaPosition.y);
    });
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width + deltaPosition.x, this.rect.height + deltaPosition.y);
    });
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent) {
    this.isMousedown = false;
  }

  setVisibleHandles(showLeftTopHandle, showTopHandle, showRightTopHandle, showLeftHandle, showRightHandle, showBottomLeftHandle, showBottomHandle, showBottomRightHandle) {
    this.showTopLeftHandle = showLeftTopHandle;
    this.showTopHandle = showTopHandle;
    this.showTopRightHandle = showRightTopHandle;
    this.showLeftHandle = showLeftHandle;
    this.showRightHandle = showRightHandle;
    this.showBottomLeftHandle = showBottomLeftHandle;
    this.showBottomHandle = showBottomHandle;
    this.showBottomRightHandle = showBottomRightHandle;
  }

  setElement() {
    this.editBox.nativeElement.style.left = this.rect.x + 'px';
    this.editBox.nativeElement.style.top = this.rect.y + 'px';
    this.editBox.nativeElement.style.width = this.rect.width + 'px';
    this.editBox.nativeElement.style.height = this.rect.height + 'px';
  }

  setRect(action, response?) {
    let tempRect: Rect = action(), direction: Vector2 = tempRect.center.subtract(this.rect.center),
      pageWidth = this.parentContainer.element.nativeElement.parentElement.clientWidth;

    // Set rect with page
    if (this.handle === 'center') {
      tempRect.x = Math.min(pageWidth - tempRect.width, Math.max(0, tempRect.x));
      tempRect.y = Math.max(0, tempRect.y);
    } else {
      if (tempRect.x < 0) {
        this.setRightCollision(tempRect, new Rect(0, 0, 0, 0));
        if (response) tempRect = response();
      }
      if (tempRect.xMax > pageWidth) {
        this.setLeftCollision(tempRect, new Rect(pageWidth, 0, 0, 0));
        if (response) tempRect = response();
      }
      if (tempRect.y < 0) {
        this.setBottomCollision(tempRect, new Rect(0, 0, 0, 0));
        if (response) tempRect = response();
      }
    }

    // Set rect with other rects
    for (let i = 0; i < this.parentContainer.length; i++) {
      let otherRect = this.parentContainer._embeddedViews[i].nodes[1].instance.rect;

      if (this.rect !== otherRect) {
        if (+(tempRect.xMax.toFixed(2)) > +(otherRect.x.toFixed(2)) && +(tempRect.x.toFixed(2)) < +(otherRect.xMax.toFixed(2)) &&
          +(tempRect.yMax.toFixed(2)) > +(otherRect.y.toFixed(2)) && +(tempRect.y.toFixed(2)) < +(otherRect.yMax.toFixed(2))) {

          if (direction.y > 0) {
            if (+(this.rect.yMax.toFixed(2)) <= +(otherRect.y.toFixed(2))) {
              // Top of other rect
              this.setTopCollision(tempRect, otherRect);
              if (response) tempRect = response(tempRect);
              continue;
            }
          } else {
            if (+(this.rect.y.toFixed(2)) >= +(otherRect.yMax.toFixed(2))) {
              // Bottom of other rect
              this.setBottomCollision(tempRect, otherRect);
              if (response) tempRect = response(tempRect);
              continue;
            }
          }

          if (direction.x > 0) {
            // Left of other rect
            this.setLeftCollision(tempRect, otherRect);
            if (response) tempRect = response(tempRect);
          } else {
            // Right of other rect
            this.setRightCollision(tempRect, otherRect);
            if (response) tempRect = response(tempRect);
          }
        }
      }
    }
    this.rect = tempRect;
    this.setElement();
  }

  setTopCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.y = otherRect.y - this.rect.height;
    } else {
      tempRect.yMax = otherRect.y;
    }
  }

  setBottomCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.y = otherRect.yMax;
    } else {
      let diff = otherRect.yMax - tempRect.y;
      tempRect.y = otherRect.yMax;
      tempRect.height -= diff;
    }
  }

  setLeftCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.x = otherRect.x - this.rect.width;
    } else {
      tempRect.xMax = otherRect.x;
    }
  }

  setRightCollision(tempRect: Rect, otherRect: Rect) {
    if (this.handle === 'center') {
      tempRect.x = otherRect.xMax;
    } else {
      let diff = otherRect.xMax - tempRect.x;
      tempRect.x = otherRect.xMax;
      tempRect.width -= diff;
    }
  }

  setSelection() {
    this.isSelected = true;
    if (this.parentContainer.currentEditBox && this.parentContainer.currentEditBox !== this) {
      this.parentContainer.currentEditBox.isSelected = false;
      if (this.parentContainer.currentEditBox.content.getAttribute('contenteditable')) {
        this.parentContainer.currentEditBox.inEditMode = false;
        this.parentContainer.currentEditBox.content.setAttribute('contenteditable', 'false');
        this.parentContainer.currentEditBox.content.style.setProperty('cursor', '');
      }
    }

    this.parentContainer.currentEditBox = this;
    this.propertiesService.setSelection();
  }

  setEditMode() {
    this.content.setAttribute('contenteditable', 'true');

    let selection = document.getSelection(),
      node: any = this.content,
      firstChild = node.firstChild.firstChild.nodeType === 3 ? node.firstChild.firstChild : node.firstChild.firstChild.firstChild,
      lastChild = node.lastChild.lastChild.nodeType === 3 ? node.lastChild.lastChild : node.lastChild.lastChild.firstChild;

    selection.setBaseAndExtent(firstChild, 0, lastChild, lastChild.length);
    this.content.style.setProperty('cursor', 'text');
    this.inEditMode = true;
    this.content.focus();
    // this.propertiesService.setEditMode();
    this.styles.forEach(x => x.checkSelection());
  }

  initialize(content: HTMLElement, size?: Vector2) {
    let pageWidth = this.parentContainer.element.nativeElement.parentElement.clientWidth;
    let y = 0;

    this.content = content;
    this.rect = new Rect(0, -Infinity, 0, 0);

    // Get an array of all rects from the container
    let rects: Array<Rect> = this.parentContainer._embeddedViews.map(x => x.nodes[1].instance.rect);

    // Order the rects so we can set the y position
    if (rects.length > 1) {
      rects = rects.sort((a: Rect, b: Rect) => {
        if (a.yMax > b.yMax) return 1;
        return -1;
      });
      y = rects[rects.length - 1].yMax;
    }

    this.rect = new Rect((pageWidth * 0.5) - (size.x * 0.5), y, size.x, size.y);

    this.setSelection();
    this.setElement();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape') {
      this.unSelect();
    }
  }

  unSelect() {
    this.isSelected = false;
    if (this.content.getAttribute('contenteditable')) {
      this.inEditMode = false;
      this.content.setAttribute('contenteditable', 'false');
      this.content.style.setProperty('cursor', '');
      // this.propertiesService.unSelect();
      this.styles.forEach(x => x.isSelected = false);
    }
  }
}
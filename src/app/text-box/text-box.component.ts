import { Component, HostListener } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {
  public content: HTMLElement;
  private height: number = -Infinity;
  public contentHasFocus: boolean;

  ngOnInit() {
    this.setVisibleHandles(false, false, false, true, true, false, true, false);
    this.setContent();
    super.ngOnInit();
  }

  setContent() {
    this.content.innerHTML = '<span>This is a temporary paragraph. Double click to edit this text.</span>';
    this.content.setAttribute('style', 'color: #414141; outline: none; word-wrap: break-word; overflow: hidden');
    this.content.onblur = () => {
      this.contentHasFocus = false;
      this.onBlur();
    }
    this.content.oninput = () => {
      this.content.style.height = '';
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
      }, () => {
        this.content.style.height = this.rect.height + 'px';
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      });
    }
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.height, this.content.clientHeight));
    }, (tempRect) => {
      return new Rect(tempRect.x, tempRect.y, tempRect.width - deltaPosition.x, tempRect.height);
    });
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
    }, (tempRect) => {
      return new Rect(tempRect.x - deltaPosition.x, tempRect.y, tempRect.width + deltaPosition.x, tempRect.height);
    });
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);
    if (this.rect.height < this.content.clientHeight) {
      this.height = -Infinity;
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
      });
    } else {
      this.height = this.rect.height;
    }
  }

  setEditMode() {
    this.contentHasFocus = true;
    this.content.setAttribute('contenteditable', 'true');
    let range = document.createRange();
    range.selectNodeContents(this.content);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    this.content.style.setProperty('cursor', 'text');
    super.setEditMode();

  }

  onBlur() {
    if (!this.contentHasFocus) {
      super.onBlur();
      this.content.setAttribute('contenteditable', 'false');
      this.content.style.setProperty('cursor', '');
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape' && this.hasFocus) {
      let el: any = document.querySelector(':focus');
      this.contentHasFocus = false;
      if (el) el.blur();
    }
  }
}
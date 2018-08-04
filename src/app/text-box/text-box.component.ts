import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {
  private height: number = -Infinity;

  ngOnInit() {
    this.setVisibleHandles(false, false, false, true, true, false, true, false);

    // Event when content changes
    this.content.oninput = () => {
      this.content.style.height = '';
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
      }, () => {
        this.content.style.height = this.rect.height + 'px';
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      });
    }

    super.ngOnInit();
  }

  initialize(content: HTMLElement, size?: Vector2) {
    if (!size) {
      // Set the HTML and style
      content.innerHTML = '<span>This is a temporary paragraph. Double click to edit this text.</span>';
      content.setAttribute('style', 'color: #414141; outline: none; word-wrap: break-word; overflow: hidden');
      size = new Vector2(180, 44);
    }

    super.initialize(content, size);
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
}
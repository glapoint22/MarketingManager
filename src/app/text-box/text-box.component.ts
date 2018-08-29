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
      this.setChange();
    }

    this.content.onkeydown = (event: KeyboardEvent) =>{
      if(event.code === 'Enter' || event.code === 'NumpadEnter'){
        this.propertiesService.checkEnter();
      }
    }

    this.content.onblur = () => {
      let selection = document.getSelection(),
        range = selection.getRangeAt(0);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    super.ngOnInit();
  }

  setChange() {
    if (this.height <= this.getContentHeight()) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.getContentHeight());
      }, () => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      });
    }

  }

  initialize(content: HTMLElement, size?: Vector2) {
    if (!size) {
      // Set style and HTML
      content.setAttribute('style', 'color: #414141; outline: none; word-wrap: break-word; overflow: hidden; height: 100%; font-size: 16px; background: #ffffff;');
      content.innerHTML = '<div>This is a temporary paragraph. Double click to edit this text.</div>';
      content.setAttribute('contenteditable', 'false');
      size = new Vector2(180, 54);
    }

    super.initialize(content, size);
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.height, this.getContentHeight()));
    }, (tempRect) => {
      return new Rect(tempRect.x, tempRect.y, tempRect.width - deltaPosition.x, tempRect.height);
    });
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.height, this.getContentHeight()));
    }, (tempRect) => {
      return new Rect(tempRect.x - deltaPosition.x, tempRect.y, tempRect.width + deltaPosition.x, tempRect.height);
    });
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);
    if (this.rect.height < this.getContentHeight()) {
      this.height = -Infinity;
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.getContentHeight());
      });
    } else {
      this.height = this.rect.height;
    }
  }

  getContentHeight() {
    let height = 0;

    for (let i = 0; i < this.content.children.length; i++) {
      height += this.content.children[i].getBoundingClientRect().height;
    }

    return height;
  }
}
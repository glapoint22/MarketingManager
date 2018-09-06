import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';
import { Bold } from '../bold';
import { Italic } from '../italic';
import { Underline } from '../underline';
import { TextColor } from '../text-color';
import { HighlightColor } from '../highlight-color';

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {
  private height: number = -Infinity;

  ngOnInit() {
    this.setVisibleHandles(false, false, false, true, true, false, true, false);

    this.styles = [new Bold(this), new Italic(this), new Underline(this), new TextColor(this), new HighlightColor(this)];

    // Event when content changes
    this.content.oninput = () => {
      this.setChange();
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
      // Set the content style
      content.style.outline = 'none';
      content.style.wordWrap = 'break-word';
      content.style.overflow = 'hidden';
      content.style.height = '100%';
      content.style.backgroundColor = '#ffffff';
      content.contentEditable = 'false';

      // Set the default text and default style
      let span = document.createElement('SPAN'),
        text = document.createTextNode('This is a temporary paragraph. Double click to edit this text.'),
        div = document.createElement('DIV');

      span.style.color = '#414141';
      span.style.fontSize = '16px';
      span.appendChild(text);
      div.appendChild(span);
      content.appendChild(div);

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
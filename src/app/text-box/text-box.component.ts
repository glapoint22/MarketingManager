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

    this.content.onblur = () => {
      let selection = document.getSelection(),
        range = selection.getRangeAt(0);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    super.ngOnInit();
  }
  unSelect() {
    this.clean();
    super.unSelect();
  }

  setChange() {
    this.content.style.height = '';
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
    }, () => {
      this.content.style.height = this.rect.height + 'px';
      return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    });
  }

  clean() {
    let nodeList: any = this.content.firstChild.childNodes;

    for (let i = 0; i < nodeList.length; i++) {
      // Remove text with no data
      if (nodeList[i].nodeType === 3 && nodeList[i].data.length === 0) {
        nodeList[i].remove();
        i = -1;
        continue;
      }

      // Remove a node with no text
      if (nodeList[i].nodeType === 1 && nodeList[i].innerText.length === 0) {
        nodeList[i].remove();
        i = -1;
        continue;
      }

      // Combine two adjacent text nodes
      if (nodeList[i].nodeType === 3 && nodeList[i + 1] && nodeList[i + 1].nodeType === 3) {
        nodeList[i].appendData(nodeList[i + 1].data);
        nodeList[i + 1].remove();
        i = -1;
        continue;
      }

      // combine two adjacent nodes with the same style
      if (nodeList[i].nodeType === 1 && nodeList[i + 1] && nodeList[i + 1].nodeType === 1 && nodeList[i].getAttribute('style') === nodeList[i + 1].getAttribute('style') && nodeList[i + 1].innerText.length > 0) {
        nodeList[i].innerText += nodeList[i + 1].innerText;
        nodeList[i + 1].remove();
        i = -1;
        continue;
      }
    }
  }

  initialize(content: HTMLElement, size?: Vector2) {
    if (!size) {
      // Set the HTML and style
      // content.innerHTML = '<span>This <span style="font-weight: bold">is</span> <span style="font-style: italic">a <span style="font-weight: bold"><span style="color: blue">temp</span>orary</span> paragraph</span>. <span style="font-weight: bold">Double click to</span> edit this text.</span>';
      // content.innerHTML = '<span>This <span style="font-weight: bold;">is</span> <span style="font-style: italic;">a </span><span style="color: blue; font-weight: bold; font-style: italic;">temp</span><span style="font-weight: bold; font-style: italic;">orary</span> <span style="font-style: italic;">paragraph.</span> <span style="font-weight: bold;">Double click to</span> edit this text.</span>'
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
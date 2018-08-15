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
  private padding: number = 7;
  public checkStyle: boolean;

  ngOnInit() {
    this.setVisibleHandles(false, false, false, true, true, false, true, false);

    // Event when content changes
    this.content.oninput = () => {
      this.setChange();
    }

    this.content.onkeydown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowUp' || event.code === 'ArrowRight' || event.code === 'ArrowDown') {

        window.setTimeout(() => {
          this.checkStyle = true;
        }, 1);
      }
    }

    this.content.onmouseup = () => {
      this.checkStyle = true;
    }

    this.content.onblur = () => {
      let selection = document.getSelection(),
        range = selection.getRangeAt(0);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    super.ngOnInit();
  }

  setEditMode() {
    this.checkStyle = true;
    super.setEditMode();
  }


  unSelect() {
    this.clean();
    super.unSelect();
  }

  setChange() {
    if (this.height <= this.content.firstChild.getBoundingClientRect().height + this.padding) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.firstChild.getBoundingClientRect().height + this.padding);
      }, () => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      });
    }

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
      // Set style and HTML
      content.setAttribute('style', 'color: #414141; outline: none; word-wrap: break-word; overflow: hidden; height: 100%;');
      content.innerHTML = '<span>This is a temporary paragraph. Double click to edit this text.</span>';
      size = new Vector2(180, 44);
    }

    super.initialize(content, size);
  }

  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.height, this.content.firstChild.getBoundingClientRect().height + this.padding));
    }, (tempRect) => {
      return new Rect(tempRect.x, tempRect.y, tempRect.width - deltaPosition.x, tempRect.height);
    });
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.height, this.content.firstChild.getBoundingClientRect().height + this.padding));
    }, (tempRect) => {
      return new Rect(tempRect.x - deltaPosition.x, tempRect.y, tempRect.width + deltaPosition.x, tempRect.height);
    });
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);
    if (this.rect.height < this.content.firstChild.getBoundingClientRect().height + this.padding) {
      this.height = -Infinity;
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.firstChild.getBoundingClientRect().height + this.padding);
      });
    } else {
      this.height = this.rect.height;
    }
  }
}
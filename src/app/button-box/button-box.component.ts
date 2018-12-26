import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';
import { BackgroundColor } from '../background-color';
import { Bold } from '../bold';
import { Italic } from '../italic';
import { TextColor } from '../text-color';
import { FontSize } from '../font-size';
import { Font } from '../font';
import { Rect } from '../rect';
import { EditBoxLink } from '../edit-box-link';

@Component({
  selector: 'button-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ButtonBoxComponent extends UniformBoxComponent {
  private fixedWidth: number;
  private fixedHeight: number;

  initialize(boxData) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      editBoxLink: EditBoxLink = new EditBoxLink(this),
      bold: Bold = new Bold(this),
      italic: Italic = new Italic(this),
      textColor: TextColor = new TextColor(this),
      fontSize: FontSize = new FontSize(this),
      font: Font = new Font(this),
      rect,
      srcdoc;

    // Assign the styles
    this.styles = [backgroundColor, editBoxLink, bold, italic,
      textColor, fontSize,
      font];

    //set the handles 
    this.setVisibleHandles(true, true, true, true, true, true, true, true);

    // Set the type
    this.type = 'Button';

    // Set box properties or default
    if (boxData) {
      srcdoc = boxData.content;
      this.backgroundColor = boxData.backgroundColor;
      rect = boxData.rect;
      this.link = boxData.link;
      editBoxLink.isSelected = this.link ? true : false;
      if (this.link) this.styles[1].styleValue = this.editBox.nativeElement.title = this.link;
    } else {
      // Set the default text
      let span = document.createElement('SPAN'),
        text = document.createTextNode('Button');

      // Set the default style
      span.style.color = '#ffffff';
      span.style.fontSize = '16px';
      span.style.fontFamily = '"Times New Roman", Times, serif';
      span.appendChild(text);
      srcdoc = span.outerHTML;
      this.backgroundColor = '#b0b0b0';

      // Set the default size
      rect = new Rect(null, null, 144, 42);
    }

    // Set the background color
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = this.backgroundColor;

    // Set the content container
    this.contentContainer.srcdoc = srcdoc;
    this.contentContainer.frameBorder = 0;

    // Set the fixed size
    this.fixedWidth = this.contentContainer.width = rect.width;
    this.fixedHeight = this.contentContainer.height = rect.height;

    // Set the content container's style and events
    this.contentContainer.onload = () => {
      this.content = this.contentContainer.contentDocument.body;
      this.content.style.margin = 0;
      this.content.style.width = rect.width + 'px';
      this.content.style.height = rect.height + 'px';
      this.content.style.lineHeight = rect.height + 'px';
      this.content.style.textAlign = 'center';
      this.content.style.whiteSpace = 'nowrap';
      this.content.style.overflow = 'hidden';


      // OnMouseUp
      this.content.ownerDocument.onmouseup = () => {
        this.checkSelectionForStyles();
      }

      // OnInput
      this.content.oninput = () => {
        this.setInvalidNodes();
        this.onContentChange();
      }

      // OnDrop
      this.content.ondrop = (event) => {
        event.preventDefault();
      }

      // OnPaste
      this.content.onpaste = (event) => {
        event.preventDefault();
      }

      // OnKeyDown
      this.content.onkeydown = (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ||
          event.code === 'ArrowRight' || event.code === 'ArrowDown') {
          this.checkSelectionForStyles();
        } else if (event.code === 'Escape' || event.code === 'Enter' || event.code === 'NumpadEnter') {
          event.preventDefault();
          this.unSelect();
        } else if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
          this.ctrlDown = true;
        } else {
          this.invokeStyle(event);
        }
      }

      // OnKeyUp
      this.content.onkeyup = (event) => {
        if (this.ctrlDown && (event.code === 'ControlLeft' || event.code === 'ControlRight')) {
          this.ctrlDown = false;
        }
      }

      super.initialize(this.setBoxData(rect, boxData));
    }


  }


  setRightHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setRightHandle(deltaPosition);
    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, size.x, this.rect.height);
      });
    }

    this.setWidth();
  }

  setLeftHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setLeftHandle(deltaPosition);
    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x - (size.x - this.rect.width), this.rect.y, size.x, this.rect.height);
      });
    }

    this.setWidth();
  }

  setBottomHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setBottomHandle(deltaPosition);
    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, size.y);
      });
    }
    this.setHeight();
  }

  setTopHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setTopHandle(deltaPosition);
    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (size.y - this.rect.height), this.rect.width, size.y);
      });
    }
    this.setHeight();
  }

  setTopLeftHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();
    super.setTopLeftHandle(deltaPosition);

    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x - (size.x - this.rect.width), this.rect.y, size.x, this.rect.height);
      });
    }

    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (size.y - this.rect.height), this.rect.width, size.y);
      });
    }
    this.setWidth();
    this.setHeight();
  }

  setTopRightHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setTopRightHandle(deltaPosition);
    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, size.x, this.rect.height);
      });
    }

    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y - (size.y - this.rect.height), this.rect.width, size.y);
      });
    }
    this.setWidth();
    this.setHeight();
  }

  setBottomLeftHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setBottomLeftHandle(deltaPosition);

    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x - (size.x - this.rect.width), this.rect.y, size.x, this.rect.height);
      });
    }

    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, size.y);
      });
    }

    this.setWidth();
    this.setHeight();
  }

  setBottomRightHandle(deltaPosition: Vector2) {
    let size = this.getContentSize();

    super.setBottomRightHandle(deltaPosition);
    if (this.rect.width < size.x) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, size.x, this.rect.height);
      });
    }

    if (this.rect.height < size.y) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, size.y);
      });
    }
    this.setWidth();
    this.setHeight();
  }

  setWidth(fixedUpdate: boolean = true) {
    this.contentContainer.width = this.rect.width;
    this.content.style.width = this.rect.width + 'px';
    if (fixedUpdate) this.fixedWidth = this.rect.width;
  }

  setHeight(fixedUpdate: boolean = true) {
    this.contentContainer.height = this.rect.height;
    this.content.style.height = this.rect.height + 'px';
    this.content.style.lineHeight = this.rect.height + 'px';
    if (fixedUpdate) this.fixedHeight = this.rect.height;
  }

  onContentChange() {
    let size = this.getContentSize();

    this.handle = '';
    this.setRect(() => {
      return new Rect(this.rect.x, this.rect.y, Math.max(size.x, this.fixedWidth), Math.max(size.y, this.fixedHeight));
    });
    this.setWidth(false);
    this.setHeight(false);

    super.onContentChange();
  }

  getContentSize() {
    let children = Array.from(this.content.children);

    // Get the width
    let x = 0;
    children.forEach((z: any) => x += z.offsetWidth)

    // Get the height
    let y = Math.max(...children.map((x: any) => x.offsetHeight));

    return { x: x, y: y }
  }

  setInvalidNodes() {
    let selection = this.content.ownerDocument.getSelection();
    let range: any = selection.getRangeAt(0);

    // Content has been deleted
    if (range.startContainer === this.content) {
      let span = document.createElement('SPAN'),
        br = document.createElement('BR');

      span.appendChild(br);
      span.style.fontWeight = this.styles.find(x => x.style === 'fontWeight').isSelected ? 'bold' : null;
      span.style.fontStyle = this.styles.find(x => x.style === 'fontStyle').isSelected ? 'italic' : null;
      span.style.color = this.styles.find(x => x.style === 'color').styleValue;
      span.style.fontSize = this.styles.find(x => x.style === 'fontSize').styleValue;
      span.style.fontFamily = this.styles.find(x => x.style === 'fontFamily').styleValue;

      if (range.startContainer.firstElementChild) {
        range.startContainer.firstElementChild.replaceWith(span);
      } else {
        range.startContainer.appendChild(span);
      }

      range.selectNodeContents(br);
      this.checkSelectionForStyles();
    }
  }

  boxToTable(table: HTMLTableElement) {
    let row = table.appendChild(document.createElement('tr')),
      column = document.createElement('td'),
      anchor = document.createElement('a');

    // Set the column and row
    column.align = 'center';
    row.appendChild(column);

    // Set table properties
    table.summary = this.getTableRect('buttonBox');
    table.removeAttribute('width');

    // Append the anchor to the body so we can get its dimensions
    document.body.appendChild(anchor);

    // Set the anchor properties
    anchor.href = this.link;
    anchor.setAttribute('target', '_blank');
    anchor.innerHTML = this.content.innerHTML;
    anchor.style.display = 'inline-block';
    anchor.style.textDecoration = 'none';
    anchor.style.backgroundColor = this.backgroundColor;

    // Calculate the border dimensions
    let anchorRect = anchor.getBoundingClientRect(),
      contentRect = this.content.getBoundingClientRect(),
      borderWidth = (contentRect.width - anchorRect.width) / 2,
      borderHeight = (contentRect.height - anchorRect.height - 1) / 2;

    // Set the border (this is the width and height of the button)
    anchor.style.borderLeft = borderWidth + 'px solid ' + table.bgColor;
    anchor.style.borderRight = borderWidth + 'px solid ' + table.bgColor;
    anchor.style.borderTop = borderHeight + 'px solid ' + table.bgColor;
    anchor.style.borderBottom = borderHeight + 'px solid ' + table.bgColor;
    anchor.style.borderColor = this.backgroundColor;

    // Remove the anchor from the body and append it to the column
    document.body.removeChild(anchor);
    column.appendChild(anchor);
  }
}
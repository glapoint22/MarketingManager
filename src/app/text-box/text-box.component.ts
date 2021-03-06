import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';
import { Bold } from '../bold';
import { Italic } from '../italic';
import { Underline } from '../underline';
import { TextColor } from '../text-color';
import { HighlightColor } from '../highlight-color';
import { FontSize } from '../font-size';
import { Font } from '../font';
import { AlignLeft } from '../align-left';
import { AlignCenter } from '../align-center';
import { AlignRight } from '../align-right';
import { AlignJustify } from '../align-justify';
import { LinkStyle } from '../link-style';
import { BackgroundColor } from '../background-color';

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {
  private fixedHeight: number = -Infinity;
  private minWidth: number = 8;
  private minHeight: number = 18;
  private isKeyDown: boolean;
  private isMouseDown: boolean;

  initialize(boxData) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      bold: Bold = new Bold(this),
      italic: Italic = new Italic(this),
      underline: Underline = new Underline(this),
      textColor: TextColor = new TextColor(this),
      highlightColor: HighlightColor = new HighlightColor(this),
      fontSize: FontSize = new FontSize(this),
      font: Font = new Font(this),
      alignLeft: AlignLeft = new AlignLeft(this),
      alignCenter: AlignCenter = new AlignCenter(this),
      alignRight: AlignRight = new AlignRight(this),
      alignJustify: AlignJustify = new AlignJustify(this),
      linkStyle: LinkStyle = new LinkStyle(this),
      rect,
      srcdoc;

    // Assign the styles
    this.styles = [backgroundColor, linkStyle, bold, italic, underline,
      textColor, highlightColor, alignLeft, alignCenter,
      alignRight, alignJustify, fontSize,
      font];

    //set the handles 
    this.setVisibleHandles(false, false, false, true, true, false, true, false);

    // Set the type
    this.type = 'Text';

    // Set box properties or default
    if (boxData) {
      srcdoc = boxData.content;
      this.backgroundColor = boxData.backgroundColor;
      rect = boxData.rect;
    } else {
      // Set the default text
      let div = document.createElement('DIV'),
        span = document.createElement('SPAN'),
        text = document.createTextNode('This is a temporary paragraph. Double click to edit this text.');

      // Set the default style
      span.style.color = '#000000';
      span.style.fontSize = '16px';
      span.style.fontFamily = '"Times New Roman", Times, serif';
      div.style.textAlign = 'left';
      div.style.outline = 'none';
      span.appendChild(text);
      div.appendChild(span);
      srcdoc = div.outerHTML;

      // Set the default size
      rect = new Rect(null, null, 180, 54);
    }

    // Set the background color
    this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = this.backgroundColor;

    // Set the content container
    this.contentContainer.srcdoc = srcdoc;
    this.contentContainer.frameBorder = 0;

    // Set the content container's style and events
    this.contentContainer.onload = () => {
      this.content = this.contentContainer.contentDocument.body;
      this.content.style.margin = 0;
      this.content.style.outline = 'none';
      this.content.style.overflow = 'hidden';
      this.content.contentEditable = 'false';
      this.content.style.fontSize = '0';

      // OnSelectionChange
      this.content.ownerDocument.onselectionchange = () => {
        if (this.inEditMode && (this.isKeyDown || this.isMouseDown)) {
          this.checkSelectionForStyles();
        }
      }

      // OnInput
      this.content.oninput = () => {
        this.setInvalidNodes();
        this.onContentChange();
      }

      this.content.ondrop = (event) => {
        event.preventDefault();
      }

      // OnKeyDown
      this.content.onkeydown = (event) => {
        this.isKeyDown = true;
        if (event.code === 'Escape' || event.code === 'NumpadEnter') {
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
        this.isKeyDown = false;
        if (this.ctrlDown && (event.code === 'ControlLeft' || event.code === 'ControlRight')) {
          this.ctrlDown = false;
        }
      }

      // OnMouseDown
      this.content.onmousedown = () => {
        this.isMouseDown = true;
      }

      // OnMouseUp
      this.content.onmouseup = () => {
        this.isMouseDown = false;
      }

      // OnPaste
      this.content.onpaste = (event) => {
        let text = event.clipboardData.getData('text'),
          selection = this.content.ownerDocument.getSelection(),
          range: any = selection.getRangeAt(0);

        event.preventDefault();

        if (text.length === 0) return;

        // Single container
        if (range.startContainer === range.endContainer) {
          if (range.startContainer.tagName === 'BR') {
            range.startContainer.replaceWith(text);
            range.setStart(range.endContainer.firstChild, range.endContainer.firstChild.length);
          } else {
            range.startContainer.replaceData(range.startOffset, range.endOffset - range.startOffset, text);
            range.setStart(range.endContainer, range.endContainer.length);
          }
          // Multiple containers
        } else {
          let endParentContainer = range.endContainer;

          // Get the parent container the end conter is in
          while (endParentContainer.tagName !== 'DIV') {
            endParentContainer = endParentContainer.parentElement;
          }

          // Loop through the children and paste the contents
          this.loopChildren(this.content, range, text, endParentContainer);
          range.collapse();
        }

        this.onContentChange();
      }


      // Set the size
      this.contentContainer.width = rect.width;
      this.contentContainer.height = rect.height;


      // Initialize
      super.initialize(this.setBoxData(rect, boxData));

      if (rect.height > this.content.clientHeight) this.fixedHeight = rect.height;
    }


  }

  loopChildren(node: HTMLElement, range, text, endParentContainer) {
    if (node === range.startContainer) {
      range.startContainer.replaceData(range.startOffset, range.startContainer.length, text);
    } else if (node === range.endContainer) {
      if (range.endOffset === range.endContainer.length) {
        range.endContainer.parentElement.remove();
        if (endParentContainer.childElementCount === 0) endParentContainer.remove();
      } else {
        if (range.endContainer.nodeType === 3) range.endContainer.deleteData(0, range.endOffset);
      }
    } else {
      if (range.isPointInRange(node, 0)) {
        if (node !== range.endContainer.parentElement && node !== range.endContainer.parentElement.parentElement && node !== endParentContainer) {
          node.remove();
        }
      }
    }

    Array.from(node.childNodes).forEach((child: HTMLElement) => {
      this.loopChildren(child, range, text, endParentContainer);
    });
  }

  setInvalidNodes() {
    // Div tags are deleted
    if (this.content.firstElementChild.tagName === 'BR') {
      let div = document.createElement('DIV');

      div.style.textAlign = 'left';
      div.appendChild(document.createElement('BR'));
      this.content.firstElementChild.replaceWith(div);
    }

    // Loop through each div tag
    Array.from(this.content.children).forEach((node: any) => {
      Array.from(node.childNodes).forEach((childNode: any) => {


        if (childNode.tagName === 'SPAN') {
          // Child node as <b>, <i>, or <i> tags
          if (childNode.firstElementChild && childNode.firstElementChild.tagName !== 'BR') {
            let text = this.getChild(childNode.firstElementChild);
            childNode.firstChild.appendData(text.data);
            childNode.firstElementChild.remove();
          }

          // Node has no color style
          if (childNode.style.color === '') {
            childNode.style.color = '#000000';
            this.removeDuplicateNodes(node, true);
          }

        }

        // Child node is <BR> or <FONT> or text
        if (childNode.tagName === 'BR' || childNode.tagName === 'FONT' || childNode.nodeType === 3) {
          let child;

          // Child node is text
          if (childNode.nextSibling) {
            child = childNode.nextSibling.firstChild;
            child.insertData(0, childNode.data);
            childNode.remove();

            // Child node is <BR> or <FONT>
          } else {
            let span = document.createElement('SPAN');

            if (childNode.tagName === 'BR') {
              child = document.createElement('BR');
            } else {
              child = document.createTextNode(this.getChild(childNode).data);
            }

            span.style.fontWeight = this.styles.find(x => x.style === 'fontWeight').isSelected ? 'bold' : null;
            span.style.fontStyle = this.styles.find(x => x.style === 'fontStyle').isSelected ? 'italic' : null;
            span.style.textDecoration = this.styles.find(x => x.style === 'textDecoration').isSelected ? 'underline' : null;
            span.style.color = this.styles.find(x => x.style === 'color').styleValue;

            span.style.backgroundColor = this.styles.find(x => x.title === 'Highlight color').styleValue;

            span.style.fontSize = this.styles.find(x => x.style === 'fontSize').styleValue;
            if (span.style.fontSize === '') span.style.fontSize = '16px';

            span.style.fontFamily = this.styles.find(x => x.style === 'fontFamily').styleValue;
            if (span.style.fontFamily === '') span.style.fontFamily = '"Times New Roman", Times, serif';

            span.appendChild(child);
            childNode.replaceWith(span);
          }

          if (child.nodeType === 3) {
            let selection = this.content.ownerDocument.getSelection();
            selection.setPosition(child, 1);
          }
        }
      });
    });
  }

  onContentChange() {
    if (this.fixedHeight <= this.content.clientHeight) {
      this.handle = '';
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.fixedHeight, this.content.clientHeight, this.minHeight));
      });
      this.contentContainer.height = this.rect.height;
    }
    super.onContentChange();
  }

  setRightHandle(deltaPosition: Vector2) {
    let contentHeight = this.content.clientHeight;

    super.setRightHandle(deltaPosition);

    window.setTimeout(() => {
      if (this.content.clientHeight !== contentHeight) {
        this.setRect(() => {
          return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.fixedHeight, this.content.clientHeight));
        });
        this.contentContainer.height = this.rect.height;
      }
    }, 1);


    if (this.rect.width < this.minWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.minWidth, this.rect.height);
      });
    }

    this.contentContainer.width = this.rect.width;
  }

  setLeftHandle(deltaPosition: Vector2) {
    let contentHeight = this.content.clientHeight;

    super.setLeftHandle(deltaPosition);


    window.setTimeout(() => {
      if (this.content.clientHeight !== contentHeight) {
        this.setRect(() => {
          return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.fixedHeight, this.content.clientHeight));
        });
        this.contentContainer.height = this.rect.height;
      }
    }, 1);

    if (this.rect.width < this.minWidth) {
      this.setRect(() => {
        return new Rect(this.rect.x - (this.minWidth - this.rect.width), this.rect.y, this.minWidth, this.rect.height);
      });
    }

    this.contentContainer.width = this.rect.width;
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);
    if (this.rect.height < this.content.clientHeight) {
      this.fixedHeight = -Infinity;
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, this.content.clientHeight);
      });
    } else {
      this.fixedHeight = this.rect.height;
    }
    this.contentContainer.height = this.rect.height;
  }

  boxToTable(table: HTMLTableElement) {
    table.summary = this.getRect('textBox');

    // Set the background color
    if (this.backgroundColor) table.bgColor = this.backgroundColor;

    // Set the content
    Array.from(this.content.children).forEach((content: HTMLElement) => {
      let tr = table.appendChild(document.createElement('tr')),
        column = document.createElement('td');

      column.style.textAlign = content.style.textAlign;
      column.innerHTML = content.innerHTML;
      tr.appendChild(column);
    });

    // If height of the box is greater than the content
    if (this.rect.height > this.content.clientHeight) {
      let tr = table.appendChild(document.createElement('tr')),
        column = document.createElement('td');

      column.height = (this.rect.height - this.content.clientHeight).toString();
      tr.appendChild(column);
    }
  }

  boxToHtml(div: HTMLElement) {
    div.title = this.getRect('textBox');

    // Set the background color
    if (this.backgroundColor) div.style.backgroundColor = this.backgroundColor;
    if (this.rect.height > this.content.clientHeight) div.style.height = this.rect.height + 'px';

    // Set the content
    Array.from(this.content.children).forEach((content: HTMLElement) => {
      let contentDiv = div.appendChild(document.createElement('DIV'));

      contentDiv.style.textAlign = content.style.textAlign;
      contentDiv.innerHTML = content.innerHTML;
    });
  }
}
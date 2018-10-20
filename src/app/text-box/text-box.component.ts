import { Component } from '@angular/core';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { Vector2 } from '../vector2';
import { Rect } from '../rect';
import { Bold } from '../bold';
import { Italic } from '../italic';
import { Underline } from '../underline';
import { TextColor } from '../text-color';
import { HighlightColor } from '../highlight-color';
import { OrderedList } from '../ordered-list';
import { UnorderedList } from '../unordered-list';
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

  initialize(box) {
    let backgroundColor: BackgroundColor = new BackgroundColor(this),
      bold: Bold = new Bold(this),
      italic: Italic = new Italic(this),
      underline: Underline = new Underline(this),
      textColor: TextColor = new TextColor(this),
      highlightColor: HighlightColor = new HighlightColor(this),
      orderedList: OrderedList = new OrderedList(this),
      unorderedList: UnorderedList = new UnorderedList(this),
      fontSize: FontSize = new FontSize(this),
      font: Font = new Font(this),
      alignLeft: AlignLeft = new AlignLeft(this),
      alignCenter: AlignCenter = new AlignCenter(this),
      alignRight: AlignRight = new AlignRight(this),
      alignJustify: AlignJustify = new AlignJustify(this),
      linkStyle: LinkStyle = new LinkStyle(this),
      // bgColor,
      rect,
      srcdoc;

    // Assign the styles
    this.styles = [backgroundColor, linkStyle, bold, italic, underline,
      textColor, highlightColor, orderedList,
      unorderedList, alignLeft, alignCenter,
      alignRight, alignJustify, fontSize,
      font];

    //set the handles 
    this.setVisibleHandles(false, false, false, true, true, false, true, false);


    // Set box properties or default
    if (box) {
      srcdoc = box.content;
      this.backgroundColor = box.backgroundColor;
      rect = box.rect;
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
      this.backgroundColor = '#00000000';

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
      // this.content.style.wordWrap = 'break-word';
      this.content.style.overflow = 'hidden';
      this.content.contentEditable = 'false';

      // OnMouseUp
      this.content.ownerDocument.onmouseup = () => {
        this.checkSelectionForStyles();
      }

      // OnInput
      this.content.oninput = () => {
        this.onContentChange();
        this.fixInvalidElements();
      }

      // OnKeyDown
      this.content.onkeydown = (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ||
          event.code === 'ArrowRight' || event.code === 'ArrowDown') {
          this.checkSelectionForStyles();
        } else if (event.code === 'Escape') {
          this.unSelect();
        }
      }
      if (!box || !box.loading) EditBoxComponent.change.next();
    }

    // Set the size
    this.contentContainer.width = rect.width;
    this.contentContainer.height = rect.height;

    // Initialize
    super.initialize(rect);
  }

  fixInvalidElements() {
    window.setTimeout(() => {
      let selection = this.content.ownerDocument.getSelection();
      let range: any = selection.getRangeAt(0);
      let startContainer: any = range.startContainer;

      // Content has been deleted
      if (range.startContainer === this.content) {
        let div = document.createElement('DIV');

        div.style.textAlign = 'left';
        div.appendChild(document.createElement('BR'));
        this.content.appendChild(div);
        range.selectNodeContents(div);
      }

      // Check to see if there is a font tag
      while (startContainer.tagName !== 'BODY' && startContainer.tagName !== 'DIV' && startContainer.tagName !== 'OL' && startContainer.tagName !== 'UL') {
        startContainer = startContainer.parentElement;
      }

      if (startContainer.firstElementChild.tagName === 'FONT') {
        startContainer.style.textAlign = startContainer.previousElementSibling.style.textAlign;
        startContainer.firstElementChild.replaceWith(document.createElement('BR'));
      }

      // Fix element if we have a break tag inside a div
      if (range.startContainer.tagName === 'DIV' && range.startContainer.firstElementChild && range.startContainer.firstElementChild.tagName === 'BR') {
        let span = document.createElement('SPAN'),
          br = document.createElement('BR');

        span.style.fontWeight = this.styles.find(x => x.style === 'fontWeight').isSelected ? 'bold' : null;
        span.style.fontStyle = this.styles.find(x => x.style === 'fontStyle').isSelected ? 'italic' : null;
        span.style.textDecoration = this.styles.find(x => x.style === 'textDecoration').isSelected ? 'underline' : null;
        span.style.color = this.styles.find(x => x.style === 'color').styleValue;

        let backgroundColor = this.styles.find(x => x.style === 'backgroundColor').styleValue;
        span.style.backgroundColor = backgroundColor === '#00000000' ? null : backgroundColor;
        span.style.fontSize = this.styles.find(x => x.style === 'fontSize').styleValue;
        span.style.fontFamily = this.styles.find(x => x.style === 'fontFamily').styleValue;

        span.appendChild(br);
        range.startContainer.firstElementChild.replaceWith(span);
        range.selectNodeContents(br);
        this.checkSelectionForStyles();
      }
    }, 1);
  }


  onContentChange() {
    if (this.fixedHeight <= this.content.clientHeight) {
      this.handle = '';
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, this.rect.width, Math.max(this.fixedHeight, this.content.clientHeight));
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
    table.className = 'text-box';

    // Set the background color
    if (this.backgroundColor && this.backgroundColor !== '#00000000') table.bgColor = this.backgroundColor;

    // Set the content
    Array.from(this.content.children).forEach((content: HTMLElement) => {
      let td = table.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));

      if (content.tagName === 'OL' || content.tagName === 'UL') {
        let list = td.appendChild(document.createElement(content.tagName));
        list.setAttribute('style', content.getAttribute('style'));
        list.innerHTML = content.innerHTML;
      } else {
        td.style.textAlign = content.style.textAlign;
        td.innerHTML = content.innerHTML;
      }
    });
  }
}
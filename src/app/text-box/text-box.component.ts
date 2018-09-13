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

@Component({
  selector: 'text-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class TextBoxComponent extends EditBoxComponent {
  private height: number = -Infinity;
  public mouseDown: boolean;

  ngOnInit() {
    let bold: Bold = new Bold(this),
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
      linkStyle: LinkStyle = new LinkStyle(this);

    this.setVisibleHandles(false, false, false, true, true, false, true, false);

    this.styles = [bold, italic, underline,
      textColor, highlightColor, orderedList,
      unorderedList, alignLeft, alignCenter, 
      alignRight, alignJustify, fontSize, 
      font, linkStyle];

    // Event when content changes
    this.content.oninput = () => {
      this.setChange();
      this.fixInvalidElements();
    }

    this.content.onblur = () => {
      let selection = document.getSelection(),
        range = selection.getRangeAt(0);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    this.content.onmousedown = () => {
      this.mouseDown = true;
    }

    this.content.onkeydown = (event) => {
      if (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ||
        event.code === 'ArrowRight' || event.code === 'ArrowDown') {
        this.checkSelectionForStyles();
      }
    }

    super.ngOnInit();
  }

  fixInvalidElements() {
    window.setTimeout(() => {
      let selection = document.getSelection();
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
      while (startContainer.tagName !== 'DIV' && startContainer.tagName !== 'OL' && startContainer.tagName !== 'UL') {
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
      span.style.fontFamily = '"Times New Roman", Times, serif';
      div.style.textAlign = 'left';
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

    if(height === 0){
      height = this.content.clientHeight;
    }

    return height;
  }
}
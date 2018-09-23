import { Component } from '@angular/core';
import { UniformBoxComponent } from '../uniform-box/uniform-box.component';
import { Vector2 } from '../vector2';
import { BackgroundColor } from '../background-color';
import { Bold } from '../bold';
import { Italic } from '../italic';
import { Underline } from '../underline';
import { TextColor } from '../text-color';
import { HighlightColor } from '../highlight-color';
import { FontSize } from '../font-size';
import { Font } from '../font';
import { LinkStyle } from '../link-style';
import { Rect } from '../rect';

@Component({
  selector: 'button-box',
  templateUrl: '../edit-box/edit-box.component.html',
  styleUrls: ['../edit-box/edit-box.component.scss']
})
export class ButtonBoxComponent extends UniformBoxComponent {

  ngOnInit() {
    this.setVisibleHandles(true, true, true, true, true, true, true, true);
  }

  initialize(size?: Vector2) {
    if (!size) {
      // Declare the styles
      let backgroundColor: BackgroundColor = new BackgroundColor(this),
        bold: Bold = new Bold(this),
        italic: Italic = new Italic(this),
        underline: Underline = new Underline(this),
        textColor: TextColor = new TextColor(this),
        highlightColor: HighlightColor = new HighlightColor(this),
        fontSize: FontSize = new FontSize(this),
        font: Font = new Font(this),
        linkStyle: LinkStyle = new LinkStyle(this),

        // Set the default text
        span = document.createElement('SPAN'),
        text = document.createTextNode('Button');

      //set the handles 
      this.setVisibleHandles(false, false, false, true, true, false, true, false);

      // Assign the styles
      this.styles = [backgroundColor, bold, italic, underline,
        textColor, highlightColor, fontSize,
        font, linkStyle];

      this.editBox.nativeElement.style.backgroundColor = backgroundColor.styleValue = '#c1c1c1';

      // Set the default style
      span.style.color = '#ffffff';
      span.style.fontSize = '16px';
      span.style.fontFamily = '"Times New Roman", Times, serif';
      span.appendChild(text);

      // Set the iframe
      this.iframe.srcdoc = span.outerHTML;
      this.iframe.frameBorder = 0;

      // Set the default size
      size = new Vector2(144, 42);
      this.iframe.width = size.x;
      this.iframe.height = size.y;

      // Set the iframe's style and events
      this.iframe.onload = () => {
        this.content = this.iframe.contentDocument.body;
        this.content.style.margin = 0;
        this.content.style.width = size.x + 'px';
        this.content.style.height = size.y + 'px';
        this.content.style.lineHeight = size.y + 'px';
        this.content.style.textAlign = 'center';
        this.content.style.whiteSpace = 'nowrap';
        this.content.style.overflow = 'hidden';


        // OnMouseUp
        this.content.ownerDocument.onmouseup = () => {
          this.checkSelectionForStyles();
        }

        // OnInput
        this.content.oninput = () => {
          // this.onContentChange();
          // this.fixInvalidElements();
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
      }


    }

    super.initialize(size);
  }


  setRightHandle(deltaPosition: Vector2) {
    super.setRightHandle(deltaPosition);
    this.setWidth();
  }

  setLeftHandle(deltaPosition: Vector2) {
    super.setLeftHandle(deltaPosition);
    this.setWidth();
  }

  setBottomHandle(deltaPosition: Vector2) {
    super.setBottomHandle(deltaPosition);
    this.setHeight();
  }

  setTopHandle(deltaPosition: Vector2) {
    super.setTopHandle(deltaPosition);
    this.setHeight();
  }

  setTopLeftHandle(deltaPosition: Vector2){
    super.setTopLeftHandle(deltaPosition);
    this.setWidth();
    this.setHeight();
  }

  setTopRightHandle(deltaPosition: Vector2){
    super.setTopRightHandle(deltaPosition);
    this.setWidth();
    this.setHeight();
  }

  setBottomLeftHandle(deltaPosition: Vector2){
    super.setBottomLeftHandle(deltaPosition);
    this.setWidth();
    this.setHeight();
  }

  setBottomRightHandle(deltaPosition: Vector2){
    super.setBottomRightHandle(deltaPosition);
    this.setWidth();
    this.setHeight();
  }

  setWidth(){
    this.iframe.width = this.rect.width;
    this.content.style.width = this.rect.width + 'px';
  }

  setHeight(){
    this.iframe.height = this.rect.height;
    this.content.style.height = this.rect.height + 'px';
    this.content.style.lineHeight = this.rect.height + 'px';
  }

  onContentChange(){
    if(this.content.firstElementChild.offsetWidth > this.rect.width || this.content.firstElementChild.offsetHeight > this.rect.height){
      this.handle = '';
      this.setRect(() => {
        return new Rect(this.rect.x, this.rect.y, Math.max(this.content.firstElementChild.offsetWidth + 1, this.rect.width), Math.max(this.content.firstElementChild.offsetHeight + 1, this.rect.height));
      });
      this.setWidth();
      this.setHeight();
    }
  }


}
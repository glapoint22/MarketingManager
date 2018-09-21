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
    // if (!size) {
    //   // Set the HTML and style
    //   content.innerHTML = '<span>Button</span>';
    //   content.setAttribute('style', 'outline: none; color: white; background: #c1c1c1; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; white-space: nowrap; overflow: hidden;');
    //   content.setAttribute('contenteditable', 'false');
    //   size = new Vector2(144, 42);
    // }

    // super.initialize(content, size);


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
        div = document.createElement('DIV'),
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
      div.style.outline = 'none';
      div.style.display = 'flex';
      div.style.alignItems = 'center';
      div.style.justifyContent = 'center';
      div.style.width = '-webkit-fill-available';
      div.style.height = '-webkit-fill-available';
      span.appendChild(text);
      div.appendChild(span);

      // Set the iframe
      this.iframe.srcdoc = div.outerHTML;
      this.iframe.frameBorder = 0;

      // Set the iframe's style and events
      this.iframe.onload = () => {
        this.content = this.iframe.contentDocument.body;

        this.content.style.margin = 0;
        this.content.style.outline = 'none';
        this.content.style.wordWrap = 'break-word';
        this.content.style.overflow = 'hidden';
        this.content.contentEditable = 'false';

        // OnMouseUp
        this.content.ownerDocument.onmouseup = () => {
          this.checkSelectionForStyles();
        }

        // OnInput
        this.content.oninput = () => {
          // this.setChange();
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

      // Set the default size
      size = new Vector2(144, 42);
      this.iframe.width = size.x;
      this.iframe.height = size.y;
    }

    super.initialize(size);



  }
}
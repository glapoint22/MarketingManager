import { Component, Input, ComponentFactoryResolver, HostListener, OnInit } from '@angular/core';
import { TextBoxComponent } from '../text-box/text-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { Vector2 } from '../vector2';
import { PropertiesService } from "../properties.service";

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  @Input() currentContainer;
  public isBold: boolean;
  public isItalic: boolean;
  public isUnderline: boolean;
  public textColor: string;
  public BackgroundColor: string;
  public colorPalette: HTMLInputElement;
  public colorType: string;
  private copied: any = {};

  constructor(private resolver: ComponentFactoryResolver, private propertiesService: PropertiesService) { }

  ngOnInit() {
    // OnSelection
    this.propertiesService.onSelection.subscribe(() => {
      this.textColor = this.getColor('color');
      this.BackgroundColor = this.getColor('background-color');
    });

    // OnSetEditMode
    this.propertiesService.onSetEditMode.subscribe(() => {
      this.checkStyles();
    });

    // OnUnSelect
    this.propertiesService.onUnSelect.subscribe(() => {
      this.checkStyles();
      this.cleanContent();
    });

    // Set the color palette
    this.colorPalette = document.createElement('input');
    this.colorPalette.type = 'color';
    this.colorPalette.onchange = (event: any) => {
      if (this.currentContainer.currentEditBox.inEditMode) {
        this.setStyle(this.colorType, event.path[0].value);
      } else {
        this.currentContainer.currentEditBox.content.style[this.colorType] = event.path[0].value;
      }
      this.BackgroundColor = this.colorType === 'background-color' ? event.path[0].value : this.BackgroundColor;
      this.textColor = this.colorType === 'color' ? event.path[0].value : this.textColor;
    }
  }

  removeEmptyTextNodes(contents) {
    for (let i = 0; i < contents.childNodes.length; i++) {
      if (contents.childNodes[i].nodeType === 3 && contents.childNodes[i].length === 0) {
        contents.childNodes[i].remove();
        i--;
      }
    }

    return contents;
  }

  selectionHasStyle(style) {
    let selection = document.getSelection();
    let range: any = selection.getRangeAt(0);

    if (range.startContainer === range.endContainer) {
      if (range.startContainer.parentElement.style[style].length > 0) return true;
    } else {
      let contents = this.removeEmptyTextNodes(range.cloneContents());
      if (Array.from(contents.childNodes).every((x: any) => x.style && x.style[style].length > 0)) return true;
    }

    return false;
  }

  getColor(colorType: string): string {
    let color: string;

    if (!this.currentContainer.currentEditBox.inEditMode) {
      color = this.currentContainer.currentEditBox.content.style[colorType];

      let node = this.currentContainer.currentEditBox.content.firstChild;

      for (let i = 0; i < node.childElementCount; i++) {
        if (node.children[i].style[colorType].length > 0) {
          if (node.children[i].style[colorType] !== color) {
            color = '';
            break;
          }
        }
      }
    } else {
      let selection = document.getSelection();
      let range: any = selection.getRangeAt(0);

      if (range.startContainer === range.endContainer) {
        color = range.startContainer.parentElement.style[colorType];
        if (color === '') color = this.currentContainer.currentEditBox.content.style[colorType];
        if (color === '') return '';
      } else {
        let contents = this.removeEmptyTextNodes(range.cloneContents());
        color = contents.firstElementChild.style[colorType];
        if (!Array.from(contents.childNodes).every((x: any) => x.style && x.style[colorType] === color)) {
          return '';
        }
      }
    }

    return this.rgbToHex(color);
  }

  rgbToHex(color) {
    let colorArray = color.replace(/[^\d,]/g, '').split(',');
    return "#" + this.componentToHex(parseInt(colorArray[0])) + this.componentToHex(parseInt(colorArray[1])) + this.componentToHex(parseInt(colorArray[2]));
  }

  componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  setColor(colorType: string) {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      this.colorType = colorType;
      this.colorPalette.value = this.getColor(colorType);
      this.colorPalette.click();
    }
  }


  delete() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      let index = this.currentContainer._embeddedViews.findIndex(x => x.nodes[1].instance === this.currentContainer.currentEditBox);
      this.currentContainer.currentEditBox.isSelected = false;
      this.currentContainer.remove(index);
    }
  }

  copy() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      if (this.currentContainer.currentEditBox instanceof TextBoxComponent) {
        this.copied.component = TextBoxComponent;
      } else if (this.currentContainer.currentEditBox instanceof ImageBoxComponent) {
        this.copied.component = ImageBoxComponent;
      } else if (this.currentContainer.currentEditBox instanceof ButtonBoxComponent) {
        this.copied.component = ButtonBoxComponent;
      } else if (this.currentContainer.currentEditBox instanceof ContainerBoxComponent) {
        this.copied.component = ContainerBoxComponent;
      }

      this.copied.nodeName = this.currentContainer.currentEditBox.content.nodeName;
      this.copied.style = this.currentContainer.currentEditBox.content.getAttribute('style');
      this.copied.innerHTML = this.currentContainer.currentEditBox.content.innerHTML;
      this.copied.rect = JSON.parse(JSON.stringify(this.currentContainer.currentEditBox.rect));
      this.copied.src = this.currentContainer.currentEditBox.content.src;
    }
  }

  paste() {
    if (this.copied) {
      let componentFactory = this.resolver.resolveComponentFactory(this.copied.component);
      let content = document.createElement(this.copied.nodeName);
      content.setAttribute('style', this.copied.style);
      content.innerHTML = this.copied.innerHTML;
      content.src = this.copied.src;

      let box = this.currentContainer.createComponent(componentFactory, null, null, [[content]]);

      box.instance.parentContainer = this.currentContainer;
      box.instance.initialize(content, new Vector2(this.copied.rect.width, this.copied.rect.height));
    }
  }



  setWholeText(range, style, styleValue, contents) {
    range.startContainer.parentElement.style[style] = styleValue;

    if (range.startContainer.parentElement.getAttribute('style').length === 0) {
      contents = range.cloneContents();
      range.startContainer.parentElement.remove();
      range.insertNode(contents);

      // Reset selection
      range.selectNodeContents(range.startContainer.childNodes[range.startOffset]);
    }
  }


  setBeginningOrEndText(range, style, styleValue, contents, selection, position) {
    let node = range.startContainer.parentElement.cloneNode();
    node.style[style] = styleValue;
    contents = range.extractContents();

    if (node.getAttribute('style').length > 0) {
      node.appendChild(contents);
      contents = node;
    }

    let index = Array.from(range.startContainer.parentElement.parentElement.childNodes).findIndex(x => x === range.startContainer.parentElement);
    selection.setPosition(range.startContainer.parentElement.parentElement, index + position);
    range = selection.getRangeAt(0);
    range.insertNode(contents);

    // Reset selection
    node = range.startContainer.childNodes[range.startOffset].nodeType === 1 ? range.startContainer.childNodes[range.startOffset].firstChild : range.startContainer.childNodes[range.startOffset];
    range.selectNodeContents(node);
  }

  setMidText(range, style, styleValue, contents) {
    let startString = range.startContainer.substringData(0, range.startOffset),
      endString = range.endContainer.substringData(range.endOffset, range.endContainer.length),
      startSpan = document.createElement('span'), endSpan = document.createElement('span');

    startSpan.setAttribute('style', range.startContainer.parentElement.getAttribute('style'));
    startSpan.appendChild(document.createTextNode(startString));
    endSpan.setAttribute('style', range.startContainer.parentElement.getAttribute('style'));
    endSpan.appendChild(document.createTextNode(endString));

    let node = range.startContainer.parentElement.cloneNode();
    node.style[style] = styleValue;


    contents = range.cloneContents();

    if (node.getAttribute('style').length > 0) {
      node.appendChild(contents);
      contents = document.createDocumentFragment();
      contents.appendChild(node);
    }

    range.startContainer.parentElement.remove();
    contents.insertBefore(startSpan, contents.childNodes[0]);
    contents.insertBefore(endSpan, contents.childNodes[1].nextSibling);
    range.insertNode(contents);

    // Reset selection
    node = range.startContainer.childNodes[range.startOffset + 1].nodeType === 1 ? range.startContainer.childNodes[range.startOffset + 1].firstChild : range.startContainer.childNodes[range.startOffset + 1];
    range.selectNodeContents(node);
  }

  setSelectedText(range, style, styleValue, contents, selection) {
    // Whole text is selected
    if (range.startOffset === 0 && range.endOffset === range.startContainer.length) {
      this.setWholeText(range, style, styleValue, contents);
      // Beginning text is selected
    } else if (range.startOffset === 0 && range.endOffset < range.startContainer.length) {
      this.setBeginningOrEndText(range, style, styleValue, contents, selection, 0);
      // Mid text is selected
    } else if (range.startOffset > 0 && range.endOffset < range.startContainer.length) {
      this.setMidText(range, style, styleValue, contents);
      // End text is selected
    } else if (range.startOffset > 0 && range.endOffset === range.startContainer.length) {
      this.setBeginningOrEndText(range, style, styleValue, contents, selection, 1);
    }
  }


  setStyle(style: string, styleValue: string, toggle?: boolean) {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.inEditMode) {
      let selection = document.getSelection();
      let range: any = selection.getRangeAt(0);
      let contents;

      // Single container
      if (range.startContainer === range.endContainer) {
        // Has this style
        if (range.startContainer.parentElement.style[style].length > 0) {
          if (!toggle) {
            // Change style
            range.startContainer.parentElement.style[style] = styleValue;
          } else {
            // remove this style
            this.setSelectedText(range, style, null, contents, selection);
          }

          // Does not have this style
        } else {
          // No style at all - Add this style
          if (!range.startContainer.parentElement.getAttribute('style')) {
            let span = document.createElement('SPAN');
            span.appendChild(range.extractContents());
            span.style[style] = styleValue;
            contents = span;
            range.insertNode(contents);

            // Reset selection
            range.selectNodeContents(range.endContainer.childNodes[range.endOffset - 1].firstChild);
          } else {
            // Some other style - Add this style
            this.setSelectedText(range, style, styleValue, contents, selection);
          }
        }
        // Multiple containers
      } else {
        contents = this.removeEmptyTextNodes(range.extractContents());

        // Remove any empty nodes
        for (let i = 0; i < range.startContainer.childElementCount; i++) {
          if (range.startContainer.children[i].firstChild.length === 0) {
            range.startContainer.children[i].remove();
            i--;
          }
        }

        // Test to see if every node has this style
        if (Array.from(contents.childNodes).every((x: any) => x.style && x.style[style].length > 0)) {
          // Replace or remove style
          contents.childNodes.forEach((x, i, v) => {
            x.style[style] = toggle ? null : styleValue;
            if (x.getAttribute('style').length === 0) {
              let text = x.innerText;
              x.remove();
              let textNode = document.createTextNode(text);
              contents.insertBefore(textNode, v[i]);
            }
          });
        } else {
          // Apply style
          contents.childNodes.forEach((x, i, v) => {
            if (x.nodeType === 3) {
              let span = document.createElement('SPAN');
              span.appendChild(x);
              span.style[style] = styleValue;
              contents.insertBefore(span, v[i]);
            } else {
              x.style[style] = styleValue;
            }
          });
        }
        range.insertNode(contents);

        // Reset selection
        let baseNode = range.startContainer.childNodes[range.startOffset].nodeType === 1 ? range.startContainer.childNodes[range.startOffset].firstChild : range.startContainer.childNodes[range.startOffset];
        let extentNode = range.startContainer.childNodes[range.endOffset - 1].nodeType === 1 ? range.startContainer.childNodes[range.endOffset - 1].firstChild : range.startContainer.childNodes[range.endOffset - 1];

        selection.setBaseAndExtent(baseNode, 0, extentNode, extentNode.length);
      }

      this.currentContainer.currentEditBox.setChange();
      this.checkStyles();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.currentContainer &&
      this.currentContainer.currentEditBox &&
      this.currentContainer.currentEditBox.inEditMode &&
      (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ||
        event.code === 'ArrowRight' || event.code === 'ArrowDown')) {
      window.setTimeout(() => {
        this.checkStyles();
      }, 1);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.inEditMode) {
      window.setTimeout(() => {
        this.checkStyles();
      }, 1);
    }
  }

  checkStyles() {
    if (this.currentContainer.currentEditBox.inEditMode) {
      this.isBold = this.selectionHasStyle('fontWeight');
      this.isItalic = this.selectionHasStyle('fontStyle');
      this.isUnderline = this.selectionHasStyle('textDecoration');
      this.textColor = this.getColor('color');
      this.BackgroundColor = this.getColor('background-color');
    } else {
      this.isBold = false;
      this.isItalic = false;
      this.isUnderline = false;
      this.textColor = '';
      this.BackgroundColor = '';
    }
  }

  cleanContent() {
    let nodeList: any = this.currentContainer.currentEditBox.content.firstChild.childNodes;

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
}
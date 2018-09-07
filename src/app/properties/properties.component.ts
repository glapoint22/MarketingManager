import { Component, Input, ComponentFactoryResolver, HostListener, OnInit } from '@angular/core';
import { TextBoxComponent } from '../text-box/text-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { Vector2 } from '../vector2';

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
  public fontDropdown;
  public fontSizeDropdown;
  private copied: any = {};

  constructor(private resolver: ComponentFactoryResolver) { }


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


  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.currentContainer &&
      this.currentContainer.currentEditBox &&
      this.currentContainer.currentEditBox.inEditMode &&
      (event.code === 'ArrowLeft' || event.code === 'ArrowUp' ||
        event.code === 'ArrowRight' || event.code === 'ArrowDown')) {
      window.setTimeout(() => {
        this.currentContainer.currentEditBox.styles.forEach(x => x.checkSelection());
      }, 1);
    }
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.inEditMode) {
      this.currentContainer.currentEditBox.styles.forEach(x => x.checkSelection());
    }
  }

  ngOnInit() {
    // this.fontDropdown = document.getElementById('fontDropdown');
    // this.fontDropdown.value = '';

    // this.fontSizeDropdown = document.getElementById('fontSizeDropdown');
    // this.fontSizeDropdown.value = '';

    // OnSelection
    // this.propertiesService.onSelection.subscribe(() => {
    //   if (this.currentContainer && this.currentContainer.currentEditBox && !this.currentContainer.currentEditBox.inEditMode) {
    //     this.textColor = this.getStyleValue('color');
    //     this.BackgroundColor = this.getStyleValue('background-color');
    //     this.getDropdownOption(this.fontSizeDropdown, 'font-size');
    //     this.getDropdownOption(this.fontDropdown, 'font-family');
    //   }

    // });

    // OnSetEditMode
    // this.propertiesService.onSetEditMode.subscribe(() => {
    //   this.checkStyles();
    // });

    // OnUnSelect
    // this.propertiesService.onUnSelect.subscribe(() => {
    //   this.checkStyles();
    //   this.cleanContent();
    //   this.textColor = '';
    //   this.BackgroundColor = '';
    //   this.fontSizeDropdown.value = '';
    //   this.fontDropdown.value = '';
    // });

    // this.propertiesService.onEnter.subscribe(() => {
    //   window.setTimeout(() => {
    //     let content = this.currentContainer.currentEditBox.content;

    //     // Loop through the content to search for a break in a list
    //     for (let i = 0; i < content.childElementCount; i++) {
    //       for (let j = 0; j < content.children[i].childElementCount; j++) {
    //         if (content.children[i].children[j].tagName === 'DIV') {
    //           let div = document.createElement('DIV');
    //           let documentFragment = document.createDocumentFragment();
    //           let breakNode;

    //           // Remove the div with the break and replace with a new one to prevent style carry over
    //           content.children[i].children[j].remove();
    //           div.appendChild(document.createElement('BR'));
    //           documentFragment.appendChild(div);

    //           // Take the remaining list elements and place them in a div
    //           if (j !== content.children[i].childElementCount) {
    //             div = document.createElement('DIV');
    //             div.appendChild(content.children[i].children[j])
    //             documentFragment.appendChild(div);
    //           }

    //           // Assign the new break node
    //           breakNode = documentFragment.children[0];

    //           // Place the document fragment with the lists into the content
    //           if (i === content.childElementCount - 1) {
    //             content.appendChild(documentFragment);
    //           } else {
    //             content.insertBefore(documentFragment, content.children[i + 1]);
    //           }

    //           // Select the break node
    //           let selection = document.getSelection();
    //           selection.setPosition(breakNode, 0);

    //           return;
    //         }
    //       }
    //     }
    //   }, 1);
    // });

    // // Set the color palette
    // this.colorPalette = document.createElement('input');
    // this.colorPalette.type = 'color';
    // this.colorPalette.onchange = (event: any) => {
    //   this.setStyle(this.colorType, event.path[0].value);
    // }
  }

  // getDropdownOption(dropdown, style) {
  //   let option = this.getStyleValue(style);
  //   if (option === '') {
  //     dropdown.value = '';
  //     return;
  //   }

  //   for (let i = 0; i < dropdown.length; i++) {
  //     if (dropdown.options[i].value === option) {
  //       dropdown.selectedIndex = i;
  //       break;
  //     }
  //   }
  // }



  // selectionHasStyle(style) {
  //   let selection = document.getSelection();
  //   let range: any = selection.getRangeAt(0);

  //   if (range.startContainer === range.endContainer) {
  //     if (range.startContainer.parentElement.style[style].length > 0) return true;
  //   } else {
  //     let contents = this.removeEmptyTextNodes(range.cloneContents());
  //     if (Array.from(contents.childNodes).every((x: any) => x.style && x.style[style].length > 0)) return true;
  //   }

  //   return false;
  // }

  // getStyleValue(style: string): string {
  //   let value: string;

  //   if (!this.currentContainer.currentEditBox.inEditMode) {
  //     value = this.currentContainer.currentEditBox.content.style[style];

  //     let node = this.currentContainer.currentEditBox.content.firstChild;

  //     for (let i = 0; i < node.childElementCount; i++) {
  //       if (node.children[i].style[style].length > 0) {
  //         if (node.children[i].style[style] !== value) {
  //           value = '';
  //           break;
  //         }
  //       }
  //     }
  //   } else {
  //     let selection = document.getSelection();
  //     let range: any = selection.getRangeAt(0);

  //     if (range.startContainer === range.endContainer) {
  //       value = range.startContainer.parentElement.style[style];
  //       if (value === '') value = this.currentContainer.currentEditBox.content.style[style];
  //       if (value === '') return '';
  //     } else {
  //       let contents = this.removeEmptyTextNodes(range.cloneContents());
  //       value = contents.firstElementChild.style[style];
  //       if (!Array.from(contents.childNodes).every((x: any) => x.style && x.style[style] === value)) {
  //         return '';
  //       }
  //     }
  //   }

  //   return value;
  // }

  // rgbToHex(color) {
  //   let colorArray = color.replace(/[^\d,]/g, '').split(',');
  //   return "#" + this.componentToHex(parseInt(colorArray[0])) + this.componentToHex(parseInt(colorArray[1])) + this.componentToHex(parseInt(colorArray[2]));
  // }

  // componentToHex(c) {
  //   let hex = c.toString(16);
  //   return hex.length == 1 ? "0" + hex : hex;
  // }

  // setColor(colorType: string) {
  //   if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
  //     this.colorType = colorType;
  //     this.colorPalette.value = this.rgbToHex(this.getStyleValue(colorType));
  //     this.colorPalette.click();
  //   }
  // }





  // createStyleNode(text: string, style, styleValue) {
  //   let span = document.createElement('SPAN');
  //   let textNode = document.createTextNode(text);

  //   span.style[style] = styleValue;
  //   span.appendChild(textNode);
  //   return span;
  // }

  // copyEditStyleNode(node, data, style, styleValue) {
  //   let newNode = node.cloneNode();
  //   newNode.appendChild(document.createTextNode(data));
  //   newNode.style[style] = styleValue;

  //   if (newNode.getAttribute('style').length === 0) {
  //     newNode = document.createTextNode(newNode.firstChild.data);
  //   }

  //   return newNode;
  // }

  // setNodeStyle(node, offset, count, style, styleValue, removeStyle) {
  //   // Beginning of node is selected
  //   if (offset === 0 && count < node.length) {
  //     if (removeStyle) {
  //       // Remove style
  //       let newNode = this.copyEditStyleNode(node.parentElement, node.substringData(offset, count), style, null);

  //       node.replaceData(offset, count, '');
  //       node.parentElement.parentElement.insertBefore(newNode, node.parentElement);
  //     } else {
  //       // Copy the style node if a style is already applied
  //       if (node.parentElement.tagName === 'SPAN') {
  //         let styleNode = this.copyEditStyleNode(node.parentElement, node.substringData(offset, count), style, styleValue);
  //         node.replaceData(offset, count, '');
  //         node.parentElement.parentElement.insertBefore(styleNode, node.parentElement);
  //       } else {
  //         // Create style
  //         let styleNode = this.createStyleNode(node.substringData(offset, count), style, styleValue);
  //         node.replaceData(offset, count, '');
  //         node.parentElement.insertBefore(styleNode, node);
  //       }
  //     }


  //     // Whole node is selected
  //   } else if (offset === 0 && count === node.length) {
  //     // There is a style already applied
  //     if (node.parentElement.tagName === 'SPAN') {
  //       // Remove style
  //       if (removeStyle) {
  //         node.parentElement.style[style] = null;

  //         // Remove span if there is no style applied
  //         if (node.parentElement.getAttribute('style').length === 0) {
  //           let textNode = document.createTextNode(node.data);
  //           node.parentElement.replaceWith(textNode);
  //         }
  //       } else {
  //         // Apply style
  //         node.parentElement.style[style] = styleValue;
  //       }
  //     } else {
  //       // Create style
  //       let styleNode = this.createStyleNode(node.data, style, styleValue);
  //       node.replaceWith(styleNode);
  //     }


  //     // End of node is selected
  //   } else if (offset > 0 && node.length - offset === count) {
  //     if (removeStyle) {
  //       // Remove style
  //       let newNode = this.copyEditStyleNode(node.parentElement, node.substringData(offset, count), style, null);

  //       node.replaceData(offset, count, '');
  //       node.parentElement.parentElement.insertBefore(newNode, node.parentElement.nextSibling);
  //     } else {
  //       // Copy the style node if a style is already applied
  //       if (node.parentElement.tagName === 'SPAN') {
  //         let styleNode = this.copyEditStyleNode(node.parentElement, node.substringData(offset, count), style, styleValue);

  //         node.replaceData(offset, count, '');
  //         node.parentElement.parentElement.insertBefore(styleNode, node.parentElement.nextSibling);
  //       } else {
  //         // Create style
  //         let styleNode = this.createStyleNode(node.substringData(offset, count), style, styleValue);
  //         node.replaceData(offset, count, '');
  //         node.parentElement.insertBefore(styleNode, node.nextSibling);
  //       }
  //     }


  //     // Middle of node is selected
  //   } else if (offset > 0 && count < node.length - offset) {
  //     let documentFragment = document.createDocumentFragment(),
  //       midNode,
  //       startNode,
  //       endNode,
  //       newNode;

  //     if (node.parentElement.tagName === 'SPAN') {
  //       newNode = node.parentElement;
  //       startNode = newNode.cloneNode();
  //       startNode.appendChild(document.createTextNode(node.substringData(0, offset)));
  //       midNode = this.copyEditStyleNode(node.parentElement, node.substringData(offset, count), style, removeStyle ? null : styleValue);
  //       endNode = newNode.cloneNode();
  //       endNode.appendChild(document.createTextNode(node.substringData(offset + count, node.length - (offset + count))));
  //     } else {
  //       newNode = node;
  //       startNode = document.createTextNode(node.substringData(0, offset));
  //       midNode = this.createStyleNode(node.substringData(offset, count), style, styleValue);
  //       endNode = document.createTextNode(node.substringData(offset + count, node.length - (offset + count)));
  //     }

  //     documentFragment.appendChild(startNode);
  //     documentFragment.appendChild(midNode);
  //     documentFragment.appendChild(endNode);
  //     newNode.replaceWith(documentFragment);
  //     let selection = document.getSelection();
  //     let range = selection.getRangeAt(0);
  //     range.selectNodeContents(midNode);
  //     // range.deleteContents();
  //     // range.insertNode(midNode);
  //   }
  // }

  // loopChildren(node, range, style, styleValue) {
  //   let clone = node.cloneNode(true);

  //   clone.childNodes.forEach(cloneChild => {
  //     let childNode: any = Array.from(node.childNodes).find((nodeChild: any) => cloneChild.nodeType === 1 ? nodeChild.outerHTML === cloneChild.outerHTML : nodeChild.data === cloneChild.data);

  //     // Start container
  //     if (childNode === range.startContainer) {
  //       this.setNodeStyle(childNode, range.startOffset, childNode.length - range.startOffset, style, styleValue, false);

  //       // In range
  //     } else if (range.isPointInRange(childNode, 0) && childNode.nodeType === 3 && childNode !== range.endContainer) {
  //       this.setNodeStyle(childNode, 0, childNode.length, style, styleValue, false);

  //       // End container
  //     } else if (childNode === range.endContainer) {
  //       this.setNodeStyle(childNode, 0, range.endOffset, style, styleValue, false);
  //     }

  //     // Iterate through the children of this child node
  //     if (childNode.firstChild) {
  //       this.loopChildren(childNode, range, style, styleValue);
  //     }
  //   });
  // }

  // setStyle(style: string, styleValue: string, toggle?: boolean) {
  //   if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.inEditMode) {
  //     let selection = document.getSelection();
  //     let range: Range = selection.getRangeAt(0);

  //     // Single container
  //     if (range.startContainer === range.endContainer) {
  //       this.setNodeStyle(range.startContainer, range.startOffset, range.endOffset - range.startOffset, style, styleValue, false);
  //       // Multiple containers
  //     } else {
  //       // Set the style to all children that are selected
  //       this.loopChildren(this.currentContainer.currentEditBox.content, range, style, styleValue);
  //     }
  //   } else {
  //     if (!toggle) this.currentContainer.currentEditBox.content.style[style] = styleValue;
  //   }
  //   this.currentContainer.currentEditBox.setChange();
  //   this.checkStyles();
  // }



  // checkStyles() {
  //   if (this.currentContainer.currentEditBox.inEditMode) {
  //     this.isBold = this.selectionHasStyle('fontWeight');
  //     this.isItalic = this.selectionHasStyle('fontStyle');
  //     this.isUnderline = this.selectionHasStyle('textDecoration');
  //     this.textColor = this.getStyleValue('color');
  //     this.BackgroundColor = this.getStyleValue('background-color');
  //     // this.getDropdownOption(this.fontSizeDropdown, 'font-size');
  //     // this.getDropdownOption(this.fontDropdown, 'font-family');
  //   } else {
  //     this.isBold = false;
  //     this.isItalic = false;
  //     this.isUnderline = false;
  //   }
  // }

  // cleanContent() {
  //   let nodeList: any = this.currentContainer.currentEditBox.content.firstChild.childNodes;

  //   for (let i = 0; i < nodeList.length; i++) {
  //     // Remove text with no data
  //     if (nodeList[i].nodeType === 3 && nodeList[i].data.length === 0) {
  //       nodeList[i].remove();
  //       i = -1;
  //       continue;
  //     }

  //     // Remove a node with no text
  //     if (nodeList[i].nodeType === 1 && nodeList[i].innerText.length === 0) {
  //       nodeList[i].remove();
  //       i = -1;
  //       continue;
  //     }

  //     // Combine two adjacent text nodes
  //     if (nodeList[i].nodeType === 3 && nodeList[i + 1] && nodeList[i + 1].nodeType === 3) {
  //       nodeList[i].appendData(nodeList[i + 1].data);
  //       nodeList[i + 1].remove();
  //       i = -1;
  //       continue;
  //     }

  //     // combine two adjacent nodes with the same style
  //     if (nodeList[i].nodeType === 1 && nodeList[i + 1] && nodeList[i + 1].nodeType === 1 && nodeList[i].getAttribute('style') === nodeList[i + 1].getAttribute('style') && nodeList[i + 1].innerText.length > 0) {
  //       nodeList[i].innerText += nodeList[i + 1].innerText;
  //       nodeList[i + 1].remove();
  //       i = -1;
  //       continue;
  //     }
  //   }
  // }

  getListNode(node) {
    if (node.nodeType === 1 && (node.firstChild.tagName === 'UL' || node.firstChild.tagName === 'OL')) return node;

    while (node !== this.currentContainer.currentEditBox.content) {
      if (node.tagName === 'UL' || node.tagName === 'OL') {
        return node.parentElement;
      } else {
        node = node.parentElement;
      }
    }
    return null;
  }

  getParentNode(node) {
    while (node.tagName !== 'DIV' && node.tagName !== 'LI') {
      node = node.parentElement;
    }
    return node;
  }

  createList(listType: string) {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.inEditMode) {
      let selection = document.getSelection(),
        range: any = selection.getRangeAt(0),
        list = document.createElement(listType);

      // Set the style of the list
      list.style.marginLeft = '0.5em';
      list.style.marginTop = '0';
      list.style.marginBottom = '0';
      list.style.paddingLeft = '1.3em';

      // Test to see if a list is already selected
      let listNode = this.getListNode(range.commonAncestorContainer);
      if (listNode) {
        // If list type is same as selected, remove list
        if (listNode.firstChild.tagName === listType) {
          this.removeList(listNode);
          return;
        }

        // Select the contents of the list
        let index = Array.from(listNode.parentElement.children).findIndex(x => x === listNode);
        selection.setBaseAndExtent(listNode.parentElement, index, listNode.parentElement, index + 1);
        range = selection.getRangeAt(0);
      }

      // commonAncestorContainer is the edit box content div
      if (range.commonAncestorContainer === this.currentContainer.currentEditBox.content) {
        // If text is selected, reselect their div parents
        if (range.startContainer.nodeType === 3) {
          let startNode = this.getParentNode(range.startContainer);
          let endNode = this.getParentNode(range.endContainer);
          selection.setBaseAndExtent(startNode, 0, endNode, endNode.childNodes.length);
          range = selection.getRangeAt(0);
        }

        // Extract the contents and create the parent div
        let contents = this.removeEmptyTextNodes(range.extractContents()),
          div = document.createElement('DIV');

        for (let i = 0; i < contents.childElementCount; i++) {
          // If the contents are list items, append to the list
          if (contents.children[i].childNodes[0].tagName === 'OL' || contents.children[i].childNodes[0].tagName === 'UL') {
            for (let j = 0; j < contents.children[i].childNodes[0].childElementCount; j++) {
              list.appendChild(contents.children[i].childNodes[0].children[j]);
              j--;
            }
          } else {
            // Create a list element and append the contents
            let listItem = document.createElement('LI');
            while (contents.children[i].childNodes.length > 0) {
              listItem.appendChild(contents.children[i].childNodes[0]);
            }
            list.appendChild(listItem);
          }
        }

        // Append the list to the div and insert the div
        div.appendChild(list);
        range.insertNode(div);

        // Reselect
        range.selectNodeContents(range.commonAncestorContainer.children[range.startOffset]);
      } else {
        // Make sure the parent div is selected
        let node = range.commonAncestorContainer;
        while (node.tagName !== 'DIV') {
          node = node.parentElement;
        }
        range.selectNodeContents(node);

        // Put the contents into a list item
        let listItem = document.createElement('LI');
        listItem.appendChild(this.removeEmptyTextNodes(range.extractContents()));

        // Append the list item into the list and insert the list into the editbox content
        list.appendChild(listItem);
        range.insertNode(list);
      }
    }

    // Remove any empty nodes
    for (let i = 0; i < this.currentContainer.currentEditBox.content.childElementCount; i++) {
      if (this.currentContainer.currentEditBox.content.children[i].childNodes.length === 0) {
        this.currentContainer.currentEditBox.content.children[i].remove();
        i--;
      }
    }


  }

  removeList(node) {
    let selection = document.getSelection();
    selection.selectAllChildren(node);
    let range = selection.getRangeAt(0);
    let contents: any = range.extractContents();

    let documentFragment = document.createDocumentFragment();
    node.remove();



    for (let i = 0; i < contents.firstChild.childElementCount; i++) {
      let div = document.createElement('DIV');
      for (let j = 0; j < contents.firstChild.children[i].childNodes.length; j++) {
        div.appendChild(contents.firstChild.children[i].childNodes[j]);
        j--;
      }

      documentFragment.appendChild(div);

    }

    range.insertNode(documentFragment);
  }

  removeEmptyTextNodes(contents) {
    for (let i = 0; i < contents.childNodes.length; i++) {
      if (contents.childNodes[i].nodeType === 3 && contents.childNodes[i].length === 0) {
        contents.childNodes[i].remove();
        i--;
      } else {
        this.removeEmptyTextNodes(contents.childNodes[i]);
      }
    }

    return contents;
  }

}
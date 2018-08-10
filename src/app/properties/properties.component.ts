import { Component, OnInit, Input, ComponentFactoryResolver } from '@angular/core';
import { TextBoxComponent } from '../text-box/text-box.component';
import { ImageBoxComponent } from '../image-box/image-box.component';
import { EditBoxComponent } from '../edit-box/edit-box.component';
import { ButtonBoxComponent } from '../button-box/button-box.component';
import { ContainerBoxComponent } from '../container-box/container-box.component';
import { Rect } from '../rect';
import { Vector2 } from '../vector2';

@Component({
  selector: 'properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {
  @Input() currentContainer;
  private copied: any = {};

  constructor(private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
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

  setBackgroundColor() {
    if (this.currentContainer && this.currentContainer.currentEditBox && this.currentContainer.currentEditBox.isSelected) {
      let input = document.createElement('input');
      input.type = 'color';
      input.click();
      input.onchange = (event: any) => {
        this.currentContainer.currentEditBox.content.style.backgroundColor = event.path[0].value;
      }
    }
  }

  childHasStyle(parent, style): boolean {
    for (let i = 0; i < parent.children.length; i++) {
      let child = parent.children[i];
      if (child.style && child.style[style].length > 0) {
        return true;
      }
      // child = this.childHasStyle(child, style);
      // if (child) return true;
      // continue;
    }
    return false;
  }

  parentHasStyle(child, style): boolean {
    while (child.parentElement.getAttribute('style')) {
      if (child.parentElement.style[style].length > 0) {
        return true;
      }
      child = child.parentElement;
    }
    return false;
  }

  selectionHasStyle(style, range) {
    // let found;

    if (range.commonAncestorContainer.nodeType === 1 && range.commonAncestorContainer.getAttribute('style') === null) {
      // found = this.childHasStyle(range.cloneContents(), style);

      let parent = range.cloneContents();

      for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        if (child.style && child.style[style].length > 0) {
          return true;
        }
      }


    } else {
      // found = this.parentHasStyle(range.startContainer, style);
      // if (!found && range.startContainer !== range.endContainer) found = this.parentHasStyle(range.endContainer, style);
      // if (!found) found = this.childHasStyle(range.cloneContents(), style);

      if (range.startContainer.parentElement.style[style].length > 0) {
        return true;
      }
    }

    return false;
    // return found;
  }

  setWholeText(range, style, styleValue, contents) {
    range.startContainer.parentElement.style[style] = styleValue;

    if (range.startContainer.parentElement.getAttribute('style').length === 0) {
      contents = range.cloneContents();
      range.startContainer.parentElement.remove();
      range.insertNode(contents);
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
  }

  setMidText(range, style, styleValue, contents, selection) {
    let startString = range.startContainer.substringData(0, range.startOffset),
      endString = range.endContainer.substringData(range.endOffset, range.endContainer.length),
      startSpan = document.createElement('span'), endSpan = document.createElement('span');

    startSpan.setAttribute('style', range.startContainer.parentElement.getAttribute('style'));
    startSpan.appendChild(document.createTextNode(startString));
    endSpan.setAttribute('style', range.startContainer.parentElement.getAttribute('style'));
    endSpan.appendChild(document.createTextNode(endString));

    let tempNode = range.startContainer.parentElement.cloneNode();
    tempNode.style[style] = styleValue;


    contents = range.cloneContents();

    if (tempNode.getAttribute('style').length > 0) {
      tempNode.appendChild(contents);
      contents = document.createDocumentFragment();
      contents.appendChild(tempNode);
    }

    range.startContainer.parentElement.remove();
    contents.insertBefore(startSpan, contents.childNodes[0]);
    contents.insertBefore(endSpan, contents.childNodes[1].nextSibling);
    range.insertNode(contents);

    let node = range.startContainer.childNodes[range.startOffset + 1];
    selection.setBaseAndExtent(node, 0, node, node.nodeType === 1 ? 1 : node.length);
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
      this.setMidText(range, style, styleValue, contents, selection);
      // End text is selected
    } else if (range.startOffset > 0 && range.endOffset === range.startContainer.length) {
      this.setBeginningOrEndText(range, style, styleValue, contents, selection, 1);
    }
  }




  setStyle(style, styleValue) {
    let selection = document.getSelection();
    let range: any = selection.getRangeAt(0);
    let contents;

    if (range.startContainer === range.endContainer) {
      if (this.selectionHasStyle(style, range)) {
        this.setSelectedText(range, style, null, contents, selection);
      } else {
        if (!range.startContainer.parentElement.getAttribute('style')) {
          let span = document.createElement('SPAN');
          span.appendChild(range.extractContents());
          span.style.fontWeight = 'bold';
          contents = span;
          range.insertNode(contents);
        } else {
          this.setSelectedText(range, style, styleValue, contents, selection);
        }
      }
    }










    // if (selection.focusNode.nodeType === 3 && selection.focusNode.parentNode === this.currentContainer.currentEditBox.content.firstChild) {
    //   let span = document.createElement('SPAN');
    //   span.appendChild(range.extractContents());
    //   span.style.fontWeight = 'bold';
    //   contents = span;
    // } else {
    //   if (selection.focusNode.nodeType === 3 && range.cloneContents().childNodes.length === 1) {
    //     let anchorNode = this.currentContainer.currentEditBox.content.firstChild;
    //     let anchorOffset = Array.from(anchorNode.childNodes).findIndex(x => x === selection.focusNode.parentNode) + 1;
    //     let focusNode = selection.focusNode.parentNode;
    //     let focusOffset = 0;
    //     selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
    //     range = selection.getRangeAt(0);
    //   }

    //   contents = range.extractContents();

    //   for (let i = 0; i < contents.childNodes.length; i++) {
    //     if (contents.childNodes[i].length === 0) {
    //       contents.removeChild(contents.childNodes[i]);
    //       i--;
    //     }
    //   }


    //   if (Array.from(contents.childNodes).every((x: any) => x.style && x.style.fontWeight.length > 0)) {
    //     // take off style
    //     for (let i = 0; i < contents.childNodes.length; i++) {
    //       contents.childNodes[i].style.fontWeight = null;
    //       if (contents.childNodes[i].style.length === 0) {
    //         contents.replaceChild(document.createTextNode(contents.childNodes[i].innerText), contents.childNodes[i]);
    //         // i--;
    //       }
    //     }
    //   } else {
    //     // apply style
    //     for (let i = 0; i < contents.childNodes.length; i++) {
    //       if (contents.childNodes[i].nodeType === 3) {
    //         let span = document.createElement('SPAN');
    //         span.appendChild(contents.childNodes[i]);
    //         contents.insertBefore(span, contents.childNodes[i]);
    //       }
    //       contents.childNodes[i].style.fontWeight = 'bold';
    //     }
    //   }



    // }
    // range.insertNode(contents);

    // let nodeList = this.currentContainer.currentEditBox.content.firstChild.childNodes;
    // this.clean(nodeList);
  }






  clean(nodeList) {
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].nodeType === 3 && nodeList[i].data.length === 0) {
        nodeList[i].remove();
        i = -1;
        continue;
        // this.clean(nodeList);
      }

      if (nodeList[i].nodeType === 1 && nodeList[i].innerText.length === 0) {
        nodeList[i].remove();
        i = -1;
        continue;
        // this.clean(nodeList);
      }

      if (nodeList[i].nodeType === 3 && nodeList[i + 1] && nodeList[i + 1].nodeType === 3) {
        nodeList[i].appendData(nodeList[i + 1].data);
        nodeList[i + 1].remove();
        i = -1;
        continue;
        // this.clean(nodeList);
      }

      if (nodeList[i].nodeType === 1 && nodeList[i + 1] && nodeList[i + 1].nodeType === 1 && nodeList[i].getAttribute('style') === nodeList[i + 1].getAttribute('style')) {
        nodeList[i].innerText += nodeList[i + 1].innerText;
        nodeList[i + 1].remove();
        // this.clean(nodeList);
        i = -1;
        continue;
      }

    }
  }


}
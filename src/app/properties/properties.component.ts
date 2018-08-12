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


  selectionHasStyle(style, range) {
    if (range.commonAncestorContainer.nodeType === 1 && range.commonAncestorContainer.getAttribute('style') === null) {
      let parent = range.cloneContents();

      for (let i = 0; i < parent.children.length; i++) {
        let child = parent.children[i];
        if (child.style && child.style[style].length > 0) {
          return true;
        }
      }
    } else {
      if (range.startContainer.parentElement.style[style].length > 0) {
        return true;
      }
    }

    return false;
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

    // Reset selection
    node = range.startContainer.childNodes[range.startOffset].firstChild;
    selection.setBaseAndExtent(node, 0, node, contents.firstChild.length);
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

    // Reset selection
    let node = range.startContainer.childNodes[range.startOffset + 1].firstChild;
    selection.setBaseAndExtent(node, 0, node, node.length);
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

    // Single container
    if (range.startContainer === range.endContainer) {
      // Has this style - remove this style
      if (this.selectionHasStyle(style, range)) {
        this.setSelectedText(range, style, null, contents, selection);
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
          let node: any = selection.focusNode.childNodes[selection.focusOffset - 1].firstChild;
          selection.setBaseAndExtent(node, 0, node, node.length);
        } else {
          // Some other style - Add this style
          this.setSelectedText(range, style, styleValue, contents, selection);
        }
      }
      // Multiple containers
    } else {
      contents = range.extractContents();
      if (Array.from(contents.childNodes).every((x: any) => x.style && x.style[style].length > 0)) {
        // Remove style
        contents.childNodes.forEach((x, i, v) => {
          x.style[style] = null;
          if(x.getAttribute('style').length === 0){
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
    }
    this.clean(this.currentContainer.currentEditBox.content.firstChild.childNodes, selection);
  }


  clean(nodeList, selection) {
    for (let i = 0; i < nodeList.length; i++) {
      // Text with no data
      if (nodeList[i].nodeType === 3 && nodeList[i].data.length === 0) {
        nodeList[i].remove();
        i = -1;
        continue;
      }

      // Node with no text
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
      if (nodeList[i].nodeType === 1 && nodeList[i + 1] && nodeList[i + 1].nodeType === 1 && nodeList[i].getAttribute('style') === nodeList[i + 1].getAttribute('style')) {
        nodeList[i].innerText += nodeList[i + 1].innerText;
        nodeList[i + 1].remove();
        i = -1;
        continue;
      }

    }
  }


}
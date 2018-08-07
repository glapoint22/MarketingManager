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

  setBold() {
    let selection = document.getSelection();
    let range = selection.getRangeAt(0);
    let contents;


    // contents = range.extractContents();








    // if (Array.from(contents.childNodes).every((x: any) => x.nodeType !== 1)) {
    if (selection.focusNode.nodeType === 3 && selection.focusNode.parentNode === this.currentContainer.currentEditBox.content.firstChild) {
      let span = document.createElement('SPAN');
      span.appendChild(range.extractContents());
      span.style.fontWeight = 'bold';
      contents = span;
    } else {
      if (selection.focusNode.nodeType === 3 && range.cloneContents().childNodes.length === 1) {
        let anchorNode = this.currentContainer.currentEditBox.content.firstChild;
        let anchorOffset = Array.from(anchorNode.childNodes).findIndex(x => x === selection.focusNode.parentNode) + 1;
        let focusNode = selection.focusNode.parentNode;
        let focusOffset = 0;
        selection.setBaseAndExtent(anchorNode, anchorOffset, focusNode, focusOffset);
        range = selection.getRangeAt(0);
      }

      contents = range.extractContents();

        for (let i = 0; i < contents.childNodes.length; i++) {
          if (contents.childNodes[i].length === 0) {
            contents.removeChild(contents.childNodes[i]);
            i--;
          }
        }


      if (Array.from(contents.childNodes).every((x: any) => x.style && x.style.fontWeight.length > 0)) {
        // take off style
        for (let i = 0; i < contents.childNodes.length; i++) {
          contents.childNodes[i].style.fontWeight = null;
          if (contents.childNodes[i].style.length === 0) {
            contents.replaceChild(document.createTextNode(contents.childNodes[i].innerText), contents.childNodes[i]);
            // i--;
          }
        }
      } else {
        // apply style
        for (let i = 0; i < contents.childNodes.length; i++) {
          if (contents.childNodes[i].nodeType === 3) {
            let span = document.createElement('SPAN');
            span.appendChild(contents.childNodes[i]);
            contents.insertBefore(span, contents.childNodes[i]);
          }
          contents.childNodes[i].style.fontWeight = 'bold';
        }
      }



    }
    range.insertNode(contents);

  }
}
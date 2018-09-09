import { Style } from "./style";

export class ListStyle extends Style {
    onClick() {
        if (super.onClick()) this.setList();
        return true;
    }

    createList() {
        let contents, list, startContainer, endContainer;

        // Get the contents that will become the list
        this.selectParentNodes();
        contents = this.range.extractContents();

        // Create the list element and style
        list = document.createElement(this.style);
        list.style.marginLeft = '0.5em';
        list.style.marginTop = '0';
        list.style.marginBottom = '0';
        list.style.paddingLeft = '1.3em';

        // Change the contents to a list
        for (let i = 0; i < contents.childElementCount; i++) {
            let listItem = document.createElement('LI');

            for (let j = 0; j < contents.children[i].childElementCount; j++) {
                if (contents.children[i].tagName === 'DIV') {
                    listItem.appendChild(contents.children[i].children[j]);
                } else {
                    list.appendChild(contents.children[i].children[j]);
                }
                j--;
            }
            if (listItem.childElementCount > 0) list.appendChild(listItem);
        }

        this.range.insertNode(list);

        // Set selection
        startContainer = this.editBox.content.children[this.range.startOffset].firstElementChild.firstElementChild.firstChild;
        endContainer = this.editBox.content.children[this.range.endOffset - 1].lastElementChild.lastElementChild.firstChild;
        this.selection.setBaseAndExtent(startContainer, 0, endContainer, endContainer.length);
        this.range = this.selection.getRangeAt(0);
    }

    removeList() {
        let startParentNode = this.getParentNode(this.range.startContainer),
            endParentNode = this.getParentNode(this.range.endContainer),
            startContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === startParentNode),
            endContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === endParentNode);

            let documentFragment = document.createDocumentFragment();

        for (let i = startContainerIndex; i < endContainerIndex + 1; i++) {
            

            for(let j = 0; j < this.editBox.content.children[i].childElementCount; j++){
                let div = document.createElement('DIV');

                for(let k = 0; k < this.editBox.content.children[i].children[j].childElementCount; k++){
                    div.appendChild(this.editBox.content.children[i].children[j].children[k]);
                    k--;
                }

                documentFragment.appendChild(div);
            }

            this.editBox.content.children[i].remove();
            i--;
            endContainerIndex --;
        }

        this.editBox.content.insertBefore(documentFragment, this.editBox.content.children[startContainerIndex]);
    }

    selectionHasStyle() {
        if (this.range.startContainer === this.range.endContainer) {
            return this.range.startContainer.parentElement.parentElement.parentElement.tagName === this.style;
        } else {
            return this.childrenHasStyle(this.editBox.content);
        }
    }

    setList() {
        if (!this.selectionHasStyle()) {
            this.createList();
        } else {
            this.removeList();
        }
    }

    childNodeHasStyle(childNode) {
        return this.getParentNode(childNode).tagName === this.style;
    }

}
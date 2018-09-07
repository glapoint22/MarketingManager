import { Style } from "./style";

export class ListStyle extends Style {
    onClick() {
        if (super.onClick()) this.setList();
        return true;
    }

    createList() {
        let startParentNode = this.getParentNode(this.range.startContainer);
        let endParentNode = this.getParentNode(this.range.endContainer);
        let startContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === startParentNode);
        let endContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === endParentNode);


        this.range.setStart(this.editBox.content, startContainerIndex);
        this.range.setEnd(this.editBox.content, endContainerIndex + 1);

        let contents = this.range.extractContents();

        let list = document.createElement(this.style);
        // Set the style of the list
        list.style.marginLeft = '0.5em';
        list.style.marginTop = '0';
        list.style.marginBottom = '0';
        list.style.paddingLeft = '1.3em';

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

        let startContainer = this.editBox.content.children[this.range.startOffset].firstElementChild.firstElementChild.firstChild;
        let endContainer = this.editBox.content.children[this.range.endOffset - 1].lastElementChild.lastElementChild.firstChild;
        this.selection.setBaseAndExtent(startContainer, 0, endContainer, endContainer.length);
        this.range = this.selection.getRangeAt(0);
    }

    removeList() {

    }

    selectionHasStyle() {
        return false;
    }

    setList() {
        if (!this.selectionHasStyle()) {
            this.createList();
        } else {
            this.removeList();
        }
    }

    getParentNode(node) {
        while (node.tagName !== 'DIV' && node.tagName !== 'OL' && node.tagName !== 'UL') {
            node = node.parentElement;
        }
        return node;
    }
}
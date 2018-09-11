import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ListStyle extends Style {
    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'list';
    }

    onClick() {
        if (this.editBox.inEditMode) {
            Style.setSelection();
            this.setList();
            super.onClick();
        }
    }

    createList() {
        let contents, list, startContainer, endContainer;

        // Get the contents that will become the list
        this.selectParentNodes();
        contents = Style.range.extractContents();

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

        Style.range.insertNode(list);

        // Set selection
        startContainer = this.editBox.content.children[Style.range.startOffset].firstElementChild.firstElementChild.firstChild;
        endContainer = this.editBox.content.children[Style.range.endOffset - 1].lastElementChild.lastElementChild.firstChild;
        Style.selection.setBaseAndExtent(startContainer, 0, endContainer, endContainer.length);
        Style.range = Style.selection.getRangeAt(0);
    }

    removeList() {
        let indices = this.getStartEndIndices(),
            documentFragment = document.createDocumentFragment(),
            elementCount, baseNode, extentNode;

        // Loop through the selected parent elements
        for (let i = indices.startContainerIndex; i < indices.endContainerIndex + 1; i++) {

            // Loop through the list elements
            for (let j = 0; j < this.editBox.content.children[i].childElementCount; j++) {
                let div = document.createElement('DIV');

                // Place the list contents into the new div element
                for (let k = 0; k < this.editBox.content.children[i].children[j].childElementCount; k++) {
                    div.appendChild(this.editBox.content.children[i].children[j].children[k]);
                    k--;
                }

                // Place the new div element into the document fragment
                documentFragment.appendChild(div);
            }

            // Remove the remians
            this.editBox.content.children[i].remove();
            i--;
            indices.endContainerIndex--;
        }

        // Set selection
        elementCount = documentFragment.childElementCount - 1;
        this.editBox.content.insertBefore(documentFragment, this.editBox.content.children[indices.startContainerIndex]);
        baseNode = this.editBox.content.children[indices.startContainerIndex].firstElementChild.firstChild;
        extentNode = this.editBox.content.children[indices.startContainerIndex + elementCount].lastElementChild.firstChild;
        Style.selection.setBaseAndExtent(baseNode, 0, extentNode, extentNode.length);
        Style.range = Style.selection.getRangeAt(0);
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
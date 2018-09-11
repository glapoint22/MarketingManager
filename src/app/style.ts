import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Style {
    public title: string;
    public icon: string;
    public group: string;
    public style: string;
    public styleValue: string;
    public static selection: Selection;
    public static range: any;
    public isSelected: boolean;

    constructor(public editBox: EditBoxComponent) { }

    onClick() {
        this.editBox.checkSelectionForStyles();
    }

    setStyle() {
        if (Style.range.startContainer === Style.range.endContainer) {
            // The selection is within one node
            this.setNodeStyle(Style.range.startContainer, Style.range.startOffset, Style.range.endOffset - Style.range.startOffset);
        } else {
            // The selection spans across multiple nodes
            this.loopChildren(this.editBox.content);
        }
    }

    checkSelection() {
        this.isSelected = this.selectionHasStyle();
    }

    static setSelection() {
        Style.selection = document.getSelection();
        Style.range = Style.selection.getRangeAt(0);
    }

    selectionHasStyle() {
        if (Style.range.startContainer === Style.range.endContainer) {
            // Single container is selected
            return this.childNodeHasStyle(Style.range.startContainer);
        } else {
            // Multiple containers are selected
            return this.childrenHasStyle(this.editBox.content);
        }
    }

    childrenHasStyle(node) {
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];

            // This child node is at the start or within the selection
            if ((childNode === Style.range.startContainer) || (Style.range.isPointInRange(childNode, 0) && childNode.nodeType === 3 && childNode !== Style.range.endContainer)) {
                if (!this.childNodeHasStyle(childNode)) return false;

                //This child node is at the end of the selection
            } else if (childNode === Style.range.endContainer) {
                if (!this.childNodeHasStyle(childNode)) return false;
                return true;
            }

            // Iterate through the children of this child node
            if (childNode.firstChild) {
                let result = this.childrenHasStyle(childNode);
                if (result === true || result === false) {
                    return result;
                }
            }
        }
    }

    childNodeHasStyle(childNode) {
        return childNode.parentElement.style[this.style] === this.styleValue;
    }

    setWholeSelection(node) {
        // Apply style
        node.parentElement.style[this.style] = this.styleValue;
    }

    setBeginningEndSelection(node, offset, count, isEndSelected?) {
        let newNode = this.applyStyle(node.parentElement, node.substringData(offset, count));

        node.replaceData(offset, count, '');
        node.parentElement.parentElement.insertBefore(newNode, isEndSelected ? node.parentElement.nextSibling : node.parentElement);

        // Set selection
        if (Style.range.startContainer === Style.range.endContainer) {
            Style.range.selectNodeContents(newNode.firstChild);
        } else if (node === Style.range.startContainer) {
            Style.range.setStart(newNode.firstChild, 0);
        } else {
            Style.range.setEnd(newNode.firstChild, newNode.firstChild.length);
        }
    }

    setNodeStyle(node, offset, count) {
        // Whole node is selected
        if (offset === 0 && count === node.length) {
            this.setWholeSelection(node);
        }

        // Beginning of node is selected
        else if (offset === 0 && count < node.length) {
            this.setBeginningEndSelection(node, offset, count);
        }


        // Middle of node is selected
        else if (offset > 0 && count < node.length - offset) {
            let documentFragment = document.createDocumentFragment(),
                midNode,
                startNode,
                endNode,
                newNode;

            newNode = node.parentElement;
            startNode = newNode.cloneNode();
            startNode.appendChild(document.createTextNode(node.substringData(0, offset)));
            midNode = this.setMidNodeStyle(node, offset, count);
            endNode = newNode.cloneNode();
            endNode.appendChild(document.createTextNode(node.substringData(offset + count, node.length - (offset + count))));

            documentFragment.appendChild(startNode);
            documentFragment.appendChild(midNode);
            documentFragment.appendChild(endNode);
            newNode.replaceWith(documentFragment);

            Style.range.selectNodeContents(midNode.firstChild);
        }


        // End of node is selected
        else if (offset > 0 && node.length - offset === count) {
            this.setBeginningEndSelection(node, offset, count, true);
        }
    }

    setMidNodeStyle(node, offset, count) {
        return this.applyStyle(node.parentElement, node.substringData(offset, count));
    }

    loopChildren(node) {
        let clone = node.cloneNode(true);

        clone.childNodes.forEach(cloneChild => {
            // Get the next child node
            let childNode: any = Array.from(node.childNodes)
                .find((nodeChild: any) => cloneChild.nodeType === 1 ? nodeChild.outerHTML === cloneChild.outerHTML : nodeChild.data === cloneChild.data);

            // This child node is at the start of the selection
            if (childNode === Style.range.startContainer) {
                this.setNodeStyle(childNode, Style.range.startOffset, childNode.length - Style.range.startOffset);

                // This child node is within the selection
            } else if (Style.range.isPointInRange(childNode, 0) && childNode.nodeType === 3 && childNode !== Style.range.endContainer) {
                this.setNodeStyle(childNode, 0, childNode.length);

                //This child node is at the end of the selection
            } else if (childNode === Style.range.endContainer) {
                this.setNodeStyle(childNode, 0, Style.range.endOffset);
            }

            // Iterate through the children of this child node
            if (childNode.firstChild) {
                this.loopChildren(childNode);
            }
        });
    }


    copyNodeWithNewData(node, newData) {
        let newNode = node.cloneNode();
        newNode.appendChild(document.createTextNode(newData));

        return newNode;
    }

    removeStyle(node, newData) {
        let newNode = this.copyNodeWithNewData(node, newData);

        newNode.style[this.style] = null;
        return newNode;
    }

    applyStyle(node, newData) {
        let newNode = this.copyNodeWithNewData(node, newData);
        newNode.style[this.style] = this.styleValue;

        return newNode;
    }

    getParentNode(node) {
        while (node.tagName !== 'DIV' && node.tagName !== 'OL' && node.tagName !== 'UL') {
            node = node.parentElement;
        }
        return node;
    }

    selectParentNodes() {
        let indices = this.getStartEndIndices();

        Style.range.setStart(this.editBox.content, indices.startContainerIndex);
        Style.range.setEnd(this.editBox.content, indices.endContainerIndex + 1);
    }

    getStartEndIndices() {
        let startParentNode = this.getParentNode(Style.range.startContainer),
            endParentNode = this.getParentNode(Style.range.endContainer),
            startContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === startParentNode),
            endContainerIndex = Array.from(this.editBox.content.children).findIndex(x => x === endParentNode);

        return {
            startContainerIndex: startContainerIndex,
            endContainerIndex: endContainerIndex
        }
    }
}
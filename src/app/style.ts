import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Style {
    public title: string;
    public icon: string;
    public group: string;
    public style: string;
    public styleValue: string;
    public selection: Selection;
    public range: any;

    constructor(public editBox: EditBoxComponent) { }

    setStyle() {
        if (this.editBox.inEditMode) {
            this.setSelection();

            if (this.range.startContainer === this.range.endContainer) {
                // The selection is within one node
                this.setNodeStyle(this.range.startContainer, this.range.startOffset, this.range.endOffset - this.range.startOffset);

            } else {
                // The selection spans across multiple nodes
                this.loopChildren(this.editBox.content);
            }
        } else {
            // if (!toggle) this.currentContainer.currentEditBox.content.style[style] = styleValue;
        }
        // this.currentContainer.currentEditBox.setChange();
        // this.checkStyles();
    }

    setSelection() {
        this.selection = document.getSelection();
        this.range = this.selection.getRangeAt(0);
    }

    selectionHasStyle(node) {
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];

            // This child node is at the start or within the selection
            if ((childNode === this.range.startContainer) || (this.range.isPointInRange(childNode, 0) && childNode.nodeType === 3 && childNode !== this.range.endContainer)) {
                if (childNode.parentElement.style[this.style].length === 0) return false;

                //This child node is at the end of the selection
            } else if (childNode === this.range.endContainer) {
                if (childNode.parentElement.style[this.style].length === 0) return false;
                return true;
            }

            // Iterate through the children of this child node
            if (childNode.firstChild) {
                let result = this.selectionHasStyle(childNode);
                if (result === true || result === false) {
                    return result;
                }
            }
        }
    }

    setWholeSelection(node) {
        if (node.parentElement.tagName === 'SPAN') {
            // Apply style
            node.parentElement.style[this.style] = this.styleValue;
        } else {
            // Create style
            let isStartContainer = node === this.range.startContainer,
                isEndContainer = node === this.range.endContainer,
                newNode: any = this.createNode(node.data);

            node.replaceWith(newNode);

            // Set selection
            if (isStartContainer) {
                this.range.setStart(newNode.firstChild, 0);
            }

            if (isEndContainer) {
                this.range.setEnd(newNode.firstChild, newNode.firstChild.length);
            }
        }
    }

    setBeginningEndSelection(node, offset, count, isEndSelected?) {
        if (node.parentElement.tagName === 'SPAN') {
            // Apply style
            let newNode = this.applyStyle(node.parentElement, node.substringData(offset, count));

            node.replaceData(offset, count, '');
            node.parentElement.parentElement.insertBefore(newNode, isEndSelected ? node.parentElement.nextSibling : node.parentElement);
        } else {
            // Create style
            let newNode: any = this.createNode(node.substringData(offset, count));
            node.replaceData(offset, count, '');
            node.parentElement.insertBefore(newNode, isEndSelected ? node.nextSibling : node);

            // Set selection
            if (node === this.range.startContainer) {
                this.range.setStart(newNode.firstChild, 0);
            } else {
                this.range.setEnd(newNode.firstChild, newNode.firstChild.length);
            }
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

            if (node.parentElement.tagName === 'SPAN') {
                newNode = node.parentElement;
                startNode = newNode.cloneNode();
                startNode.appendChild(document.createTextNode(node.substringData(0, offset)));
                midNode = this.setMidNodeStyle(node, offset, count);
                endNode = newNode.cloneNode();
                endNode.appendChild(document.createTextNode(node.substringData(offset + count, node.length - (offset + count))));
            } else {
                newNode = node;
                startNode = document.createTextNode(node.substringData(0, offset));
                midNode = this.createNode(node.substringData(offset, count));
                endNode = document.createTextNode(node.substringData(offset + count, node.length - (offset + count)));
            }

            documentFragment.appendChild(startNode);
            documentFragment.appendChild(midNode);
            documentFragment.appendChild(endNode);
            newNode.replaceWith(documentFragment);

            this.range.selectNodeContents(midNode.nodeType === 1 ? midNode.firstChild : midNode);
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
            if (childNode === this.range.startContainer) {
                this.setNodeStyle(childNode, this.range.startOffset, childNode.length - this.range.startOffset);

                // This child node is within the selection
            } else if (this.range.isPointInRange(childNode, 0) && childNode.nodeType === 3 && childNode !== this.range.endContainer) {
                this.setNodeStyle(childNode, 0, childNode.length);

                //This child node is at the end of the selection
            } else if (childNode === this.range.endContainer) {
                this.setNodeStyle(childNode, 0, this.range.endOffset);
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

        if (newNode.getAttribute('style').length === 0) {
            newNode = document.createTextNode(newNode.firstChild.data);
        }

        return newNode;
    }

    applyStyle(node, newData) {
        let newNode = this.copyNodeWithNewData(node, newData);
        newNode.style[this.style] = this.styleValue;

        return newNode;
    }

    createNode(data: string) {
        let span = document.createElement('SPAN');
        let textNode = document.createTextNode(data);

        span.style[this.style] = this.styleValue;
        span.appendChild(textNode);
        return span;
    }
}
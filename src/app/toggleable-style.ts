import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ToggleableStyle extends Style {
    private isRemoveStyle: boolean = false;

    constructor(editBox: EditBoxComponent) { super(editBox); }

    setSelection() {
        super.setSelection();
        if (this.range.startContainer === this.range.endContainer) {
            this.isRemoveStyle = this.range.startContainer.parentElement.style[this.style].length > 0;
        } else {
            this.isRemoveStyle = this.selectionHasStyle(this.editBox.content);
        }
    }

    setWholeSelection(node) {
        if (this.isRemoveStyle) {
            node.parentElement.style[this.style] = null;

            // Remove span if there is no style applied
            if (node.parentElement.getAttribute('style').length === 0) {
                let textNode = document.createTextNode(node.data),
                    isStartContainer = node === this.range.startContainer,
                    isEndContainer = node === this.range.endContainer;

                node.parentElement.replaceWith(textNode);

                // Set selection
                if (isStartContainer) {
                    this.range.setStart(textNode, 0);
                }

                if (isEndContainer) {
                    this.range.setEnd(textNode, textNode.length);
                }
            }
        } else {
            super.setWholeSelection(node);
        }
    }

    setBeginningEndSelection(node, offset, count, isEndSelected?) {
        if (this.isRemoveStyle) {
            let newNode = this.removeStyle(node.parentElement, node.substringData(offset, count));

            node.replaceData(offset, count, '');
            node.parentElement.parentElement.insertBefore(newNode, isEndSelected ? node.parentElement.nextSibling : node.parentElement);

            // Set selection
            if (node === this.range.startContainer) {
                this.range.setStart(newNode.nodeType === 1 ? newNode.firstChild : newNode, 0);
            } else {
                newNode = newNode.nodeType === 1 ? newNode.firstChild : newNode;
                this.range.setEnd(newNode, newNode.length);
            }
        } else {
            super.setBeginningEndSelection(node, offset, count, isEndSelected);
        }
    }

    setMidNodeStyle(node, offset, count) {
        if (this.isRemoveStyle) return this.removeStyle(node.parentElement, node.substringData(offset, count));
        return super.setMidNodeStyle(node, offset, count);
    }
}
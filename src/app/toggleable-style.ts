import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ToggleableStyle extends Style {
    private isRemoveStyle: boolean = false;

    constructor(editBox: EditBoxComponent) { super(editBox); }

    setStyle() {
        if (this.editBox.inEditMode) {
            this.selection = document.getSelection();
            this.range = this.selection.getRangeAt(0);

            this.isRemoveStyle = this.selectionHasStyle(this.editBox.content);
            super.setStyle();
        }
    }

    setWholeSelection(node) {
        if (this.isRemoveStyle) {
            node.parentElement.style[this.style] = null;

            // Remove span if there is no style applied
            if (node.parentElement.getAttribute('style').length === 0) {
                let textNode = document.createTextNode(node.data);
                node.parentElement.replaceWith(textNode);
            }
        } else {
            super.setWholeSelection(node);
        }
    }

    setBeginningEndSelection(node, offset, count, isEnd?) {
        if (this.isRemoveStyle) {
            let newNode = this.removeStyle(node.parentElement, node.substringData(offset, count));

            node.replaceData(offset, count, '');
            node.parentElement.parentElement.insertBefore(newNode, isEnd ? node.parentElement.nextSibling : node.parentElement);
        } else {
            super.setBeginningEndSelection(node, offset, count, isEnd);
        }
    }

    setMidNodeStyle(node, offset, count) {
        if (this.isRemoveStyle) return this.removeStyle(node.parentElement, node.substringData(offset, count));
        return super.setMidNodeStyle(node, offset, count);
    }
}
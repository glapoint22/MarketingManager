import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ToggleableStyle extends Style {
    private isRemoveStyle: boolean = false;

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'toggle';
    }

    onClick() {
        if (super.onClick()) this.setStyle();
        return true;
    }

    setSelection() {
        super.setSelection();
        this.isRemoveStyle = this.selectionHasStyle();
    }

    setWholeSelection(node) {
        if (this.isRemoveStyle) {
            node.parentElement.style[this.style] = null;
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
                this.range.setStart(newNode.firstChild, 0);
            } else {
                this.range.setEnd(newNode.firstChild, newNode.firstChild.length);
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
import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ToggleableStyle extends Style {

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'toggle';
    }

    onClick() {
        if (this.editBox.inEditMode) {
            this.setStyle();
            super.onClick();
            this.editBox.onContentChange();
        }
    }

    setWholeSelection(node) {
        if (this.isSelected) {
            node.parentElement.style[this.style] = null;
        } else {
            super.setWholeSelection(node);
        }
    }

    setBeginningEndSelection(node, offset, count, isEndSelected?) {
        if (this.isSelected) {
            let newNode = this.removeStyle(node.parentElement, node.substringData(offset, count));
            this.setNewNode(newNode, node, offset, count, isEndSelected);
        } else {
            super.setBeginningEndSelection(node, offset, count, isEndSelected);
        }
    }

    setMidNodeStyle(node, offset, count) {
        if (this.isSelected) return this.removeStyle(node.parentElement, node.substringData(offset, count));
        return super.setMidNodeStyle(node, offset, count);
    }
}
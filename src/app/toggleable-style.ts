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

            node.replaceData(offset, count, '');
            node.parentElement.parentElement.insertBefore(newNode, isEndSelected ? node.parentElement.nextSibling : node.parentElement);

            // Set selection
            if (node === Style.range.startContainer) {
                Style.range.setStart(newNode.firstChild, 0);
            } else {
                Style.range.setEnd(newNode.firstChild, newNode.firstChild.length);
            }
        } else {
            super.setBeginningEndSelection(node, offset, count, isEndSelected);
        }
    }

    setMidNodeStyle(node, offset, count) {
        if (this.isSelected) return this.removeStyle(node.parentElement, node.substringData(offset, count));
        return super.setMidNodeStyle(node, offset, count);
    }
}
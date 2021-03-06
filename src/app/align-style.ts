import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class AlignStyle extends Style {

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'textAlign';
    }

    onClick() {
        if (this.editBox.inEditMode) {
            Style.setSelection(this.editBox.content);
            this.setStyle();
            super.onClick();
            this.editBox.onContentChange();
        }
    }

    setStyle() {
        let indices = this.getStartEndIndices();

        for (let i = indices.startContainerIndex; i < indices.endContainerIndex + 1; i++) {
            this.editBox.content.children[i].style[this.style] = this.styleValue;
        }
        this.editBox.content.focus();
    }

    checkSelection() {
        let indices = this.getStartEndIndices();

        this.isSelected = true;
        for (let i = indices.startContainerIndex; i < indices.endContainerIndex + 1; i++) {
            if (this.editBox.content.children[i] && this.editBox.content.children[i].style[this.style] !== this.styleValue) {
                this.isSelected = false;
                break;
            }
        }
    }
}
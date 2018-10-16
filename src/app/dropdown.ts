import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Dropdown extends Style {
    public options = [];

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'dropdown';
    }

    onClick(value?) {
        if (this.editBox.inEditMode) {
            this.styleValue = value;
            this.setStyle();
            this.editBox.onContentChange();
        }
    }

    checkSelection() {
        this.styleValue = Style.range.startContainer.parentElement.style[this.style];
        if (!this.selectionHasStyle()) {
            this.styleValue = '';
        }
    }
}

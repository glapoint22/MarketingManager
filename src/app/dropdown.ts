import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Dropdown extends Style {
    public options = [];

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'dropdown';
    }

    onClick(value?) {
        if (super.onClick()) {
            this.styleValue = value;
            this.setStyle();
        }
        return true;
    }

    checkSelection() {
        this.setSelection();
        this.styleValue = this.range.startContainer.parentElement.style[this.style];
        if (!this.selectionHasStyle()) {
            this.styleValue = '';
        }
    }
}

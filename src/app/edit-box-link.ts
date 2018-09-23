import { EditBoxComponent } from "./edit-box/edit-box.component";
import { LinkStyle } from "./link-style";

export class EditBoxLink extends LinkStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.group = 'editBoxLink';
    }

    onClick() {
        this.editBox.link = this.styleValue;
        this.editBox.editBox.nativeElement.title = this.styleValue;
        this.isSelected = true;
    }

    checkSelection() { }
    setSelectedFalse() { }
}

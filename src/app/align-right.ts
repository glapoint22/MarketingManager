import { EditBoxComponent } from "./edit-box/edit-box.component";
import { AlignStyle } from "./align-style";

export class AlignRight extends AlignStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Right align (Ctrl+R)';
        this.icon = 'fas fa-align-right';
        this.style = 'text-align';
        this.styleValue = 'right';
    }
}
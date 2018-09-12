import { EditBoxComponent } from "./edit-box/edit-box.component";
import { AlignStyle } from "./align-style";

export class AlignLeft extends AlignStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Left align (Ctrl+L)';
        this.icon = 'fas fa-align-left';
        this.style = 'text-align';
        this.styleValue = 'left';
    }
}
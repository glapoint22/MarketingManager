import { EditBoxComponent } from "./edit-box/edit-box.component";
import { AlignStyle } from "./align-style";

export class AlignJustify extends AlignStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Justify (Ctrl+J)';
        this.icon = 'fas fa-align-justify';
        this.style = 'text-align';
        this.styleValue = 'justify';
    }
}
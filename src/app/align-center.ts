import { EditBoxComponent } from "./edit-box/edit-box.component";
import { AlignStyle } from "./align-style";

export class AlignCenter extends AlignStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Center align (Ctrl+E)';
        this.icon = 'fas fa-align-center';
        this.style = 'text-align';
        this.styleValue = 'center';
    }
}
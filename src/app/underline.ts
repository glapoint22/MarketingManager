import { EditBoxComponent } from "./edit-box/edit-box.component";
import { ToggleableStyle } from "./toggleable-style";

export class Underline extends ToggleableStyle{
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Underline (Ctrl+U)';
        this.icon = 'fas fa-underline';
        this.style = 'textDecoration';
        this.styleValue = 'underline';
        this.group = 'toggle';
    }
}

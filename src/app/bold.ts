import { EditBoxComponent } from "./edit-box/edit-box.component";
import { ToggleableStyle } from "./toggleable-style";

export class Bold extends ToggleableStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Bold (Ctrl+B)';
        this.icon = 'fas fa-bold';
        this.style = 'fontWeight';
        this.styleValue = 'bold';
    }
}
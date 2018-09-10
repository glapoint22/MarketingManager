import { EditBoxComponent } from "./edit-box/edit-box.component";
import { ToggleableStyle } from "./toggleable-style";

export class Italic extends ToggleableStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Italic (Ctrl+I)';
        this.icon = 'fas fa-italic';
        this.style = 'fontStyle';
        this.styleValue = 'italic';
    }
}
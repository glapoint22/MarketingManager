import { ColorStyle } from "./color-style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class HighlightColor extends ColorStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Highlight color';
        this.icon = 'fas fa-highlighter';
        this.style = 'backgroundColor';
        this.group = 'color';
    }
}

import { ColorStyle } from "./color-style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class TextColor extends ColorStyle {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Text color';
        this.icon = 'fas fa-font';
        this.style = 'color';
        this.group = 'color';
    }
}

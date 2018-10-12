import { ColorStyle } from "./color-style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class BackgroundColor extends ColorStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Background color';
        this.icon = 'fas fa-fill';
        this.style = 'backgroundColor';
        this.group = 'editBoxColor';
    }

    onClick() {
        this.colorPalette.value = this.rgbToHex(this.styleValue);
        this.colorPalette.click();
    }

    setStyle() {
        this.editBox.editBox.nativeElement.style[this.style] = this.editBox.backgroundColor = this.styleValue;
    }

    checkSelection() {}
}

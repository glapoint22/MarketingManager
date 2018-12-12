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
        // this.colorPalette.value = this.rgbToHex(this.styleValue);
        // this.colorPalette.click();
        this.editBox.colorService.colorPicker([this.editBox.editBox.nativeElement], this.style, this.styleValue, () => { this.setStyle() });

    }

    setStyle() {
        this.styleValue = this.editBox.backgroundColor = this.editBox.colorService.newColor;
        this.editBox.onContentChange();
        // this.editBox.editBox.nativeElement.style[this.style] = this.editBox.backgroundColor = this.styleValue;
    }

    checkSelection() { }
}

import { ColorStyle } from "./color-style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class BackgroundColor extends ColorStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Background color';
        this.icon = 'fas fa-fill';
        this.style = 'backgroundColor';
        this.group = 'editBoxColor';
        this.styleValue = '#ffffff';
    }

    onClick() {
        // this.showColor = true;
        this.editBox.editBox.nativeElement.style[this.style] = this.editBox.backgroundColor = this.styleValue;
        this.editBox.colorService.openColorPicker([this.editBox.editBox.nativeElement], this.style, this.styleValue, () => { this.setStyle() });

    }

    setStyle() {
        this.styleValue = this.editBox.backgroundColor = this.editBox.colorService.newColor;
        this.editBox.onContentChange();
        this.showColor = true;
    }

    hideColor() {
        this.showColor = false;
        this.editBox.editBox.nativeElement.style[this.style] = this.editBox.backgroundColor = null;
        this.editBox.onContentChange();
    }

    checkSelection() { }
}
import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ColorStyle extends Style {
    public colorPalette: HTMLInputElement;

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.colorPalette = document.createElement('input');
        this.colorPalette.type = 'color';
        this.colorPalette.onchange = (event: any) => {
            this.styleValue = event.path[0].value;
            this.setStyle();
        }
        this.group = 'color';
    }

    onClick() {
        if (super.onClick()) {
            this.colorPalette.value = this.rgbToHex(this.styleValue);
            this.colorPalette.click();
        }
        return true;
    }

    checkSelection() {
        this.setSelection();
        this.getColorValue();
    }

    getColorValue() {
        let hasColor: boolean = this.range.startContainer.parentElement.style[this.style].length > 0;

        if (!hasColor) {
            this.styleValue = '#00000000';
        } else {
            this.styleValue = this.range.startContainer.parentElement.style[this.style];
            if (!this.selectionHasStyle()) {
                this.styleValue = '#00000000';
            }
        }
    }

    rgbToHex(color) {
        let colorArray = color.replace(/[^\d,]/g, '').split(',');
        return "#" + this.componentToHex(parseInt(colorArray[0])) + this.componentToHex(parseInt(colorArray[1])) + this.componentToHex(parseInt(colorArray[2]));
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}
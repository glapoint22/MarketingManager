import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ColorStyle extends Style {
    public showColor: boolean;
    public defaultColor: string;
    private inPreview: boolean;
    private clonedRange;

    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'color';
    }

    onClick() {
        if (Style.range.collapsed) return;

        let colorElements: Array<HTMLElement> = [];

        // Mark we are in preview mode
        this.inPreview = true;

        // Setting the style will isolate the selection for preview with the color picker
        this.setStyle();

        // Clone the current range and then remove the selection.
        // This is done to see the preview without the selection covering it
        this.clonedRange = Style.range.cloneRange();
        Style.selection.removeAllRanges();

        // Get all elements in the selection and open the color picker
        this.getColorElements(this.editBox.content, colorElements);
        this.editBox.colorService.openColorPicker(colorElements, this.style, this.styleValue, () => { this.setColor() });
    }

    setColor() {
        Style.selection.addRange(this.clonedRange);
        this.inPreview = false;
        this.setElement();
        this.editBox.checkSelectionForStyles();
        this.editBox.onContentChange();
    }

    setElement() {
        if (!this.inPreview) super.setElement();
    }

    getColorElements(node, colorElements) {
        for (let i = 0; i < node.childNodes.length; i++) {
            let childNode = node.childNodes[i];

            if (Style.range.isPointInRange(childNode, 0) && childNode.nodeType === 3) {
                colorElements.push(childNode.parentElement);
            }

            if (childNode.firstChild) {
                this.getColorElements(childNode, colorElements);
            }
        }
    }

    checkSelection() {
        this.getColorValue();
    }

    getColorValue() {
        let hasColor: boolean = Style.range.startContainer.parentElement.style[this.style].length > 0;

        if (!hasColor) {
            this.styleValue = this.defaultColor;
        } else {
            this.styleValue = Style.range.startContainer.parentElement.style[this.style];
            if (!this.selectionHasStyle()) {
                this.styleValue = this.defaultColor;
            }
        }
    }
}
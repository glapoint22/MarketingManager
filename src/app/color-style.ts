import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class ColorStyle extends Style {
    public defaultColor: string;
    private inPreview: boolean;
    private clonedRange;
    private contentSnapShot;
    private selection;


    constructor(editBox: EditBoxComponent) {
        super(editBox);
        this.group = 'color';
        this.defaultColor = '#000000';
    }

    onClick() {
        if (Style.range.collapsed) return;
        let colorElements: Array<HTMLElement> = [];

        this.contentSnapShot = this.editBox.content.cloneNode(true);


        let startParent = this.getParentNode(Style.range.startContainer),
            endParent = this.getParentNode(Style.range.endContainer);

        this.selection = {
            startParentIndex: Array.from(this.editBox.content.children).findIndex(x => x === startParent),
            startChildIndex: Array.from(startParent.children).findIndex(x => x === Style.range.startContainer.parentElement),
            startOffset: Style.range.startOffset,
            endParentIndex: Array.from(this.editBox.content.children).findIndex(x => x === endParent),
            endChildIndex: Array.from(endParent.children).findIndex(x => x === Style.range.endContainer.parentElement),
            endOffset: Style.range.endOffset
        }

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
        this.editBox.colorService.openColorPicker(colorElements, this.style, this.styleValue, () => { this.setColor() }, () => { this.inPreview = false; this.cancelColor() });
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

    cancelColor() {
        for (let i = 0; i < this.editBox.content.childElementCount; i++) {
            this.editBox.content.children[i].remove();
            i--;
        }

        for (let i = 0; i < this.contentSnapShot.childElementCount; i++) {
            this.editBox.content.appendChild(this.contentSnapShot.children[i]);
            i--;
        }

        let baseNode = this.editBox.content.children[this.selection.startParentIndex].children.length > 0 ?
            this.editBox.content.children[this.selection.startParentIndex].children[this.selection.startChildIndex].firstChild :
            this.editBox.content.children[this.selection.startParentIndex].firstChild,
            extentNode = this.editBox.content.children[this.selection.endParentIndex].children.length > 0 ?
                this.editBox.content.children[this.selection.endParentIndex].children[this.selection.endChildIndex].firstChild :
                this.editBox.content.children[this.selection.endParentIndex].firstChild;

        Style.selection.setBaseAndExtent(baseNode, this.selection.startOffset, extentNode, this.selection.endOffset);

        Style.range = Style.selection.getRangeAt(0);
        this.editBox.content.focus();
    }
}
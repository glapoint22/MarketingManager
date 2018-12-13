import { ColorStyle } from "./color-style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class HighlightColor extends ColorStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Highlight color';
        this.icon = 'fas fa-highlighter';
        this.style = 'backgroundColor';
        // this.styleValue = '#ffff00';
        this.defaultColor = null;
    }

    // onClick() {
    //     if (this.styleValue === '#000000') this.styleValue = '#ffff00';
    //     super.onClick();
    // }

    hideColor() {
        this.styleValue = null;
        this.setStyle();
        this.editBox.checkSelectionForStyles();
        this.editBox.onContentChange();
    }

    setColor() {
        super.setColor();
        this.showColor = true;
    }

    // cancelColor(){
    //     if(this.styleValue === '#000000') {
    //         this.styleValue = null;
    //         this.setStyle();
    //     }else{
    //         super.cancelColor();
    //     }
        
    // }
}

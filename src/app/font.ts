import { Dropdown } from "./dropdown";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Font extends Dropdown {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Font';
        this.style = 'fontFamily';
        this.options = [
            { value: 'Arial, Helvetica, sans-serif', name: 'Arial' },
            { value: '"Times New Roman", Times, serif', name: 'Times New Roman' },
            { value: '"Courier New", Courier, monospace', name: 'Courier New' },
            { value: 'Verdana, Geneva, Tahoma, sans-serif', name: 'Verdana' },
            { value: '"Comic Sans MS", "Comic Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif', name: 'Comic Sans MS' },
            { value: '"Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial, sans-serif', name: 'Trebuchet MS' },
            { value: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif', name: 'Impact' },
        ]
    }
}
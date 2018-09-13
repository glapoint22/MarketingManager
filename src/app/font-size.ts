import { Dropdown } from "./dropdown";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class FontSize extends Dropdown {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Font size';
        this.style = 'fontSize';
        this.options = [
            { value: '8px', name: '8' },
            { value: '9px', name: '9' },
            { value: '10px', name: '10' },
            { value: '11px', name: '11' },
            { value: '12px', name: '12' },
            { value: '14px', name: '14' },
            { value: '16px', name: '16' },
            { value: '18px', name: '18' },
            { value: '24px', name: '24' },
            { value: '30px', name: '30' },
            { value: '36px', name: '36' },
            { value: '48px', name: '48' },
            { value: '60px', name: '60' },
            { value: '72px', name: '72' },
            { value: '96px', name: '96' },
        ]
    }
}

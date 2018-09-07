import { EditBoxComponent } from "./edit-box/edit-box.component";
import { ListStyle } from "./list-style";


export class UnorderedList extends ListStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Unordered list';
        this.icon = 'fas fa-list-ul';
        this.style = 'UL';
        this.group = 'list';
    }
}
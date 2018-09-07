import { EditBoxComponent } from "./edit-box/edit-box.component";
import { ListStyle } from "./list-style";


export class OrderedList extends ListStyle {
    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Ordered list';
        this.icon = 'fas fa-list-ol';
        this.style = 'OL';
        this.group = 'list';
    }
}
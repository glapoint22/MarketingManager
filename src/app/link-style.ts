import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class LinkStyle extends Style {

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Link (Ctrl+L)';
        this.icon = 'fas fa-link';
        this.group = 'link';
    }

    onClick() {
        if (this.editBox.inEditMode) {
            this.setStyle();
            super.onClick();
        }
    }

    setMidNodeStyle(node, offset, count) {
        let anchor = document.createElement('A');
        anchor.setAttribute('href', 'https://www.nicheShack.com');
        anchor.setAttribute('style', node.parentElement.getAttribute('style'));
        anchor.appendChild(document.createTextNode(node.substringData(offset, count)));
        return anchor;
    }


    setWholeSelection(node) {
        let anchor = document.createElement('A');
        anchor.setAttribute('href', 'https://www.nicheShack.com');
        anchor.setAttribute('style', node.parentElement.getAttribute('style'));
        anchor.appendChild(document.createTextNode(node.data));


        node.parentElement.replaceWith(anchor);

        Style.range.selectNodeContents(anchor.firstChild);
    }

    applyStyle(node, newData) {
        let anchor = document.createElement('A');
        anchor.setAttribute('href', 'https://www.nicheShack.com');
        anchor.setAttribute('style', node.getAttribute('style'));
        anchor.appendChild(document.createTextNode(newData));
        return anchor;
    }
}

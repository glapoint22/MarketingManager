import { Style } from "./style";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class LinkStyle extends Style {
    public showLinkOptions: boolean = false;
    private linkInput;

    constructor(editBox: EditBoxComponent) {
        super(editBox);

        this.title = 'Link (Ctrl+L)';
        this.icon = 'fas fa-link';
        this.group = 'link';
    }

    onClick() {
        if (this.editBox.inEditMode) {
            // this.setStyle();
            // super.onClick();
            this.showLinkOptions = true;

            

            window.setTimeout(() => {
                let iframeLink: any = document.getElementById('iframeLink');

                let interval = window.setInterval(() => {
                    if(iframeLink.contentDocument.childElementCount > 0){
                        window.clearInterval(interval);
                        this.linkInput = iframeLink.contentDocument.getElementById('link');
                    }
                    
                  }, 1);

                
              }, 1);
            
        }
    }

    setMidNodeStyle(node, offset, count) {
        return this.createAnchor(node.parentElement, node.substringData(offset, count));
    }


    setWholeSelection(node) {
        let anchor: any = this.createAnchor(node.parentElement, node.data);

        if (Style.range.startContainer === Style.range.endContainer || (node !== Style.range.startContainer && node !== Style.range.endContainer)) {
            node.parentElement.replaceWith(anchor);

            if (Style.range.startContainer === Style.range.endContainer) Style.range.selectNodeContents(anchor.firstChild);
        } else {
            if (node === Style.range.startContainer) {
                node.parentElement.parentElement.insertBefore(anchor, node.parentElement.nextElementSibling);
                node.parentElement.remove();
                Style.range.setStart(anchor.firstChild, 0);
            } else {
                node.parentElement.parentElement.insertBefore(anchor, node.parentElement);
                node.parentElement.remove();
                Style.range.setEnd(anchor.firstChild, anchor.firstChild.length);
            }
        }
    }

    applyStyle(node, newData) {
        return this.createAnchor(node, newData);
    }

    createAnchor(node, data) {
        let anchor = document.createElement('A');

        anchor.setAttribute('href', this.styleValue);
        anchor.setAttribute('style', node.getAttribute('style'));
        anchor.appendChild(document.createTextNode(data));
        return anchor;
    }
}

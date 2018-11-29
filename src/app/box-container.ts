import { Container } from "./container";
import { ViewContainerRef } from "@angular/core";
import { Rect } from "./rect";
import { ContainerBoxComponent } from "./container-box/container-box.component";

export class BoxContainer extends Container {
    constructor(viewContainerRef: ViewContainerRef, public containerBox: ContainerBoxComponent) { super(viewContainerRef) }

    setHeight() {
        // If container has any boxes
        if (this.boxes.length > 0) {
            let yMax = Math.max(...this.boxes.map(x => x.rect.yMax));

            this.containerBox.handle = '';
            this.containerBox.setRect(() => {
                return new Rect(this.containerBox.rect.x, this.containerBox.rect.y, this.containerBox.rect.width, Math.max(this.containerBox.fixedHeight, yMax));
            });

            this.height = this.containerBox.rect.height;
            this.containerBox.container.setHeight();

            // Container has no boxes
        } else {
            this.containerBox.container.setHeight();
        }
    }
}
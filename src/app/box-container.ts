import { Container } from "./container";
import { ViewContainerRef } from "@angular/core";
import { Rect } from "./rect";
import { ContainerBoxComponent } from "./container-box/container-box.component";
import { Row } from "./row";
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class BoxContainer extends Container {
    constructor(viewContainerRef: ViewContainerRef, view: HTMLElement, public containerBox: ContainerBoxComponent) { super(viewContainerRef, view) }

    setHeight() {
        // If container has any boxes
        if (this.boxes.length > 0) {
            let yMax = Math.max(...this.boxes.map(x => x.rect.yMax));

            this.containerBox.handle = '';
            this.containerBox.setRect(() => {
                return new Rect(this.containerBox.rect.x, this.containerBox.rect.y, this.containerBox.rect.width, Math.max(this.containerBox.fixedHeight, yMax));
            });

            this.height = this.containerBox.rect.height;
            this.containerBox.row.setYMax();
            // Set the parent's height
            this.containerBox.container.setHeight();

            // Container has no boxes
        } else {
            // Set the parent's height
            this.containerBox.container.setHeight();
        }

        // Set the yMax of the last row from the parent
        this.containerBox.container.rows[this.containerBox.container.rows.length - 1].setYMax();
    }


    moveRowsUp(distance: number) {
        this.rows.forEach((row: Row) => {
            let currentY = row.y;

            row.y -= distance;
            row.y = Math.max(0, row.y);
            row.rowElement.style.top = row.y + 'px';

            if (row.y === 0) {
                distance = currentY;
            }

            // Move all the boxes up
            row.boxes.forEach((box: EditBoxComponent) => {
                box.rect.y = row.y;
                box.setElement();
            });
            row.setYMax();
        });
    }
}
import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Row {
    public boxes: Array<EditBoxComponent> = [];
    public alignment: string = 'center';

    constructor(public y: number, public yMax: number) { }

    alignBoxes() {
        switch (this.alignment) {
            case 'left':
                this.alignBoxesLeft();
                break;
            case 'center':
                this.alignBoxesCenter();
                break;
            case 'right':
                this.alignBoxesRight();
                break;
        }
    }

    alignBoxesLeft() {
        let sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(),
            currentX: number = 0;

        // Align the boxes left
        sortedBoxes.forEach((sortedBox: EditBoxComponent) => {
            let box: EditBoxComponent = this.getBox(sortedBox);

            box.rect.x = currentX;
            box.setElement();
            currentX = box.rect.xMax;
        });
    }

    getBoxesWidth() {
        let boxesWidth: number = 0;

        // Get the combined width from all the boxes
        this.boxes.forEach((box: EditBoxComponent) => {
            boxesWidth += box.rect.width;
        });
        return boxesWidth;
    }

    getCenterX(width: number) {
        return (this.boxes[0].container.width * 0.5) - (width * 0.5);
    }

    alignBoxesCenter() {
        let boxesWidth: number = this.getBoxesWidth(),
            sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(),
            currentX: number = this.getCenterX(boxesWidth);

        // Align the boxes center
        sortedBoxes.forEach((sortedBox: EditBoxComponent) => {
            let box: EditBoxComponent = this.getBox(sortedBox);

            box.rect.x = currentX;
            box.setElement();
            currentX = box.rect.xMax;
        });
    }

    alignBoxesRight() {
        let sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(),
            currentX: number = this.boxes[0].container.width;

        // Align the boxes right
        for (let i = sortedBoxes.length - 1; i > -1; i--) {
            let box: EditBoxComponent = this.getBox(sortedBoxes[i]);

            box.rect.x = currentX - box.rect.width;
            box.setElement();
            currentX = box.rect.x;
        }
    }

    getBox(box: EditBoxComponent): EditBoxComponent {
        return this.boxes.find(x => x.rect === box.rect);
    }

    sortBoxes(): Array<EditBoxComponent> {
        let sortedBoxes = this.boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
            if (a.rect.x > b.rect.x) return 1;
            return -1;
        });

        return sortedBoxes;
    }

    shiftBoxesRightAtPoint(point: number, shiftAmount: number) {
        let sortedBoxes = this.sortBoxes();

        for (let i = sortedBoxes.length - 1; i > -1; i--) {
            if (sortedBoxes[i].rect.x >= point) {
                let box = this.getBox(sortedBoxes[i]);
                box.rect.x = box.rect.x + shiftAmount;
                box.setElement();
            }
        }
    }

    shiftBoxesLeftAtPoint(point: number, shiftAmount: number) {
        let sortedBoxes = this.sortBoxes();

        for (let i = 0; i < sortedBoxes.length; i++) {
            if (sortedBoxes[i].rect.xMax <= point + shiftAmount) {
                let box = this.getBox(sortedBoxes[i]);
                box.rect.x = box.rect.x - shiftAmount;
                box.setElement();
            }
        }
    }

    removeBox(box: EditBoxComponent) {
        let boxIndex = this.boxes.findIndex(x => x === box);
        this.boxes.splice(boxIndex, 1);
    }
}
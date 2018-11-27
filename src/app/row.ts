import { EditBoxComponent } from "./edit-box/edit-box.component";

export class Row {

    constructor(public alignment: string, public boxes: Array<EditBoxComponent>, public y: number, public yMax: number) { }

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

    alignBoxesCenter() {
        let boxesWidth: number = 0,
            sortedBoxes: Array<EditBoxComponent> = this.sortBoxes(),
            currentX: number;

        // Get the combined width from all the boxes
        sortedBoxes.forEach((box: EditBoxComponent) => {
            boxesWidth += box.rect.width;
        });

        // Calculate the starting x
        currentX = (this.boxes[0].containerWidth * 0.5) - (boxesWidth * 0.5);

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
            currentX: number = this.boxes[0].containerWidth;

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
}
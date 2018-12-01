import { ViewContainerRef } from "@angular/core";
import { EditBoxComponent } from "./edit-box/edit-box.component";
import { Row } from "./row";

export class Container {
  public boxes: Array<EditBoxComponent> = [];
  public rows: Array<Row> = [];
  public currentRow: Row;
  public width: number;
  public height: number;

  constructor(public viewContainerRef: ViewContainerRef) { }

  setHeight() {
    // If container has any boxes
    if (this.boxes.length > 0) {
      // If every box has a rect
      if (this.boxes.every((box: EditBoxComponent) => box.rect !== undefined)) {
        this.height = Math.max(...this.boxes.map(x => x.rect.yMax));

        // Wait until all boxes have their rects
      } else {
        this.height = 40;
        let interval = window.setInterval(() => {
          if (this.boxes.every((box: EditBoxComponent) => box.rect !== undefined)) {
            this.setHeight();
            window.clearInterval(interval);
          }
        }, 1);
      }

      // Container has no boxes
    } else {
      this.height = 40;
    }
  }

  moveRowsDown(startingRowIndex) {
    // Loop through all the rows and see if we need to move them down
    for (let i = startingRowIndex; i < this.rows.length; i++) {
      let currentRow = this.rows[i],
        previousRow = this.rows[i - 1];

      // Test to see if we need to move this current row down
      if (currentRow.y < previousRow.yMax) {
        // Set the new y for the row
        currentRow.y = previousRow.yMax;

        // Move all the boxes in this row
        for (let j = 0; j < currentRow.boxes.length; j++) {
          let box = currentRow.boxes[j];
          box.rect.y = currentRow.y;
          box.setElement();
        }

        // Set the new ymax
        currentRow.yMax = Math.max(...currentRow.boxes.map(x => x.rect.yMax));

      } else {
        break;
      }
    }
  }

  sortRows() {
    let sortedRows = this.rows.sort((a, b) => {
      if (a.y > b.y) return 1;
      return -1;
    });

    return sortedRows;
  }

  removeRow(row: Row) {
    let rowIndex = this.rows.findIndex(x => x === row);
    this.rows.splice(rowIndex, 1);
  }

  deleteBox(box: EditBoxComponent) {
    let boxIndex = this.boxes.findIndex(x => x === box),
      row = box.row;

    this.boxes.splice(boxIndex, 1);

    if (row.boxes.length === 1) {
      // No boxes in this row so remove the row
      this.removeRow(row);
    } else {
      // Reset this row's yMax and re-align
      row.yMax = Math.max(...row.boxes.map(x => x.rect.yMax));
      row.alignBoxes();
    }
  }

  addRow(alignment: string, y: number): Row{
    this.rows.push(new Row(alignment, y));
    let newRow: Row = this.rows[this.rows.length - 1];
    this.sortRows();

    return newRow;
  }

}
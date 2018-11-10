import { Injectable, ViewContainerRef } from '@angular/core';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { Vector2 } from './vector2';
import { ContainerBoxComponent } from './container-box/container-box.component';
import { Rect } from './rect';
import { EditBoxService } from './edit-box.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private editBoxService: EditBoxService) { }

  createTable(parent: HTMLElement, boxes?: Array<EditBoxComponent>, maxWidth?: number, align?: string, bgColor?: string, display?: string, height?: number) {
    let table: HTMLTableElement = parent.appendChild(document.createElement('table'));

    // Set the table properties
    table.width = '100%';
    table.cellPadding = '0';
    table.cellSpacing = '0';
    table.border = '0';

    // Set the optional properties
    if (maxWidth) table.style.maxWidth = maxWidth + 'px';
    if (align) table.align = align;
    if (bgColor) table.bgColor = bgColor;
    if (display) table.style.display = display;

    // If this table has boxes
    if (boxes && boxes.length > 0) {
      // Create rows based on the boxes position
      let rows = this.createRows(boxes, table, new Vector2(0, 0));

      // Loop through each row
      rows.forEach((row, i, array) => {
        let column: HTMLTableColElement = row.element.appendChild(document.createElement('td')),
          paddingTop = (row.boxes[0].rect.y - row.y);

        // Set the column properties
        column.style.paddingLeft = '0';
        column.style.paddingRight = '0';
        column.style.paddingBottom = '0';
        column.style.paddingTop = paddingTop + 'px';
        // column.style.textAlign = 'center';
        column.align = 'center';
        column.style.fontSize = '0';
        // column.style.verticalAlign = 'top';
        column.vAlign = 'top';

        // Set the column height
        if (i === array.length - 1 && height) {
          column.style.height = row.height + height - (row.y + row.height) - paddingTop + 'px';
        }

        // Sort the boxes horizontally
        let sortedBoxes = row.boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
          if (a.rect.x > b.rect.x) return 1;
          return -1;
        });

        // Loop through each box
        sortedBoxes.forEach((currentBox) => {
          let box = this.getBox(row.boxes, currentBox);
          let foo: HTMLElement;

          if (sortedBoxes.length > 1) {
            foo = column.appendChild(document.createElement('DIV'));
            foo.style.width = '100%';
            foo.style.maxWidth = box.rect.width + 'px';
            foo.style.display = 'inline-block';
          } else {
            foo = column;
          }

          // Box is container
          if (box instanceof ContainerBoxComponent) {
            let containerBox = box as ContainerBoxComponent;

            containerBox.boxToTable(this.createTable(foo, containerBox.container.boxes, containerBox.rect.width, null, containerBox.backgroundColor, null, containerBox.rect.height));

            // Box is text, button, or image
          } else {
            box.boxToTable(this.createTable(foo, null, box.rect.width));
          }
        });
      });
    }
    return table;
  }

  getBox(boxes: Array<EditBoxComponent>, box: EditBoxComponent) {
    return boxes.find(x => x.rect === box.rect)
  }

  createRows(boxes: Array<EditBoxComponent>, table: HTMLTableElement, position: Vector2) {
    let rows = [], currentRow, j;

    // Sort the boxes vertically
    let sortedBoxes = boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.y > b.rect.y) return 1;
      return -1;
    });

    // Create the first row based on the top box
    rows.push({
      boxes: [this.getBox(boxes, sortedBoxes[0])],
      element: table.appendChild(document.createElement('tr')),
      x: position.x,
      y: position.y,
      width: table.clientWidth,
      height: sortedBoxes[0].rect.yMax - position.y
    });
    currentRow = rows[0];

    // See if any other box belongs to this row
    for (let i = 1; i < sortedBoxes.length; i++) {
      for (j = 0; j < currentRow.boxes.length; j++) {
        if (sortedBoxes[i].rect.y < currentRow.boxes[j].rect.yMax) {
          currentRow.boxes.push(this.getBox(boxes, sortedBoxes[i]));
          currentRow.height = Math.max(currentRow.height, sortedBoxes[i].rect.yMax - currentRow.y);
          break;
        }
      }

      // Create a new row
      if (j === currentRow.boxes.length) {
        rows.push({
          boxes: [this.getBox(boxes, sortedBoxes[i])],
          element: table.appendChild(document.createElement('tr')),
          x: position.x,
          y: currentRow.height + currentRow.y,
          width: table.clientWidth,
          height: sortedBoxes[i].rect.yMax - (currentRow.height + currentRow.y)
        });
        currentRow = rows[rows.length - 1];
      }
    }

    return rows;
  }




  // createColumns(row, parent: HTMLElement) {
  //   let columns = [], currentColumn, j, sortedBoxes: Array<EditBoxComponent>;

  //   // Sort the boxes horizontally
  //   sortedBoxes = row.boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
  //     if (a.rect.x > b.rect.x) return 1;
  //     return -1;
  //   });


  //   // Create the first column based on the most left box
  //   columns.push({
  //     boxes: [this.getBox(row.boxes, sortedBoxes[0])],
  //     element: parent.appendChild(document.createElement('td')),
  //     x: row.x,
  //     y: row.y,
  //     width: sortedBoxes[0].rect.xMax - row.x,
  //     height: row.height
  //   });
  //   currentColumn = columns[0];

  //   // See if any other box belongs to this column
  //   for (let i = 1; i < sortedBoxes.length; i++) {
  //     for (j = 0; j < currentColumn.boxes.length; j++) {
  //       if (sortedBoxes[i].rect.x < currentColumn.boxes[j].rect.xMax) {
  //         currentColumn.boxes.push(this.getBox(row.boxes, sortedBoxes[i]));
  //         currentColumn.width = Math.max(currentColumn.width, sortedBoxes[i].rect.xMax - currentColumn.x);
  //         break;
  //       }
  //     }

  //     // Create a new column
  //     if (j === currentColumn.boxes.length) {
  //       columns.push({
  //         boxes: [this.getBox(row.boxes, sortedBoxes[i])],
  //         element: parent.appendChild(document.createElement('td')),
  //         x: currentColumn.width + currentColumn.x,
  //         y: row.y,
  //         width: sortedBoxes[i].rect.xMax - (currentColumn.width + currentColumn.x),
  //         height: row.height
  //       });
  //       currentColumn = columns[columns.length - 1];
  //     }
  //   }

  //   // Set the last column's width
  //   if (columns.length > 1) {
  //     currentColumn.width = row.width - currentColumn.x;
  //   } else {
  //     currentColumn.width = row.width;
  //   }

  //   return columns;
  // }

  tableToBox(table: HTMLTableElement, container: ViewContainerRef) {
    if (table.summary !== '') {
      let rect = this.getRect(table.summary, table.summary.indexOf('-') + 1);

      // Text box
      if (table.summary.substr(0, 7) === 'textBox') {
        let content = document.createElement('div');

        Array.from(table.rows).forEach(row => {
          let rowContent;
          if (row.firstElementChild.firstElementChild.tagName === 'OL' || row.firstElementChild.firstElementChild.tagName === 'UL') {
            rowContent = row.firstElementChild.firstElementChild;
            rowContent.setAttribute('style', row.firstElementChild.firstElementChild.getAttribute('style'));
            rowContent.innerHTML = row.firstElementChild.firstElementChild.innerHTML;
          } else {
            rowContent = document.createElement('div');
            rowContent.setAttribute('style', row.firstElementChild.getAttribute('style'));
            rowContent.innerHTML = row.firstElementChild.innerHTML;
          }
          content.appendChild(rowContent);
        });

        let boxData = {
          content: content.innerHTML,
          backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }
        EditBoxComponent.currentContainer = container;
        table.style.width = boxData.rect.width + 'px';
        table.style.height = boxData.rect.height + 'px';
        this.editBoxService.createTextBox(boxData);

        // Container box
      } else if (table.summary.substr(0, 12) === 'containerBox') {
        let boxData = {
          backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3])
        }

        EditBoxComponent.currentContainer = container;
        this.editBoxService.createContainerBox(boxData);
        container = EditBoxComponent.currentContainer;

        // Button box
      } else if (table.summary.substr(0, 9) === 'buttonBox') {
        let boxData = {
          content: table.getElementsByTagName('table')[0].rows[0].firstElementChild.innerHTML,
          backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          link: table.getElementsByTagName('a')[0].getAttribute('href')
        }
        EditBoxComponent.currentContainer = container;
        this.editBoxService.createButtonBox(boxData);

        // Image box
      } else if (table.summary.substr(0, 8) === 'imageBox') {
        let anchor = table.getElementsByTagName('a');

        let boxData = {
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          link: anchor.length > 0 ? anchor[0].getAttribute('href') : null,
          src: table.getElementsByTagName('img')[0].getAttribute('src')
        }
        EditBoxComponent.currentContainer = container;

        table.style.width = boxData.rect.width + 'px';
        table.style.height = boxData.rect.height + 'px';
        this.editBoxService.createImageBox(boxData);
      }
    }

    Array.from(table.rows).forEach((row: HTMLTableRowElement) => {
      Array.from(row.children).forEach((td: HTMLTableColElement) => {
        if (td.firstElementChild && (td.firstElementChild.tagName === 'TABLE' || td.firstElementChild.tagName === 'DIV')) {
          Array.from(td.children).forEach((child: any) => {
            let childTable: HTMLTableElement = child.tagName === 'TABLE' ? child : child.firstElementChild as HTMLTableElement;
            this.tableToBox(childTable, container);
          });
        }
      });
    });
  }


  getRect(summary: string, index: number, rect: Array<number> = []) {
    let nextIndex = summary.indexOf('-', index);
    if (nextIndex === -1) nextIndex = summary.length;

    rect.push(parseFloat(summary.substr(index, nextIndex - index)));
    if (nextIndex === summary.length) return rect;
    return this.getRect(summary, nextIndex + 1, rect);
  }


}
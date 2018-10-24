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

  createTable(parent: HTMLElement, width: string, boxes?: Array<EditBoxComponent>, position?: Vector2, maxWidth?: string, align?: string, bgColor?: string) {
    let table: HTMLTableElement = parent.appendChild(document.createElement('table'));

    // Set the table properties
    table.width = width;
    table.cellPadding = '0';
    table.cellSpacing = '0';
    table.border = '0';

    // Set the optional properties
    if (maxWidth) table.style.maxWidth = maxWidth;
    if (align) table.align = align;
    if (bgColor) table.bgColor = bgColor;

    // If this table has boxes
    if (boxes && boxes.length > 0) {
      // Create rows based on the boxes position
      let rows = this.createRows(boxes, table, new Vector2(position ? position.x : 0, position ? position.y : 0));

      // Loop through each row
      rows.forEach(row => {
        // Create the columns for this row
        let parent: HTMLElement = rows.length > 1 ? this.createTable(row.element.appendChild(document.createElement('td')), '100%').appendChild(document.createElement('tr')) : row.element,
          columns = this.createColumns(row, parent);

        // Loop through each column
        columns.forEach((column) => {
          // Set the column properties
          let columnWidth = column.width / row.width * 100 + '%';

          if (columnWidth !== '100%') {
            column.element.vAlign = 'top';
            column.element.width = columnWidth;
          }


          // If this colum has 4 or more boxes, this means there are uneven columns and rows
          if (column.boxes.length >= 4) {

          } else if (column.boxes.length > 1) {
            // Group the boxes into another table if there are more than one box
            this.createTable(column.element, '100%', column.boxes, new Vector2(column.x, column.y));
          } else {
            // Set this box
            let box: EditBoxComponent = column.boxes[0],
              boxTableColumn = column.element;

            // If the box has a left or top margin
            if (box.rect.x > 0 || box.rect.y > 0) {
              let leftMarginWidth = (box.rect.x - column.x) / column.width * 100,
                boxTableContainerWidth = 100 - leftMarginWidth,
                topMarginHeight = box.rect.y - column.y,
                containerTable = this.createTable(column.element, '100%');

              // If the box as a top margin
              if (box.rect.y > 0) {
                let blankRow = containerTable.appendChild(document.createElement('tr'));

                // Create a td for the left margin and height
                if (leftMarginWidth > 0) {
                  let leftMargin = blankRow.appendChild(document.createElement('td'));
                  leftMargin.width = leftMarginWidth + '%';
                  leftMargin.height = topMarginHeight.toString();
                }

                // Create a blank td for the height
                let blankTd = blankRow.appendChild(document.createElement('td'));
                blankTd.width = boxTableContainerWidth + '%';
                blankTd.height = topMarginHeight.toString();
              }

              // Create a row for the boxTable
              let tr = containerTable.appendChild(document.createElement('tr'));

              // Create a td for the left margin 
              if (box.rect.x > 0) {
                tr.appendChild(document.createElement('td')).width = leftMarginWidth + '%';
              }

              // Create a column for the boxTable
              boxTableColumn = tr.appendChild(document.createElement('td'));
              boxTableColumn.width = boxTableContainerWidth + '%';
            }


            if (box instanceof ContainerBoxComponent) {
              let containerBox = box as ContainerBoxComponent;
              let boxTable = this.createTable(boxTableColumn, box.rect.width / boxTableColumn.offsetWidth * 100 + '%');
              boxTable.bgColor = box.backgroundColor;
              boxTable.summary = containerBox.getTableRect('containerBox');


              let td = boxTable.appendChild(document.createElement('tr')).appendChild(document.createElement('td'));
              td.width = '100%';
              td.height = containerBox.rect.height.toString();
              td.vAlign = 'top';


              this.createTable(td, '100%', containerBox.container.boxes);

            } else {
              box.boxToTable(this.createTable(boxTableColumn, box.rect.width / boxTableColumn.offsetWidth * 100 + '%'));
            }
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




  createColumns(row, parent: HTMLElement) {
    let columns = [], currentColumn, j, sortedBoxes: Array<EditBoxComponent>;

    // Sort the boxes horizontally
    sortedBoxes = row.boxes.map(x => Object.assign({}, x)).sort((a: EditBoxComponent, b: EditBoxComponent) => {
      if (a.rect.x > b.rect.x) return 1;
      return -1;
    });


    // Create the first column based on the most left box
    columns.push({
      boxes: [this.getBox(row.boxes, sortedBoxes[0])],
      element: parent.appendChild(document.createElement('td')),
      x: row.x,
      y: row.y,
      width: sortedBoxes[0].rect.xMax - row.x,
      height: row.height
    });
    currentColumn = columns[0];

    // See if any other box belongs to this column
    for (let i = 1; i < sortedBoxes.length; i++) {
      for (j = 0; j < currentColumn.boxes.length; j++) {
        if (sortedBoxes[i].rect.x < currentColumn.boxes[j].rect.xMax) {
          currentColumn.boxes.push(this.getBox(row.boxes, sortedBoxes[i]));
          currentColumn.width = Math.max(currentColumn.width, sortedBoxes[i].rect.xMax - currentColumn.x);
          break;
        }
      }

      // Create a new column
      if (j === currentColumn.boxes.length) {
        columns.push({
          boxes: [this.getBox(row.boxes, sortedBoxes[i])],
          element: parent.appendChild(document.createElement('td')),
          x: currentColumn.width + currentColumn.x,
          y: row.y,
          width: sortedBoxes[i].rect.xMax - (currentColumn.width + currentColumn.x),
          height: row.height
        });
        currentColumn = columns[columns.length - 1];
      }
    }

    // Set the last column's width
    if (columns.length > 1) {
      currentColumn.width = row.width - currentColumn.x;
    } else {
      currentColumn.width = row.width;
    }

    return columns;
  }

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
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          loading: true
        }
        EditBoxComponent.currentContainer = container;
        table.style.width = boxData.rect.width + 'px';
        table.style.height = boxData.rect.height + 'px';
        this.editBoxService.createTextBox(boxData);

        // Container box
      } else if (table.summary.substr(0, 12) === 'containerBox') {
        let boxData = {
          backgroundColor: table.bgColor === '' ? '#00000000' : table.bgColor,
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          loading: true
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
          loading: true,
          link: table.getElementsByTagName('a')[0].getAttribute('href')
        }
        EditBoxComponent.currentContainer = container;
        this.editBoxService.createButtonBox(boxData);

        // Image box
      } else if (table.summary.substr(0, 8) === 'imageBox') {
        let boxData = {
          rect: new Rect(rect[0], rect[1], rect[2], rect[3]),
          loading: true,
          link: table.getElementsByTagName('a')[0].getAttribute('href'),
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
        if (td.firstElementChild && td.firstElementChild.tagName === 'TABLE') {
          this.tableToBox(td.firstElementChild as HTMLTableElement, container);
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
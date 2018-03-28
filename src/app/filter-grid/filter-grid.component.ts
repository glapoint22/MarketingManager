import { Component, OnInit } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'filter-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './filter-grid.component.scss']
})
export class FilterGridComponent extends EditableGridComponent implements OnInit {

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Filters';
    this.tierComponent.parentTierHeight = 228;
    super.ngOnInit();
  }

  createTiers(data: Array<any>) {
    // Filters
    this.tiers.push({
      index: 0,
      name: 'Filters',
      items: data
        .map(x => ({
          id: x.id,
          tierIndex: 0,
          data: [
            {
              value: x.name
            }
          ]
        })),
      fields: [
        {
          name: 'Filter',
          defaultValue: 'My Filter',
          width: 200
        }
      ],
      headerButtons: this.setHeaderButtons('New Filter', 'Delete Filter', 0),
      rowButtons: this.setRowButtons('Edit Filter')
    });

    //Filter Options
    let items = data
      .map(x => x.options
        .map(y => ({
          parentId: x.id,
          id: y.id,
          tierIndex: 1,
          data: [
            {
              value: y.name
            }
          ]
        })));
    items = [].concat.apply([], items);

    this.tiers.push({
      index: 1,
      name: 'Filter Options',
      items: items,
      fields: [
        {
          name: 'Filter Option',
          defaultValue: 'My Filter Options',
          width: 200
        }
      ],
      headerButtons: this.setHeaderButtons('New Filter Option', 'Delete Filter Option', 1),
      rowButtons: this.setRowButtons('Edit Filter Option')
    });

    super.createTiers();
  }
}

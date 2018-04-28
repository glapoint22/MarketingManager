import { Component, OnInit } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { SaveService } from "../save.service";

@Component({
  selector: 'filter-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class FilterGridComponent extends EditableGridComponent implements OnInit {

  constructor(dataService: DataService, saveService: SaveService) { super(dataService, saveService) }

  ngOnInit() {
    this.apiUrl = 'api/Filters';
    this.tierComponent.parentTierHeight = 230;
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
          defaultValue: 'Filter Name',
          width: 200
        }
      ],
      headerButtons: this.setHeaderButtons('New Filter', 'Delete Filter', 0),
      rowButtons: this.setRowButtons('Edit Filter'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value
        }
      },
      url: 'api/Filters'
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
          defaultValue: 'Filter Option Name',
          width: 200
        }
      ],
      headerButtons: this.setHeaderButtons('New Filter Option', 'Delete Filter Option', 1),
      rowButtons: this.setRowButtons('Edit Filter Option'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value,
          FilterID: item.parentId
        }
      },
      url: 'api/FilterLabels'
    });

    super.createTiers();
  }
}

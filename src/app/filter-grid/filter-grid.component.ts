import { Component, OnInit, Input } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";

@Component({
  selector: 'filter-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class FilterGridComponent extends EditableGridComponent implements OnInit {
  @Input() products;

  ngOnInit() {
    this.apiUri = 'api/Filters';
    this.tierComponent.parentTierHeight = 230;
    this.defaultMaxItemCount = 15;
    this.maxItems = this.defaultMaxItemCount;
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
      headerButtons: this.setHeaderButtons('New Filter', 'Delete Filter'),
      rowButtons: this.setRowButtons('Edit Filter'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value
        }
      },
      check: (item) => {
        if (item.data[0].value === 'Filter Name') {
          this.promptService.prompt('Quality Control', 'Filter cannot have a name of "Filter Name".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }


        return true;
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
      headerButtons: this.setHeaderButtons('New Filter Option', 'Delete Filter Option'),
      rowButtons: this.setRowButtons('Edit Filter Option'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value,
          FilterID: item.parentId
        }
      },
      check: (item) => {
        if (item.data[0].value === 'Filter Option Name') {
          this.promptService.prompt('Quality Control', 'Filter option cannot have a name of "Filter Option Name".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }


        return true;
      },
      url: 'api/FilterLabels'
    });

    super.createTiers();
  }

  deleteItem(item: any) {
    super.deleteItem(item);
    if (item.tierIndex === 1) {
      this.products.items.forEach(x => {
        for (let i = 0; i < x.filters.length; i++) {
          if (x.filters[i].filterOption === item.id) {
            x.filters.splice(x.filters.findIndex(y => y.filterOption === item.id), 1);
            return;
          }
        }
      });
    }
  }

  setParentTierHeight() { }
}
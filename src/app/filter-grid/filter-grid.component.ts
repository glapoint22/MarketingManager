import { Component, OnInit } from '@angular/core';
import { ExpandableGridComponent } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';

@Component({
  selector: 'filter-grid',
  templateUrl: '../expandable-grid/expandable-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './filter-grid.component.scss']
})
export class FilterGridComponent extends ExpandableGridComponent implements OnInit {

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Filters';
    // this.isEditable = true;
    this.gridHeight = 262;
    super.ngOnInit();
  }

  setTiers(data: Array<any>) {
    let tier1: Itier, tier2: Itier;

    //Tier1
    let allItems = data
      .map(x => ({
        id: x.id,
        isExpanded: false,
        isSelected: false,
        type: 'Tier1',
        tier1Index: null,
        data: [
          {
            value: x.name,
            isEditing: false
          }
        ]
      }));
    let items = allItems.map(x => Object.assign({}, x));

    tier1 = {
      index: 0,
      name: 'Filter',
      items: items,
      fields: [
        {
          name: 'Filters',
          defaultValue: 'My Filter'
        }
      ]
    }

    //Tier2
    allItems = data
      .map(x => x.options
        .map(y => ({
          tier1Id: x.id,
          id: y.id,
          isExpanded: false,
          isSelected: false,
          type: 'Tier2',
          tier1Index: null,
          tier2Index: null,
          data: [
            {
              value: y.name,
              isEditing: false
            }
          ]
        })));
    allItems = [].concat.apply([], allItems);
    items = allItems.map(x => Object.assign({}, x));

    tier2 = {
      index: 1,
      name: 'Filter Option',
      items: items,
      fields: [
        {
          name: 'Filter Options',
          defaultValue: 'My Filter Option'
        }
      ]
    }
    //Set the tiers array
    this.tiers.push(tier1, tier2);
  }
}

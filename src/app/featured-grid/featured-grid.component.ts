import { Component, OnInit, SimpleChanges, Input } from '@angular/core';
import { ExpandableGridComponent, Tier } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'featured-grid',
  templateUrl: '../expandable-grid/expandable-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './featured-grid.component.scss']
})
export class FeaturedGridComponent extends ExpandableGridComponent implements OnInit {
  @Input() items;
  public showItemList: boolean;
  public nonFeaturedList: Array<any>;

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.isEditable = true;
    this.gridHeight = 262;
  }

  setTiers(data: Array<any>) {
    let tier1: Tier;

    //Tier1
    let allItems = data
      .map(x => ({
        id: x.id,
        isSelected: false,
        type: x.type,
        tier1Index: null,
        data: [
          {
            value: x.data[0].value,
            isEditing: false
          }
        ]
      }));
    let items = allItems.map(x => Object.assign({}, x));

    tier1 = {
      index: 0,
      name: 'Featured Category',
      items: items,
      fields: [
        {
          name: 'Categories',
          defaultValue: 'My Featured Category'
        }
      ]
    }


    //Set the tiers array
    this.tiers.push(tier1);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.items.currentValue) {
      this.setTiers(simpleChanges.items.currentValue.allItems);
      this.setSearchOptions();
    }
  }

  addItem(itemType: string, tier1Index, tier1Id, tier2Index, tier2Id){
    this.showItemList = true;
    // this.nonFeaturedList = this.tiers[0].allItems.filter(x => !x.isFeatured);
  }
}

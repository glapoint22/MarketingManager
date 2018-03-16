import { Component, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { ExpandableGridComponent, Tier } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'shop-grid',
  templateUrl: '../expandable-grid/expandable-grid2.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends ExpandableGridComponent implements OnInit {
  @ContentChild('tier3RowContent', { read: TemplateRef }) tier3RowContent: any;
  public filterData: Array<number>;
  public filters;
  private currentFilter;
  private currentIcon;
  private isFilterClicked: boolean;

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    this.isEditable = true;
    super.ngOnInit();
  }
  setGridHeight() {
    this.gridHeight = window.innerHeight - 66;
  }

  setTiers(data: Array<any>) {
    let tier1: Tier, tier2: Tier, tier3: Tier;
    
    //Tier1
    let items = data
      .map(x => ({
        id: x.id,
        // isExpanded: false,
        // isSelected: false,
        tier: 0,
        // tier1Index: null,
        // isFeatured: x.featured,
        data: [
          {
            value: x.name
          }
        ]
      }));
    // let items = allItems.map(x => Object.assign({}, x));

    tier1 = {
      name: 'Category',
      // allItems: allItems,
      items: items,
      fields: [
        {
          name: 'Category',
          defaultValue: 'My Category'
        }
      ]
    }

    //Tier2
    items = data
      .map(x => x.niches
        .map(y => ({
          parentId: x.id,
          id: y.id,
          // isExpanded: false,
          // isSelected: false,
          tier: 1,
          // tier1Index: null,
          // tier2Index: null,
          data: [
            {
              value: y.name
            }
          ]
        })));
        items = [].concat.apply([], items);
    // items = allItems.map(x => Object.assign({}, x));

    tier2 = {
      name: 'Niche',
      // allItems: allItems,
      items: items,
      fields: [
        {
          name: 'Niche',
          defaultValue: 'My Niche'
        }
      ]
    }

    //Tier3
    items = data
      .map(x => x.niches
        .map(y => y.products
          .map(z => ({
            parentId: y.id,
            id: z.id,
            // isSelected: false,
            tier: 2,
            // tier1Index: null,
            // tier2Index: null,
            // tier3Index: null,
            data: [
              {
                value: z.name
              },
              {
                value: z.hopLink
              },
              {
                value: z.description
              },
              {
                value: z.price.toLocaleString('eng', { style: 'currency', currency: 'USD' })
              }
            ],
            filters: z.filters
          }))));

          items = [].concat.apply([], items.concat.apply([], items));
    // items = allItems.map(x => Object.assign({}, x));

    tier3 = {
      name: 'Product',
      // allItems: allItems,
      items: items,
      fields: [
        {
          name: 'Product',
          defaultValue: 'My Product'
        },
        {
          name: 'HopLink',
          defaultValue: 'HopLink URL'
        },
        {
          name: 'Description',
          defaultValue: 'Product Description'
        },
        {
          name: 'Price',
          defaultValue: '$0.00'
        }
      ]
    }

    //Set the tiers array
    this.tiers.push(tier1, tier2, tier3);

    // this.gridService.createGrid('shop', [tier1, tier2, tier3]);
    // this.tierComponent.tier = this.gridService.getTier('shop', 0);
    this.tierComponent.tiers = this.tiers;
    this.tierComponent.tier = this.tiers[0];
  }

  onFilterClick(filter, icon, filters, filterOptions) {
    //Flag that a filter has been clicked
    this.isFilterClicked = true;


    if (this.currentFilter != filter) {
      //Set the filters
      this.filters = filters
        .map(x => ({
          id: x.id,
          name: x.data[0].value,
          options: filterOptions
            .filter(y => y.tier1Id == x.id)
            .map(z => ({
              id: z.id,
              name: z.data[0].value
            }))
        }));

      if (this.currentFilter) {
        //Reset the current filter
        this.resetFilter();
      }
      //Display the filter
      this.currentFilter = filter;
      this.currentIcon = icon;
      filter.style.setProperty('display', 'block');
      icon.style.setProperty('color', '#ffffff');
    } else {
      this.resetFilter();
    }
  }

  selectItem(item, tier1Index, tier2Index, tier3Index) {
    //If a filter was clicked assign the data
    if (this.isFilterClicked) {
      this.isFilterClicked = false;
      this.filterData = item.filters;
    } else {
      //If the item that was clicked is not the current item, reset the filter
      if (item !== this.currentItem) {
        if (this.currentFilter) {
          this.resetFilter();
        }
      }
    }
    super.selectItem(item, tier1Index, tier2Index, tier3Index);
  }

  resetFilter() {
    //Reset the filter to default values
    this.currentFilter.style.setProperty('display', 'none');
    this.currentIcon.style.setProperty('color', '');
    delete this.currentFilter;
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.keyCode === 27) {
      if (this.currentFilter) {
        this.resetFilter();
      }
    }
    super.handleKeyboardEvent(event);
  }

  getChecked(optionId): boolean {
    //Return if checkbox is checked
    return this.filterData.some(x => x == optionId);
  }

  setChecked(optionId) {
    let index = this.filterData.findIndex(x => x == optionId);

    //Set the checkbox to be checked or unchecked
    if (index > -1) {
      this.filterData.splice(index, 1);
    } else {
      this.filterData.push(optionId);
    }
  }

  createId(items, tier): any {
    //Create an id for the new product
    if (tier === 'Tier3') {
      let id, index = 0

      //This makes sure we don't have a duplicate
      while (index > -1) {
        id = Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase();
        index = items.findIndex(x => x.id == id);
      }
      return id;
    } else {
      return super.createId(items, tier);
    }

  }
}
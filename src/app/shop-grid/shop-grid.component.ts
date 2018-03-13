import { Component, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { ExpandableGridComponent, Tier } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'shop-grid',
  templateUrl: '../expandable-grid/expandable-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends ExpandableGridComponent implements OnInit {
  @ContentChild('tier3RowContent', { read: TemplateRef }) tier3RowContent: any;
  public filterData: Array<number>;
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
      name: 'Category',
      allItems: allItems,
      items: items,
      fields: [
        {
          name: 'Category',
          defaultValue: 'My Category'
        }
      ]
    }

    //Tier2
    allItems = data
      .map(x => x.niches
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
      name: 'Niche',
      allItems: allItems,
      items: items,
      fields: [
        {
          name: 'Niche',
          defaultValue: 'My Niche'
        }
      ]
    }

    //Tier3
    allItems = data
      .map(x => x.niches
        .map(y => y.products
          .map(z => ({
            tier2Id: y.id,
            id: z.id,
            isSelected: false,
            type: 'Tier3',
            tier1Index: null,
            tier2Index: null,
            tier3Index: null,
            data: [
              {
                value: z.name,
                isEditing: false
              },
              {
                value: z.hopLink,
                isEditing: false
              },
              {
                value: z.description,
                isEditing: false
              },
              {
                value: z.price.toLocaleString('eng', { style: 'currency', currency: 'USD' }),
                isEditing: false
              }
            ],
            filters: z.filters
          }))));

    allItems = [].concat.apply([], allItems.concat.apply([], allItems));
    items = allItems.map(x => Object.assign({}, x));

    tier3 = {
      name: 'Product',
      allItems: allItems,
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
  }

  onFilterClick(filter, icon) {
    //Flag that a filter has been clicked
    this.isFilterClicked = true;


    if (this.currentFilter != filter) {
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

  resetFilter(){
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

  getChecked(optionId):boolean{
    //Return if checkbox is checked
    return this.filterData.some(x => x == optionId);
  }

  setChecked(optionId){
    let index  = this.filterData.findIndex(x => x == optionId);

    //Set the checkbox to be checked or unchecked
    if(index > -1){
      this.filterData.splice(index, 1);
    }else{
      this.filterData.push(optionId);
    }
  }

  addItem(itemType: string, tier1Index, tier1Id, tier2Index, tier2Id){
    super.addItem(itemType, tier1Index, tier1Id, tier2Index, tier2Id);

    //Only add the filters array if the item is tier 3
    if(itemType === 'Tier3'){
      this.tiers[0].items[tier1Index].tier2Items[tier2Index].tier3Items[0]['filters'] = [];
    }
  }
}
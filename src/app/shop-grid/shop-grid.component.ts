import { Component, OnInit, ContentChild, TemplateRef } from '@angular/core';
import { ExpandableGridComponent, Tier } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";
import { HostListener } from '@angular/core';

@Component({
  selector: 'shop-grid',
  templateUrl: '../expandable-grid/expandable-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends ExpandableGridComponent implements OnInit {
  @ContentChild('tier3RowContent', { read: TemplateRef }) tier3RowContent: any;
  public currentFilter;
  public filterData;
  private isFilterClicked: boolean;

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    this.isEditable = true;
    super.ngOnInit();
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
      fields: ['Category']
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
      fields: ['Niche']
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
            ]
          }))));

    allItems = [].concat.apply([], allItems.concat.apply([], allItems));
    items = allItems.map(x => Object.assign({}, x));

    tier3 = {
      name: 'Product',
      allItems: allItems,
      items: items,
      fields: [
        'Product',
        'HopLink',
        'Description',
        'Price'
      ]
    }

    //Set the tiers array
    this.tiers.push(tier1, tier2, tier3);
  }

  onFilterClick(filter){
    this.isFilterClicked = true;
    

    if(this.currentFilter != filter){
      if(this.currentFilter)this.currentFilter.style.setProperty('display', 'none');
      this.currentFilter = filter;
      filter.style.setProperty('display', 'block');
    }else{
      filter.style.setProperty('display', 'none');
      delete this.currentFilter;
    }

    

  }

  selectItem(item, tier1Index, tier2Index, tier3Index){
    if(this.isFilterClicked){
      this.isFilterClicked = false;
      this.filterData = item;
    }else{
      super.selectItem(item, tier1Index, tier2Index, tier3Index);
    }
  }
  

}
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
  @ContentChild('tier1RowContent', { read: TemplateRef }) tier1RowContent: any;
  private isTier1RowContentChecked: boolean;

  constructor(dataService: DataService) { super(dataService) }


  ngAfterContentChecked(){
    if(!this.isTier1RowContentChecked){
      if(this.tier1RowContent._projectedViews){
        this.isTier1RowContentChecked = true;
        this.tiers[0].items.forEach((v, i) => this.setVisible(v.isVisible, this.tier1RowContent._projectedViews[i].nodes[1].renderElement));
      }
    }
  }

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
        name: x.name,
        isExpanded: false,
        isSelected: false,
        type: 'Tier1',
        tier1Index: null,
        isSettingName: false,
        isVisible: true
      }));
    let items = allItems.map(x => Object.assign({}, x));

    tier1 = {
      name: 'Category',
      header: 'Categories',
      allItems: allItems,
      items: items,
    }

    //Tier2
    allItems = data
      .map(x => x.niches
        .map(y => ({
          tier1Id: x.id,
          id: y.id,
          name: y.name,
          isExpanded: false,
          isSelected: false,
          type: 'Tier2',
          tier1Index: null,
          tier2Index: null,
          isSettingName: false
        })));
    allItems = [].concat.apply([], allItems);
    items = allItems.map(x => Object.assign({}, x));

    tier2 = {
      name: 'Niche',
      header: 'Niches',
      allItems: allItems,
      items: items,
    }

    //Tier3
    allItems = data
      .map(x => x.niches
        .map(y => y.products
          .map(z => ({
            tier2Id: y.id,
            id: z.id,
            name: z.name,
            hopLink: z.hopLink,
            isSelected: false,
            type: 'Tier3',
            tier1Index: null,
            tier2Index: null,
            tier3Index: null,
            isSettingName: false
          }))));

    allItems = [].concat.apply([], allItems.concat.apply([], allItems));
    items = allItems.map(x => Object.assign({}, x));

    tier3 = {
      name: 'Product',
      header: 'Products',
      allItems: allItems,
      items: items,
    }

    //Set the tiers array
    this.tiers.push(tier1, tier2, tier3);
  }

  onVisibleClick(element) {
    let index = this.tier1RowContent._projectedViews.findIndex(x => x.nodes[1].renderElement == element);
    let category = this.tiers[0].items[index];
    category.isVisible = !category.isVisible;
    this.setVisible(category.isVisible, element);
  }

  setVisible(isVisible, element){
    if (isVisible) {
      element.style.setProperty('color', '#aaaaaa');
    } else {
      element.style.setProperty('color', '#3c3c3c');
    }
  }

  stopPropagation(event): void {
    event.stopPropagation();
  }

}
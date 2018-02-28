import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'expandable-grid',
  templateUrl: './expandable-grid.component.html',
  styleUrls: ['./expandable-grid.component.scss']
})
export class ExpandableGridComponent implements OnInit {

  public tiers:  Array<Tier> = [];
  public searchOptions: Array<string> = [];
  public selectedSearchOption: string;

  //Public
  public tier1Items: Array<any>;
  public apiUrl: string;
  
  
  public currentItem: any;

  //Private
  private allTier1Items: Array<any>;
  private allTier2Items: Array<any>;
  private tier2Items: Array<any>;
  private allTier3Items: Array<any>;
  private tier3Items: Array<any>;

  constructor(public dataService: DataService) { }

  setTiers(data: any){}

  ngOnInit() {
    
    this.dataService.get(this.apiUrl)
      .subscribe((data: any) => {
        this.setTiers(data);

        this.tiers.forEach(x => this.searchOptions.push(x.name));
        this.selectedSearchOption = this.searchOptions[0];
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        let response = data;
        //Tier1 Items
        this.allTier1Items = response
          .map(x => ({
            id: x.id,
            name: x.name,
            isExpanded: false,
            isSelected: false,
            type: 'Category',
            categoryIndex: null,
            isSettingName: false
          }));
        this.tier1Items = this.allTier1Items.map(x => Object.assign({}, x));

        //Tier2 Items
        this.allTier2Items = response
          .map(x => x.niches
            .map(y => ({
              categoryId: x.id,
              id: y.id,
              name: y.name,
              isSelected: false,
              type: 'Niche',
              categoryIndex: null,
              nicheIndex: null,
              isSettingName: false
            })));
        this.allTier2Items = [].concat.apply([], this.allTier2Items);
        this.tier2Items = this.allTier2Items.map(x => Object.assign({}, x));

        //Tier3 Items
        this.allTier3Items = response
          .map(x => x.niches
            .map(y => y.products
              .map(z => ({
                nicheId: y.id,
                id: z.id,
                name: z.name,
                hopLink: z.hopLink,
                isSelected: false,
                type: 'Product',
                categoryIndex: null,
                nicheIndex: null,
                productIndex: null,
                isSettingName: false
              }))));

        this.allTier3Items = [].concat.apply([], this.allTier3Items.concat.apply([], this.allTier3Items));
        this.tier3Items = this.allTier3Items.map(x => Object.assign({}, x));

      }, error => {
        // Error
      });
  }

  onTier1CheckboxChange(index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      // this.tier1Items[index].niches = this.tier2Items.filter(x => x.categoryId == this.tier1Items[index].id);
      this.tiers[0].filteredItems[index].tier2Items = this.tiers[1].filteredItems.filter(x => x.tier1Id == this.tiers[0].filteredItems[index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier2TransitionEnd(index: number, checkbox) {
    if (!checkbox.checked && this.tiers[0].filteredItems[index].tier2Items) {
      delete this.tiers[0].filteredItems[index].tier2Items;
    }
  }

  onTier2CheckboxChange(tier1Index: number, tier2Index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.tier1Items[tier1Index].niches[tier2Index].products = this.tier3Items.filter(x => x.nicheId == this.tier1Items[tier1Index].niches[tier2Index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier3TransitionEnd(tier1Index: number, tier2Index: number, checkbox) {
    if (!checkbox.checked && this.tier1Items[tier1Index].niches[tier2Index].products) {
      delete this.tier1Items[tier1Index].niches[tier2Index].products;
    }
  }

  onSearchChange(searchValue: string) {
    let searchArray = searchValue.toLowerCase().split(' ');

    switch (this.selectedSearchOption) {
      case 'Category':
        this.searchCategories(searchArray);
        break;
      case 'Niche':
        this.searchNiches(searchArray);
        break;
      case 'Product':
        this.searchProducts(searchArray);
    }
  }


  searchCategories(searchArray: Array<string>) {
    this.tier3Items = this.allTier3Items.map(x => Object.assign({}, x));
    this.tier2Items = this.allTier2Items.map(x => Object.assign({}, x));
    this.tier1Items = this.allTier1Items.filter(x => searchArray.every(y => x.name.toLowerCase().includes(y))).map(x => Object.assign({}, x));
  }

  searchNiches(searchArray: Array<string>) {
    this.tier3Items = this.allTier3Items.map(x => Object.assign({}, x));
    this.tier2Items = this.allTier2Items.filter(x => searchArray.every(a => x.name.toLowerCase().includes(a))).map(x => Object.assign({}, x));
    let categoryIds = this.tier2Items.map(x => x.categoryId).filter((v, i, a) => a.indexOf(v) === i);
    this.tier1Items = this.allTier1Items.filter(x => categoryIds.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  searchProducts(searchArray: Array<string>) {
    this.tier3Items = this.allTier3Items.filter(x => searchArray.every(a => x.name.toLowerCase().includes(a))).map(x => Object.assign({}, x));
    let nicheIds = this.tier3Items.map(x => x.nicheId).filter((v, i, a) => a.indexOf(v) === i);
    this.tier2Items = this.allTier2Items.filter(x => nicheIds.some(a => x.id === a)).map(x => Object.assign({}, x));
    let categoryIds = this.tier2Items.map(x => x.categoryId).filter((v, i, a) => a.indexOf(v) === i);
    this.tier1Items = this.allTier1Items.filter(x => categoryIds.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  clearText(search) {
    search.value = '';
    this.onSearchChange('');
  }

  collapse() {
    this.tier1Items.forEach(x => x.isExpanded = false);
    if (this.currentItem && this.currentItem.isSelected && this.currentItem.type !== 'Category') {
      this.currentItem.isSelected = false;
    }
  }

  selectItem(item, categoryIndex, nicheIndex, productIndex) {
    if (this.currentItem !== item) {
      item.isSelected = true;

      switch (item.type) {
        case 'Category':
          item.categoryIndex = categoryIndex;
          break;
        case 'Niche':
          item.categoryIndex = categoryIndex;
          item.nicheIndex = nicheIndex;
          break;
        case 'Product':
          item.categoryIndex = categoryIndex;
          item.nicheIndex = nicheIndex;
          item.productIndex = productIndex;
      }


      if (this.currentItem) {
        this.currentItem.isSelected = false;
        this.currentItem.isSettingName = false;
      }
      this.currentItem = item;
    }
  }

  addItem(itemType: string, categoryIndex, categoryId, nicheIndex, nicheId) {
    let newItem = {
      isSelected: true,
      type: itemType,
      name: 'New ' + itemType
    };
    if (this.currentItem) {
      this.currentItem.isSelected = false;
      this.currentItem.isSettingName = false;
    }

    this.currentItem = newItem;
    this.highlightName(newItem);



    switch (itemType) {
      case 'Category':
        this.tier1Items.unshift(newItem);
        this.allTier1Items.unshift(newItem);
        break;
      case 'Niche':
        newItem['categoryId'] = categoryId;
        newItem['categoryIndex'] = categoryIndex;
        this.tier1Items[categoryIndex].niches.unshift(newItem);
        this.allTier2Items.unshift(newItem);
        this.tier2Items.unshift(newItem);
        break;
      case 'Product':
        newItem['nicheId'] = nicheId;
        newItem['categoryIndex'] = categoryIndex;
        newItem['nicheIndex'] = nicheIndex;
        this.tier1Items[categoryIndex].niches[nicheIndex].products.unshift(newItem);
        this.allTier3Items.unshift(newItem);
        this.tier3Items.unshift(newItem);
    }
  }

  deleteItem() {
    if (this.currentItem && this.currentItem.isSelected) {
      this.currentItem.isSelected = false;

      switch (this.currentItem.type) {
        case 'Category':
          this.tier1Items.splice(this.currentItem.categoryIndex, 1);
          this.allTier1Items.splice(this.allTier1Items.findIndex(x => x.id === this.currentItem.id), 1);
          break;
        case 'Niche':
          this.tier1Items[this.currentItem.categoryIndex].niches.splice(this.currentItem.nicheIndex, 1);
          this.allTier2Items.splice(this.allTier2Items.findIndex(x => x.id === this.currentItem.id), 1);
          break;
        case 'Product':
          this.tier1Items[this.currentItem.categoryIndex].niches[this.currentItem.nicheIndex].products.splice(this.currentItem.productIndex, 1);
          this.allTier3Items.splice(this.allTier3Items.findIndex(x => x.id === this.currentItem.id), 1);
      }
    }
  }

  setItemName(newName: string) {
    this.currentItem.isSettingName = false;
    this.currentItem.name = newName;

    switch (this.currentItem.type) {
      case 'Category':
        this.allTier1Items[this.allTier1Items.findIndex(x => x.id === this.currentItem.id)].name = newName;
        break;
      case 'Niche':
        this.allTier2Items[this.allTier2Items.findIndex(x => x.id === this.currentItem.id)].name = newName;
        break;
      case 'Product':
        this.allTier3Items[this.allTier3Items.findIndex(x => x.id === this.currentItem.id)].name = newName;
    }
  }

  highlightName(item) {
    item.isSettingName = true;
    window.setTimeout(() => {
      document.getElementById('name').focus();
    }, 1);

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.currentItem.isSelected = false;
      this.currentItem.isSettingName = false;
      delete this.currentItem;
    }

    if (event.keyCode === 13) {
      this.currentItem.isSettingName = false;
    }
  }
}

export type Tier = {
  name: string,
  header: string,
  allItems: Array<any>,
  filteredItems: Array<any>
}

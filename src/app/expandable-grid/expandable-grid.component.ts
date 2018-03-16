import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { DataService } from "../data.service";
import { TierComponent } from '../tier/tier.component';

@Component({
  selector: 'expandable-grid',
  templateUrl: './expandable-grid.component.html',
  styleUrls: ['./expandable-grid.component.scss']
})
export class ExpandableGridComponent implements OnInit {

  @ViewChild(TierComponent) tierComponent: TierComponent;

  

  public tiers: Array<Tier> = [];
  public searchOptions: Array<string> = [];
  public selectedSearchOption: string;
  public apiUrl: string;
  public currentItem: any;
  public itemResults: boolean = true;
  public gridHeight: number;
  public isEditable: boolean;
  public isHighlightRow: boolean = true;

  constructor(public dataService: DataService) { }

  setTiers(data: Array<any>) { }
  setGridHeight() { }

  ngOnInit() {
    this.dataService.get(this.apiUrl, [{ key: 'includeProducts', value: true }])
      .subscribe((data: any) => {
        this.setTiers(data);
        this.setSearchOptions();
        this.setGridHeight();
        
      }, error => {
        // Error
      });
  }

  setSearchOptions() {
    this.tiers.forEach(x => this.searchOptions.push(x.name));
    this.selectedSearchOption = this.searchOptions[0];
  }

  expandTier1(index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.tiers[0].items[index].tier2Items = this.tiers[1].items.filter(x => x.tier1Id == this.tiers[0].items[index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier2TransitionEnd(index: number, checkbox) {
    if (!checkbox.checked && this.tiers[0].items[index].tier2Items) {
      this.tiers[0].items[index].tier2Items.forEach(x => x.isExpanded = false);
      delete this.tiers[0].items[index].tier2Items;
      if (this.currentItem && this.currentItem.isSelected && this.currentItem.type !== 'Tier1') {
        this.currentItem.isSelected = false;
        delete this.currentItem;
      }
    }
  }

  expandTier2(tier1Index: number, tier2Index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.tiers[0].items[tier1Index].tier2Items[tier2Index].tier3Items = this.tiers[2].items.filter(x => x.tier2Id == this.tiers[0].items[tier1Index].tier2Items[tier2Index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier3TransitionEnd(tier1Index: number, tier2Index: number, checkbox) {
    if (!checkbox.checked && this.tiers[0].items[tier1Index].tier2Items[tier2Index].tier3Items) {
      delete this.tiers[0].items[tier1Index].tier2Items[tier2Index].tier3Items;
      if (this.currentItem && this.currentItem.isSelected && this.currentItem.type !== 'Tier1') {
        this.currentItem.isSelected = false;
        delete this.currentItem;
      }
    }
  }

  onSearchChange(searchValue: string) {
    let searchArray = searchValue.toLowerCase().split(/(?=\s)/g);
    let tierIndex = this.tiers.findIndex(x => x.name == this.selectedSearchOption);

    switch (tierIndex) {
      case 0:
        this.searchTier1(searchArray);
        break;
      case 1:
        this.searchTier2(searchArray);
        break;
      case 2:
        this.searchTier3(searchArray);
    }

    if (this.tiers[0].items.length === 0 && searchValue != '') {
      this.itemResults = false;
    } else {
      this.itemResults = true;;
    }
  }


  searchTier1(searchArray: Array<string>) {
    //Assign all other tiers with all items
    for (let i = this.tiers.length - 1; i > 0; i--) {
      // this.tiers[i].items = this.tiers[i].allItems.map(x => Object.assign({}, x));
    }

    //Filter the tier1 items based on the search words
    // this.tiers[0].items = this.tiers[0].allItems.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y)))).map(x => Object.assign({}, x));
  }

  searchTier2(searchArray: Array<string>) {
    //If there is a tier3, assign its items with all items
    if (this.tiers[2]) {
      // this.tiers[2].items = this.tiers[2].allItems.map(x => Object.assign({}, x));
    }

    //Filter the tier2 items based on the search words
    // this.tiers[1].items = this.tiers[1].allItems.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y)))).map(x => Object.assign({}, x));

    //Get the distinct tier1 ids that are associated with the filterd tier2 items
    let tier1Ids = this.tiers[1].items.map(x => x.tier1Id).filter((v, i, a) => a.indexOf(v) === i);

    //Filter the tier1 items based on ther tier1 ids
    // this.tiers[0].items = this.tiers[0].allItems.filter(x => tier1Ids.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  searchTier3(searchArray: Array<string>) {
    //Filter the tier3 items based on the search words
    // this.tiers[2].items = this.tiers[2].allItems.filter(x => searchArray.every(y => x.data.some(z => z.value.toLowerCase().includes(y)))).map(x => Object.assign({}, x));

    //Get the distinct tier2 ids that are associated with the filterd tier3 items
    let tier2Ids = this.tiers[2].items.map(x => x.tier2Id).filter((v, i, a) => a.indexOf(v) === i);

    //Filter the tier2 items based on ther tier2 ids
    // this.tiers[1].items = this.tiers[1].allItems.filter(x => tier2Ids.some(a => x.id === a)).map(x => Object.assign({}, x));

    //Get the distinct tier1 ids that are associated with the filterd tier2 items
    let tier1Ids = this.tiers[1].items.map(x => x.tier1Id).filter((v, i, a) => a.indexOf(v) === i);

    //Filter the tier1 items based on ther tier1 ids
    // this.tiers[0].items = this.tiers[0].allItems.filter(x => tier1Ids.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  clearSearchText(inputField) {
    let value = inputField.value;

    //Set the input field's value to an empty string
    inputField.value = '';

    //Call onSearchChange to get items back
    if (value.length > 0) this.onSearchChange('');

  }

  collapseTier(tier: string, index: number) {
    switch (tier) {
      case 'Tier1':
        this.tiers[0].items.forEach(x => x.isExpanded = false);
        break;
      case 'Tier2':
        this.tiers[0].items[index].tier2Items.forEach(x => x.isExpanded = false);
        break;
    }


    if (this.currentItem && this.currentItem.isSelected && this.currentItem.type !== 'Tier1') {
      this.currentItem.isSelected = false;
      delete this.currentItem;
    }
  }

  selectItem(item, tier1Index, tier2Index, tier3Index) {
    if (this.currentItem !== item) {
      item.isSelected = true;

      //Assign the indexs
      switch (item.type) {
        case 'Tier1':
          item.tier1Index = tier1Index;
          break;
        case 'Tier2':
          item.tier1Index = tier1Index;
          item.tier2Index = tier2Index;
          break;
        case 'Tier3':
          item.tier1Index = tier1Index;
          item.tier2Index = tier2Index;
          item.tier3Index = tier3Index;
      }

      //If there is a current item
      if (this.currentItem) {
        //Set that the current item is not selected
        this.currentItem.isSelected = false;
      }
      //Set this item as the current item
      this.currentItem = item;
    }
  }

  addItem(itemType: string, tier1Index, tier1Id, tier2Index, tier2Id) {
    //Create the new item object
    let newItem = {
      isSelected: true,
      type: itemType,
      data: [],
    };

    //Add the new item to the tier
    switch (itemType) {
      case 'Tier1':
        // newItem['id'] = this.createId(this.tiers[0].allItems, 'Tier1');
        this.tiers[0].items.unshift(newItem);
        // this.tiers[0].allItems.unshift(newItem);
        this.tiers[0].fields.forEach((x) => newItem.data.push({ value: x.defaultValue, isEditing: false }));
        break;
      case 'Tier2':
        // newItem['id'] = this.createId(this.tiers[1].allItems, 'Tier2');
        newItem['tier1Id'] = tier1Id;
        newItem['tier1Index'] = tier1Index;
        this.tiers[1].fields.forEach((x) => newItem.data.push({ value: x.defaultValue, isEditing: false }));
        this.tiers[0].items[tier1Index].tier2Items.unshift(newItem);
        // this.tiers[1].allItems.unshift(newItem);
        this.tiers[1].items.unshift(newItem);
        break;
      case 'Tier3':
        // newItem['id'] = this.createId(this.tiers[2].allItems, 'Tier3');
        newItem['tier2Id'] = tier2Id;
        newItem['tier1Index'] = tier1Index;
        newItem['tier2Index'] = tier2Index;
        this.tiers[2].fields.forEach((x) => newItem.data.push({ value: x.defaultValue, isEditing: false }));
        this.tiers[0].items[tier1Index].tier2Items[tier2Index].tier3Items.unshift(newItem);
        // this.tiers[2].allItems.unshift(newItem);
        this.tiers[2].items.unshift(newItem);
    }

    //If there is a current item, set not selected
    if (this.currentItem) {
      this.currentItem.isSelected = false;
    }

    //Set the new item as the current item
    this.currentItem = newItem;
  }

  createId(items, tier): any {
    return Math.max(-1, Math.max.apply(null, items.map(x => x.id))) + 1;
  }

  deleteItem(searchText: string) {
    if (this.currentItem && this.currentItem.isSelected) {
      this.currentItem.isSelected = false;

      switch (this.currentItem.type) {
        case 'Tier1':
          this.tiers[0].items.splice(this.currentItem.tier1Index, 1);
          // this.tiers[0].allItems.splice(this.tiers[0].allItems.findIndex(x => x.id === this.currentItem.id), 1);
          break;
        case 'Tier2':
          this.tiers[0].items[this.currentItem.tier1Index].tier2Items.splice(this.currentItem.tier2Index, 1);
          // this.tiers[1].allItems.splice(this.tiers[1].allItems.findIndex(x => x.id === this.currentItem.id), 1);
          break;
        case 'Tier3':
          this.tiers[0].items[this.currentItem.tier1Index].tier2Items[this.currentItem.tier2Index].tier3Items.splice(this.currentItem.tier3Index, 1);
          // this.tiers[2].allItems.splice(this.tiers[2].allItems.findIndex(x => x.id === this.currentItem.id), 1);
      }

      //In case the deleted item is part of a search, call onSearchChange
      if (searchText) this.onSearchChange(searchText);

    }
  }

  setItemName(newName: string) {
    newName = newName.trim();
    if (newName.match(/\S/) && this.currentItem) {
      this.currentItem.currentField.value = newName;
    }

  }

  highlightName(field) {
    if (this.isEditable) {
      field.isEditing = true;
      this.currentItem.currentField = field;
      window.setTimeout(() => {
        document.getElementById('name').focus();
      }, 1);
    }


  }

  isCollapsed(tier: string, index: number) {
    let result: boolean;

    switch (tier) {
      case 'Tier1':
        result = this.tiers[0].items.some(x => x.isExpanded);
        break;
      case 'Tier2':
        result = this.tiers[0].items[index].tier2Items.some(x => x.isExpanded);
        break;
    }

    return result;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.keyCode === 27) {
      if (this.currentItem) {
        this.currentItem.isSelected = false;
        if (this.currentItem.currentField) this.currentItem.currentField.isEditing = false;
        delete this.currentItem;
      }

    }

    //Enter
    if (event.keyCode === 13) {
      if (this.currentItem && this.currentItem.currentField) {
        this.currentItem.currentField.isEditing = false;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setGridHeight();
  }
}

export type Tier = {
  index: number,
  name: string,
  items: Array<any>,
  fields: Array<any>
}
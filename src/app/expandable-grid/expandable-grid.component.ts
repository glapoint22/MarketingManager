import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'expandable-grid',
  templateUrl: './expandable-grid.component.html',
  styleUrls: ['./expandable-grid.component.scss']
})
export class ExpandableGridComponent implements OnInit {
  public items: Array<any>;
  public apiUrl: string;
  public searchOptions: Array<string> = [
    'Category',
    'Niche',
    'Product'
  ];
  public selectedSearchOption: string = this.searchOptions[0];

  private niches: Array<any>;
  private products: Array<any>;

  private allCategories: Array<any>;
  private allNiches: Array<any>;
  private allProducts: Array<any>;
  public currentSelected: any;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get(this.apiUrl)
      .subscribe((response: any) => {

        //Categories
        this.allCategories = response
          .map(x => ({
            id: x.id,
            name: x.name,
            checked: false,
            selected: false,
            type: 'Category',
            categoryIndex: null,
            isSettingName: false
          }));
        this.items = this.allCategories.map(x => Object.assign({}, x));

        //Niches
        this.allNiches = response
          .map(x => x.niches
            .map(y => ({
              categoryId: x.id,
              id: y.id,
              name: y.name,
              selected: false,
              type: 'Niche',
              categoryIndex: null,
              nicheIndex: null,
              isSettingName: false
            })));
        this.allNiches = [].concat.apply([], this.allNiches);
        this.niches = this.allNiches.map(x => Object.assign({}, x));


        //Products
        this.allProducts = response
          .map(x => x.niches
            .map(y => y.products
              .map(z => ({
                nicheId: y.id,
                id: z.id,
                name: z.name,
                hopLink: z.hopLink,
                selected: false,
                type: 'Product',
                categoryIndex: null,
                nicheIndex: null,
                productIndex: null,
                isSettingName: false
              }))));

        this.allProducts = [].concat.apply([], this.allProducts.concat.apply([], this.allProducts));
        this.products = this.allProducts.map(x => Object.assign({}, x));

      }, error => {
        // Error
      });
  }

  onTier1CheckboxChange(index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[index].niches = this.niches.filter(x => x.categoryId == this.items[index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier2TransitionEnd(index: number, checkbox) {
    if (!checkbox.checked && this.items[index].niches) {
      delete this.items[index].niches;
    }
  }

  onTier2CheckboxChange(tier1Index: number, tier2Index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[tier1Index].niches[tier2Index].products = this.products.filter(x => x.nicheId == this.items[tier1Index].niches[tier2Index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier3TransitionEnd(tier1Index: number, tier2Index: number, checkbox) {
    if (!checkbox.checked && this.items[tier1Index].niches[tier2Index].products) {
      delete this.items[tier1Index].niches[tier2Index].products;
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
    this.products = this.allProducts.map(x => Object.assign({}, x));
    this.niches = this.allNiches.map(x => Object.assign({}, x));
    this.items = this.allCategories.filter(x => searchArray.every(y => x.name.toLowerCase().includes(y))).map(x => Object.assign({}, x));
  }

  searchNiches(searchArray: Array<string>) {
    this.products = this.allProducts.map(x => Object.assign({}, x));
    this.niches = this.allNiches.filter(x => searchArray.every(a => x.name.toLowerCase().includes(a))).map(x => Object.assign({}, x));
    let categoryIds = this.niches.map(x => x.categoryId).filter((v, i, a) => a.indexOf(v) === i);
    this.items = this.allCategories.filter(x => categoryIds.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  searchProducts(searchArray: Array<string>) {
    this.products = this.allProducts.filter(x => searchArray.every(a => x.name.toLowerCase().includes(a))).map(x => Object.assign({}, x));
    let nicheIds = this.products.map(x => x.nicheId).filter((v, i, a) => a.indexOf(v) === i);
    this.niches = this.allNiches.filter(x => nicheIds.some(a => x.id === a)).map(x => Object.assign({}, x));
    let categoryIds = this.niches.map(x => x.categoryId).filter((v, i, a) => a.indexOf(v) === i);
    this.items = this.allCategories.filter(x => categoryIds.some(a => x.id === a)).map(x => Object.assign({}, x));
  }

  clearText(search) {
    search.value = '';
    this.onSearchChange('');
  }

  collapse() {
    this.items.forEach(x => x.checked = false);
    if (this.currentSelected && this.currentSelected.selected && this.currentSelected.type !== 'Category') {
      this.currentSelected.selected = false;
    }
  }

  selectItem(item, categoryIndex, nicheIndex, productIndex) {
    if (this.currentSelected !== item) {
      item.selected = true;

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


      if (this.currentSelected) {
        this.currentSelected.selected = false;
        this.currentSelected.isSettingName = false;
      }
      this.currentSelected = item;
    }
  }

  addItem(itemType: string, categoryIndex, categoryId, nicheIndex, nicheId) {
    let newItem = {
      selected: true,
      type: itemType,
      name: 'New ' + itemType
    };
    if (this.currentSelected) {
      this.currentSelected.selected = false;
      this.currentSelected.isSettingName = false;
    }

    this.currentSelected = newItem;
    this.highlightName(newItem);



    switch (itemType) {
      case 'Category':
        this.items.unshift(newItem);
        this.allCategories.unshift(newItem);
        break;
      case 'Niche':
        newItem['categoryId'] = categoryId;
        newItem['categoryIndex'] = categoryIndex;
        this.items[categoryIndex].niches.unshift(newItem);
        this.allNiches.unshift(newItem);
        this.niches.unshift(newItem);
        break;
      case 'Product':
        newItem['nicheId'] = nicheId;
        newItem['categoryIndex'] = categoryIndex;
        newItem['nicheIndex'] = nicheIndex;
        this.items[categoryIndex].niches[nicheIndex].products.unshift(newItem);
        this.allProducts.unshift(newItem);
        this.products.unshift(newItem);
    }
  }

  deleteItem() {
    if (this.currentSelected && this.currentSelected.selected) {
      this.currentSelected.selected = false;

      switch (this.currentSelected.type) {
        case 'Category':
          this.items.splice(this.currentSelected.categoryIndex, 1);
          this.allCategories.splice(this.allCategories.findIndex(x => x.id === this.currentSelected.id), 1);
          break;
        case 'Niche':
          this.items[this.currentSelected.categoryIndex].niches.splice(this.currentSelected.nicheIndex, 1);
          this.allNiches.splice(this.allNiches.findIndex(x => x.id === this.currentSelected.id), 1);
          break;
        case 'Product':
          this.items[this.currentSelected.categoryIndex].niches[this.currentSelected.nicheIndex].products.splice(this.currentSelected.productIndex, 1);
          this.allProducts.splice(this.allProducts.findIndex(x => x.id === this.currentSelected.id), 1);
      }
    }
  }

  setItemName(newName: string) {
    this.currentSelected.isSettingName = false;
    this.currentSelected.name = newName;

    switch (this.currentSelected.type) {
      case 'Category':
        this.allCategories[this.allCategories.findIndex(x => x.id === this.currentSelected.id)].name = newName;
        break;
      case 'Niche':
        this.allNiches[this.allNiches.findIndex(x => x.id === this.currentSelected.id)].name = newName;
        break;
      case 'Product':
        this.allProducts[this.allProducts.findIndex(x => x.id === this.currentSelected.id)].name = newName;
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
      this.currentSelected.selected = false;
      this.currentSelected.isSettingName = false;
      delete this.currentSelected;
    }

    if (event.keyCode === 13) {
      this.currentSelected.isSettingName = false;
    }
  }
}

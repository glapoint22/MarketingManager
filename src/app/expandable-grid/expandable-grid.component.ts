import { Component, OnInit } from '@angular/core';
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

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get(this.apiUrl)
      .subscribe((response: any) => {

        //Categories
        this.allCategories = response
          .map(x => ({
            id: x.id,
            name: x.name
          }));
        this.items = this.allCategories.map(x => Object.assign({}, x));

        //Niches
        this.allNiches = response
          .map(x => x.niches
            .map(y => ({
              categoryId: x.id,
              id: y.id,
              name: y.name
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
                hopLink: z.hopLink
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

  clearText(search){
    search.value = '';
    this.onSearchChange('');
  }

}

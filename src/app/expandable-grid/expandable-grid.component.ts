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
  public tier1: string;
  public tier2: string;
  public tier3: string;

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
        this.items = this.allCategories.slice();

        //Niches
        this.allNiches = response
          .map(x => x.niches
            .map(y => ({
              categoryId: x.id,
              id: y.id,
              name: y.name
            })));
        this.allNiches = [].concat.apply([], this.allNiches);
        this.niches = this.allNiches.slice();


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
        this.products = this.allProducts.slice();

      }, error => {
        // Error
      });
  }

  onTier1CheckboxChange(index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[index][this.tier2] = this.niches.filter(x => x.categoryId == this.items[index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier2TransitionEnd(index: number, checkbox) {
    if (!checkbox.checked && this.items[index][this.tier2]) {
      delete this.items[index][this.tier2];
    }
  }

  onTier2CheckboxChange(tier1Index: number, tier2Index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[tier1Index][this.tier2][tier2Index][this.tier3] = this.products.filter(x => x.nicheId == this.items[tier1Index][this.tier2][tier2Index].id);
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier3TransitionEnd(tier1Index: number, tier2Index: number, checkbox) {
    if (!checkbox.checked && this.items[tier1Index][this.tier2][tier2Index][this.tier3]) {
      delete this.items[tier1Index][this.tier2][tier2Index][this.tier3];
    }
  }

  onSearchChange(searchValue: string) {
    this.products = this.allProducts.filter(x => x.name.toLowerCase().includes(searchValue)).slice();
    let nicheIds = this.products.map(x => x.nicheId).filter((v, i, a) => a.indexOf(v) === i);
    this.niches = this.allNiches.filter(x => nicheIds.some(a => x.id === a)).slice();
    let categoryIds = this.niches.map(x => x.categoryId).filter((v, i, a) => a.indexOf(v) === i);
    this.items = this.allCategories.filter(x => categoryIds.some(a => x.id === a)).slice();
  }



}

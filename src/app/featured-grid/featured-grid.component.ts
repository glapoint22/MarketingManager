import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';
import { SaveService } from "../save.service";

@Component({
  selector: 'featured-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './featured-grid.component.scss']
})
export class FeaturedGridComponent extends EditableGridComponent implements OnInit, OnChanges {
  @Input() categories;
  @Input() products;
  private categoriesTier: Itier;
  private productsTier: Itier;
  public isFeatured: boolean = true;
  public showNonFeaturedList: boolean;
  public nonFeaturedSearchValue: string = '';

  constructor(dataService: DataService, saveService: SaveService) { super(dataService, saveService) }

  ngOnInit() {
    this.tierComponent.parentTierHeight = 230;
  }

  createTiers() {
    let headerButtons = this.setHeaderButtons('New Featured Category', 'Delete Featured Category', 0);
    headerButtons.unshift(
      {
        name: 'Switch to Featured Products',
        icon: 'fas fa-cubes',
        onClick: () => {
          this.switchTiers(this.productsTier);
        },
        getDisabled: () => {
          return false;
        }
      }
    );

    this.categoriesTier = {
      index: 0,
      name: 'Categories',
      items: this.categories.items,
      fields: [
        {
          name: 'Category',
          defaultValue: 'My Category',
          width: 420
        }
      ],
      headerButtons: headerButtons,
      rowButtons: []
    };


    headerButtons = this.setHeaderButtons('New Featured Product', 'Delete Featured Product', 2);
    headerButtons.unshift(
      {
        name: 'Switch to Featured Categories',
        icon: 'fas fa-sitemap',
        onClick: () => {
          this.switchTiers(this.categoriesTier);
        },
        getDisabled: () => {
          return false;
        }
      }
    );

    this.productsTier = {
      index: 0,
      name: 'Products',
      items: this.products.items,
      fields: [
        {
          name: 'Product',
          defaultValue: 'My Product',
          width: 420
        }
      ],
      headerButtons: headerButtons,
      rowButtons: []
    };

    this.tiers.push(this.categoriesTier);

    super.createTiers();
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges.categories.currentValue) {
      this.createTiers();
      this.setSearchOptions();
    }
  }

  switchTiers(tier) {
    if (this.currentItem && this.currentItem.isSelected) this.currentItem.isSelected = false;
    this.tiers[0] = tier;
    this.selectedSearchOption = tier.name;
    this.showNonFeaturedList = false;
    this.clearSearchText();
    this.tierComponent.setTier(this.tiers[0]);
    this.nonFeaturedSearchValue = '';
  }

  deleteItem(item: any) {
    item.featured = false;
  }

  createNewItem(){
    this.showNonFeaturedList = !this.showNonFeaturedList;
    if(this.currentItem)this.currentItem.isSelected = false;
  }

  onNonFeaturedItemClick(item){
    item.featured = true;
    this.change += 1;
    this.showNonFeaturedList = false;
    this.nonFeaturedSearchValue = '';
  }

  clearSearch(search){
    search.value = '';
    this.nonFeaturedSearchValue = '';
  }
}
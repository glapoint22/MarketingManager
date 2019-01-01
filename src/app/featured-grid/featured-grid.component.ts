import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from '../grid-button';

@Component({
  selector: 'featured-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './featured-grid.component.scss']
})
export class FeaturedGridComponent extends EditableGridComponent implements OnInit, OnChanges {
  @Input() categories;
  @Input() products;
  @Input() niches;
  private categoriesTier: Itier;
  private productsTier: Itier;
  public isFeatured: boolean = true;
  public showNonFeaturedList: boolean;
  public nonFeaturedSearchValue: string = '';

  constructor(dataService: DataService, saveService: SaveService, promptService: PromptService) { super(dataService, saveService, promptService) }

  ngOnInit() {
    this.tierComponent.parentTierHeight = 230;
  }

  createTiers() {
    let headerButtons: Array<GridButton> = this.setHeaderButtons('New Featured Category', 'Delete Featured Category');
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
      items: this.categories.items.map(x => Object.assign({}, x)),
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


    headerButtons = this.setHeaderButtons('New Featured Product', 'Delete Featured Product');
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
      items: this.products.items.map(x => Object.assign({}, x)),
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
    this.productsTier.items.forEach(x => x.tierIndex = 0);

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
    let shopItem = this.getItem(item, item.parentId !== undefined ? this.products : this.categories);

    this.saveUpdate(shopItem, shopItem.parentId !== undefined ? this.products : this.categories);
    item.featured = false;
    shopItem.featured = false;
    this.saveService.checkForNoChanges();
  }

  createNewItem() {
    this.showNonFeaturedList = !this.showNonFeaturedList;
    if (this.currentItem) this.currentItem.isSelected = false;
  }

  onNonFeaturedItemClick(item) {
    let shopItem = this.getItem(item, item.parentId !== undefined ? this.products : this.categories);

    this.saveUpdate(shopItem, shopItem.parentId !== undefined ? this.products : this.categories);
    item.featured = true;
    shopItem.featured = true;
    this.change += 1;
    this.showNonFeaturedList = false;
    this.nonFeaturedSearchValue = '';
    this.saveService.checkForNoChanges();
  }

  clearSearch(search) {
    search.value = '';
    this.nonFeaturedSearchValue = '';
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.hasFocus && this.showNonFeaturedList && event.code === 'Escape') {
      this.showNonFeaturedList = false;
    } else {
      super.handleKeyboardEvent(event);
    }
  }

  onItemSelect(item: any): void {
    this.showNonFeaturedList = false;
    super.onItemSelect(item);
  }

  onShopItemDelete(item) {
    switch (item.tierIndex) {
      case 0:
        this.getItem(item, this.categoriesTier).isDeleted = true;
        let niches = this.niches.items.filter(x => x.parentId === item.id);
        niches.forEach(niche => {
          let products = this.productsTier.items.filter(x => x.parentId === niche.id);
          products.forEach(x => x.isDeleted = true);
        });
        break;
      case 1:
        let products = this.productsTier.items.filter(x => x.parentId === item.id);
        products.forEach(x => x.isDeleted = true);
        break;
      case 2:
        this.getItem(item, this.productsTier).isDeleted = true;
        break;
    }

    this.change += 1;
  }
  onNewItem(item) {
    let tier = (item.parentId !== undefined ? this.productsTier : this.categoriesTier);

    tier.items.push(Object.assign({}, item));
    tier.items[tier.items.length - 1].isInEditMode = false;
  }

  saveDelete(item) { }

  getItem(item, tier) {
    let index = tier.items.findIndex(x => x.data[0].value === item.data[0].value);
    return tier.items[index];
  }

  setParentTierHeight() {}
}
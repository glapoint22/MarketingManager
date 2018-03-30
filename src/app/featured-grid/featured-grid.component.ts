import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';

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

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.tierComponent.parentTierHeight = 228;
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
      items: this.categories.items.filter(x => x.featured),
      fields: [
        {
          name: 'Category',
          defaultValue: 'My Category',
          width: 250
        }
      ],
      headerButtons: headerButtons,
      rowButtons: []
    };


    headerButtons = this.setHeaderButtons('New Featured Product', 'Delete Featured Product', 0);
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
      items: this.products.items.filter(x => x.featured),
      fields: [
        {
          name: 'Product',
          defaultValue: 'My Product',
          width: 130
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
    this.clearSearchText();
    this.tierComponent.setTier(this.tiers[0]);
  }
}
import { Component, OnInit, HostListener } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';

@Component({
  selector: 'shop-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends GridComponent implements OnInit {

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    this.apiParameters = [{ key: 'includeProducts', value: true }];
    super.ngOnInit();
  }
  setGridHeight() {
    this.gridHeight = window.innerHeight - 66;
  }

  createTiers(data: Array<any>) {
    // Categories
    this.tiers.push({
      index: 0,
      name: 'Categories',
      items: data
        .map(x => ({
          id: x.id,
          tierIndex: 0,
          data: [
            {
              value: x.name
            }
          ]
        })),
      fields: [
        {
          name: 'Category',
          defaultValue: 'My Category',
          width: 300
        }
      ],
      headerButtons: [
        {
          name: 'Create Category',
          icon: 'fas fa-file-alt',
          onClick: () => {
            console.log('Create');
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          name: 'Delete Category',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            console.log('Delete');
          },
          getDisabled: () => {
            return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == 0) : true;
          }
        }
      ]
    });

    //Niches
    let items = data
      .map(x => x.niches
        .map(y => ({
          parentId: x.id,
          id: y.id,
          tierIndex: 1,
          data: [
            {
              value: y.name
            }
          ]
        })));
    items = [].concat.apply([], items);

    this.tiers.push({
      index: 1,
      name: 'Niches',
      items: items,
      fields: [
        {
          name: 'Niche',
          defaultValue: 'My Niche',
          width: 300
        }
      ],
      headerButtons: [
        {
          name: 'Create Niche',
          icon: 'fas fa-file-alt',
          onClick: () => {
            console.log('Create');
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          name: 'Delete Niche',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            console.log('Delete');
          },
          getDisabled: () => {
            return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == 1) : true;
          }
        }
      ]
    });

    //Products
    items = data
      .map(x => x.niches
        .map(y => y.products
          .map(z => ({
            parentId: y.id,
            id: z.id,
            tierIndex: 2,
            data: [
              {
                value: z.name
              },
              {
                value: z.hopLink
              },
              {
                value: z.description
              },
              {
                value: z.price.toLocaleString('eng', { style: 'currency', currency: 'USD' })
              }
            ],
            filters: z.filters
          }))));

    items = [].concat.apply([], items.concat.apply([], items));

    this.tiers.push({
      index: 2,
      name: 'Products',
      items: items,
      fields: [
        {
          name: 'Product',
          defaultValue: 'My Product',
          width: 200
        },
        {
          name: 'HopLink',
          defaultValue: 'HopLink URL',
          width: 320
        },
        {
          name: 'Description',
          defaultValue: 'Product Description',
          width: 730
        },
        {
          name: 'Price',
          defaultValue: '$0.00',
          width: 50
        }
      ],
      headerButtons: [
        {
          name: 'Create Product',
          icon: 'fas fa-file-alt',
          onClick: () => {
            console.log('Create');
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          name: 'Delete Product',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            console.log('Delete');
          },
          getDisabled: () => {
            return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == 2) : true;
          }
        }
      ]
    });

    this.tierComponent.grid = this;
    this.tierComponent.setTier(this.tiers[0]);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setGridHeight();
  }
}
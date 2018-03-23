import { Component, OnInit, HostListener } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { Itier } from '../itier';

@Component({
  selector: 'shop-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends EditableGridComponent implements OnInit {

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
      headerButtons: this.setHeaderButtons('Create Category', 'Delete Category', 0),
      rowButtons: this.setRowButtons('Edit Category')
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
      headerButtons: this.setHeaderButtons('Create Niche', 'Delete Niche', 1),
      rowButtons: this.setRowButtons('Edit Niche')
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

    let rowButtons = this.setRowButtons('Edit Product');
    rowButtons.unshift(
      {
        name: 'Filter Product',
        icon: 'fas fa-filter',
        onClick: (item) => {
          console.log(item);
        }
      }
    );

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
      headerButtons: this.setHeaderButtons('Create Product', 'Delete Product', 2),
      rowButtons: rowButtons
    });

    super.createTiers();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setGridHeight();
  }
}
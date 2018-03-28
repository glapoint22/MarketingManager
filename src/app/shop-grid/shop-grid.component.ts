import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'shop-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends EditableGridComponent implements OnInit {
  @Input() filterGrid;
  public filtersContainerTop: number = 0;
  public showFiltersContainer: boolean = false;
  public filters: Array<any> = [];
  private filterActivated: boolean;

  constructor(dataService: DataService, private element: ElementRef) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    this.apiParameters = [{ key: 'includeProducts', value: true }];
    this.setParentTierHeight();
    super.ngOnInit();
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
          featured: x.featured,
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
      headerButtons: this.setHeaderButtons('New Category', 'Delete Category', 0),
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
      headerButtons: this.setHeaderButtons('New Niche', 'Delete Niche', 1),
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
            featured: z.featured,
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
        onClick: (item, row) => {
          //Flag that the filters have been clicked
          this.filterActivated = true;

          //Show or hide the filters container
          if (this.currentItem === item) {
            this.showFiltersContainer = !this.showFiltersContainer
          } else {
            this.showFiltersContainer = true;
          }

          //Position the filters container
          switch (this.tierToSearch) {
            case 0:
              this.filtersContainerTop = row.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + row.offsetParent.offsetParent.offsetTop + row.offsetTop + 73;
              break;
            case 1:
              this.filtersContainerTop = row.offsetParent.offsetParent.offsetTop + row.offsetTop + 51;
              break;
            case 2:
              this.filtersContainerTop = row.offsetTop + 28;
          }

          //Set the data
          this.filters = this.filterGrid.tiers[0].items
            .map(x => ({
              id: x.id,
              name: x.data[0].value,
              options: this.filterGrid.tiers[1].items
                .filter(y => y.parentId === x.id)
                .map(z => ({
                  id: z.id,
                  name: z.data[0].value,
                  isChecked: item.filters.some(x => x === z.id)
                }))
            }))
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
          width: 1600
        },
        {
          name: 'HopLink',
          defaultValue: 'HopLink URL',
          width: 2560
        },
        {
          name: 'Description',
          defaultValue: 'Product Description',
          width: 5840
        },
        {
          name: 'Price',
          defaultValue: '$0.00',
          width: 400
        }
      ],
      headerButtons: this.setHeaderButtons('New Product', 'Delete Product', 2),
      rowButtons: rowButtons
    });

    super.createTiers();
    this.element.nativeElement.firstElementChild.focus();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setParentTierHeight();
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.hasFocus) {
      //Escape
      if (event.keyCode === 27) {
        this.showFiltersContainer = false;
      }
    }

    super.handleKeyboardEvent(event);
  }

  onItemSelect(item: any): void {
    if (this.filterActivated) {
      this.filterActivated = false;
    } else {
      if (item !== this.currentItem) this.showFiltersContainer = false;
    }
    super.onItemSelect(item);
  }

  onTierCollapse() {
    this.showFiltersContainer = false;
  }

  setParentTierHeight(){
    this.tierComponent.parentTierHeight = window.innerHeight - 91;
  }
}
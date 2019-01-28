import { Component, OnInit, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { EditableGridComponent } from "../editable-grid/editable-grid.component";
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from '../grid-button';
import { TokenService } from '../token.service';

@Component({
  selector: 'shop-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends EditableGridComponent implements OnInit {
  @Input() filterGrid;
  @Output() onDelete = new EventEmitter<any>();
  @Output() onNewItem = new EventEmitter<any>();
  public filtersContainerTop: number = 0;
  public showFiltersContainer: boolean = false;
  public filters: Array<any> = [];
  private filterButtonClicked: boolean;

  constructor(dataService: DataService,
    saveService: SaveService,
    tokenService: TokenService,
    promptService: PromptService,
    private element: ElementRef) { super(dataService, saveService, tokenService, promptService) }

  ngOnInit() {
    this.apiUri = 'api/Categories/Manager';
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
          icon: x.icon,
          categoryImages: x.categoryImages,
          data: [
            {
              value: x.name
            }
          ]
        })),
      fields: [
        {
          name: 'Category',
          defaultValue: 'Category Name',
          width: 300
        }
      ],
      headerButtons: this.setHeaderButtons('New Category', 'Delete Category'),
      rowButtons: this.setRowButtons('Edit Category'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value,
          Icon: item.icon,
          Featured: item.featured,
          CategoryImages: item.categoryImages.map(y => ({
            CategoryID: item.id,
            Name: y.name,
            Selected: y.isSelected
          }))
        }
      },
      check: (item) => {
        if (item.data[0].value === 'Category Name') {
          this.promptService.prompt('Quality Control', 'Category cannot have a name of "Category Name".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }
        if (item.icon === null) {
          this.promptService.prompt('Quality Control', 'Category "' + item.data[0].value + '" needs an icon.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.categoryImages.length === 0) {
          this.promptService.prompt('Quality Control', 'Category "' + item.data[0].value + '" needs at least one category image.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }
        return true;
      },
      url: 'api/Categories'
    });

    //Niches
    let items = data
      .map(x => x.niches
        .map(y => ({
          parentId: x.id,
          id: y.id,
          tierIndex: 1,
          icon: y.icon,
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
          defaultValue: 'Niche Name',
          width: 300
        }
      ],
      headerButtons: this.setHeaderButtons('New Niche', 'Delete Niche'),
      rowButtons: this.setRowButtons('Edit Niche'),
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value,
          Icon: item.icon,
          CategoryID: item.parentId
        }
      },
      check: (item) => {
        if (item.data[0].value === 'Niche Name') {
          this.promptService.prompt('Quality Control', 'Niche cannot have a name of "Niche Name".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.icon === null) {
          this.promptService.prompt('Quality Control', 'Niche "' + item.data[0].value + '" needs an icon.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        return true;
      },
      url: 'api/Niches'
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
            image: z.image,
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
                value: z.price.toString(),
                type: 'currency'
              }
            ],
            filters: z.filters,
            banners: z.banners,
            videos: z.videos
          }))));

    items = [].concat.apply([], items.concat.apply([], items));

    let rowButtons: Array<GridButton> = this.setRowButtons('Edit Product');
    rowButtons.unshift(
      {
        name: 'Filter Product',
        icon: 'fas fa-filter',
        onClick: (item, rowButton) => {
          //Flag that the filter button has been clicked
          this.filterButtonClicked = true;

          //Show or hide the filters container
          if (this.currentItem === item) {
            this.showFiltersContainer = !this.showFiltersContainer
          } else {
            this.showFiltersContainer = true;
          }

          //Position the filters container
          switch (this.tierToSearch) {
            case 0:
              this.filtersContainerTop = rowButton.offsetParent.offsetParent.offsetParent.offsetParent.offsetTop + rowButton.offsetParent.offsetParent.offsetTop + rowButton.offsetTop + 73;
              break;
            case 1:
              this.filtersContainerTop = rowButton.offsetParent.offsetParent.offsetTop + rowButton.offsetTop + 51;
              break;
            case 2:
              this.filtersContainerTop = rowButton.offsetTop + 28;
          }

          //Set the data
          this.filters = this.filterGrid.tiers[0].items.filter(x => !x.isDeleted).sort((a, b) => {
            if (a.data[0].value.toLowerCase() > b.data[0].value.toLowerCase()) return 1;
            if (a.data[0].value.toLowerCase() < b.data[0].value.toLowerCase()) return -1;
          })
            .map(x => ({
              id: x.id,
              name: x.data[0].value,
              options: this.filterGrid.tiers[1].items.filter(y => !y.isDeleted && y.parentId === x.id).sort((a, b) => {
                if (a.data[0].value.toLowerCase() > b.data[0].value.toLowerCase()) return 1;
                if (a.data[0].value.toLowerCase() < b.data[0].value.toLowerCase()) return -1;
              })
                .map(z => ({
                  id: z.id,
                  name: z.data[0].value,
                  isChecked: item.filters ? item.filters.some(x => x.filterOption === z.id) : false
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
          defaultValue: 'Product Name',
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
          defaultValue: 0,
          width: 500
        }
      ],
      headerButtons: this.setHeaderButtons('New Product', 'Delete Product'),
      rowButtons: rowButtons,
      setItem: (item) => {
        return {
          ID: item.id,
          Name: item.data[0].value,
          NicheID: item.parentId,
          HopLink: item.data[1].value,
          Description: item.data[2].value,
          Image: item.image,
          Price: item.data[3].value,
          Featured: item.featured,
          ProductBanners: item.banners.map(x => ({
            ProductID: item.id,
            Name: x.name,
            Selected: x.isSelected
          })),
          ProductFilters: item.filters.map(x => ({
            ID: x.id,
            ProductID: item.id,
            FilterLabelID: x.filterOption
          })),
          ProductVideos: item.videos.map(x => ({
            ProductID: item.id,
            Url: x
          }))
        }
      },
      check: (item) => {
        if (item.data[0].value === 'Product Name') {
          this.promptService.prompt('Quality Control', 'Product cannot have a name of "Product Name".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.data[1].value === 'HopLink URL') {
          this.promptService.prompt('Quality Control', 'Product "' + item.data[0].value + '" cannot have a HopLink of "HopLink URL".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.data[2].value === 'Product Description') {
          this.promptService.prompt('Quality Control', 'Product "' + item.data[0].value + '" cannot have a description of "Product Description".', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.data[3].value === 0 || item.data[3].value === '0') {
          this.promptService.prompt('Quality Control', 'Product "' + item.data[0].value + '" cannot have a price of zero.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        if (item.image === null) {
          this.promptService.prompt('Quality Control', 'Product "' + item.data[0].value + '" needs an image.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }

        for (let i = 0; i < item.videos.length; i++) {
          let currentVideo = item.videos[i];
          for (let j = 0; j < item.videos.length; j++) {
            if (j !== i) {
              let comparedVideo = item.videos[j];
              if (currentVideo === comparedVideo) {
                this.promptService.prompt('Quality Control', 'Product "' + item.data[0].value + '" has duplicate videos.', [
                  {
                    text: 'Ok',
                    callback: () => { }
                  }
                ]);
                return false
              }
            }
          }
        }

        return true;
      },
      url: 'api/Products'
    });

    super.createTiers();
    this.element.nativeElement.firstElementChild.focus();
    this.hasFocus = true;
  }


  handleKeyboardEvent(event: KeyboardEvent) {
    //Escape
    if (event.code === 'Escape') {
      if (this.showFiltersContainer) {
        this.showFiltersContainer = false;
        return;
      }
    }
    super.handleKeyboardEvent(event);
  }

  onItemSelect(item: any): void {
    if (this.filterButtonClicked) {
      this.filterButtonClicked = false;
    } else {
      if (item !== this.currentItem) this.showFiltersContainer = false;
    }
    super.onItemSelect(item);
  }

  onTierCollapse() {
    this.showFiltersContainer = false;
  }


  setDelete() {
    super.setDelete();
    this.onDelete.emit(this.currentItem);
  }

  createItemId(items: Array<any>, tierIndex: number): any {
    //Create an id for the new product
    if (tierIndex === 2) {
      let id = '', index = 0

      // Create a unique id that is 10 characters long
      while (index > -1 || id.length < 10 || id.length > 10) {
        id = Math.floor((Math.random()) * 0x10000000000).toString(16).toUpperCase();
        index = items.findIndex(x => x.id == id);
      }
      return id;
    } else {
      return super.createItemId(items, tierIndex);
    }
  }

  onFilterOptionChange(option) {
    this.saveUpdate(this.currentItem, this.tiers[2]);
    if (!option.isChecked) {
      option.isChecked = true;
      this.currentItem.filters.push({
        filterOption: option.id,
      });
      this.currentItem.filters.sort((a, b) => { return a - b });
    } else {
      option.isChecked = false;
      this.currentItem.filters.splice(this.currentItem.filters.findIndex(x => x.filterOption === option.id), 1);
    }
    this.saveService.checkForNoChanges();
  }

  createNewItem(tierIndex: number, parentId: number) {
    super.createNewItem(tierIndex, parentId);

    switch (tierIndex) {
      case 0:
        this.tiers[tierIndex].items[0].featured = false;
        this.tiers[tierIndex].items[0].icon = null;
        this.tiers[tierIndex].items[0].categoryImages = [];
        break;
      case 1:
        this.tiers[tierIndex].items[0].icon = null;
        break;
      case 2:
        this.tiers[tierIndex].items[0].featured = false;
        this.tiers[tierIndex].items[0].filters = [];
        this.tiers[tierIndex].items[0].image = null;
        this.tiers[tierIndex].items[0].banners = [];
        this.tiers[tierIndex].items[0].videos = [];
        this.tiers[tierIndex].items[0].data[3].type = 'currency';
    }
    this.onItemClick.emit(this.tiers[tierIndex].items[0]);
    this.onNewItem.emit(this.tiers[tierIndex].items[0]);
  }

  onBlur() {
    super.onBlur();
    this.showFiltersContainer = false;
  }
}
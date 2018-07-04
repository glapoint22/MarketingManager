import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from "../data.service";
import { DomSanitizer } from '@angular/platform-browser';
import { ShopGridComponent } from '../shop-grid/shop-grid.component';
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";

@Component({
  selector: 'media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('videoInput') videoInput: ElementRef;
  @Input() shopGrid: ShopGridComponent;
  public contents: Array<any> = [];
  public showVideoInput: boolean = false;
  public mode: any;
  public currentItem: any;
  private categoryIcon: any;
  private categoryImages: any;
  private nicheIcon: any;
  private productImage: any;
  private productVideos: any;
  private productBanners: any;

  constructor(public dataService: DataService, private sanitizer: DomSanitizer, private saveService: SaveService, private promptService: PromptService) { }

  ngOnInit() {
    // Category Icon
    this.categoryIcon = {
      name: 'Category Icon',
      display: 'single',
      type: 'image',
      buttons: [
        {
          title: 'Switch to Category Images',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.categoryImages;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'New Category Icon',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click(),
          getDisabled: () => {
            return false;
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.icon = image;
      },
      initialize: () => {
        this.contents = [];
        if (this.currentItem.icon !== null) {
          this.contents[0] = {
            name: this.currentItem.icon,
            isSelected: false
          }
        }
      },
      onClick: () => { }
    }

    // Category Images
    this.categoryImages = {
      name: 'Category Images',
      display: 'horizontal',
      type: 'image',
      buttons: [
        {
          title: 'Switch to Category Icon',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.categoryIcon;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Delete Category Image',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            if (this.contents.length > 0) {
              this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete this category image?', [
                {
                  text: 'Yes',
                  callback: () => {
                    this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);

                    let imageIndex = this.contents.findIndex(x => x.isSelected);
                    let image = this.contents[imageIndex].name;
                    let saveItem = this.saveService.updatedItems.filter(x => x.item === this.currentItem)[0];

                    if (!saveItem.originalItem.categoryImages.some(x => x.name === image)) {
                      // Delete image on the server
                      this.dataService.delete('/api/Image', image).subscribe(() => { });
                    }

                    this.contents.splice(imageIndex, 1);
                    if (this.contents.length > 0) {
                      this.contents[0].isSelected = true;
                    }
                    this.saveService.checkForNoChanges();
                  }
                },
                {
                  text: 'No',
                  callback: () => { }
                }
              ]);
            }

          },
          getDisabled: () => {
            return this.contents.length === 0;
          }
        },
        {
          title: 'New Category Image',
          icon: 'fas fa-file-alt',
          onClick: () => {
            this.fileInput.nativeElement.click()
          },
          getDisabled: () => {
            return false;
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.categoryImages.push({
          name: image,
          isSelected: this.currentItem.categoryImages.length === 0
        });
      },
      initialize: () => {
        this.contents = [];
        if (this.currentItem.categoryImages.length > 0) this.contents = this.currentItem.categoryImages;
      },
      onClick: (image) => {
        this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);
        this.contents.forEach(x => x.isSelected = image === x);
      }
    }


    // Niche Icon
    this.nicheIcon = {
      name: 'Niche Icon',
      display: 'single',
      type: 'image',
      buttons: [
        {
          title: 'New Icon',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click(),
          getDisabled: () => {
            return false;
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.icon = image;
      },
      initialize: () => {
        this.contents = [];
        if (this.currentItem.icon !== null) {
          this.contents[0] = {
            name: this.currentItem.icon,
            isSelected: false
          }
        }
      },
      onClick: () => { }
    }

    // Product Image
    this.productImage = {
      name: 'Product Image',
      display: 'single',
      type: 'image',
      buttons: [
        {
          title: 'Product Banners',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.productBanners;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Product Videos',
          icon: 'fas fa-film',
          onClick: () => {
            this.mode = this.productVideos;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'New Image',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click(),
          getDisabled: () => {
            return false;
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.image = image;
      },
      initialize: () => {
        this.contents = [];
        if (this.currentItem.image !== null) {
          this.contents[0] = {
            name: this.currentItem.image,
            isSelected: false
          }
        }
      },
      onClick: () => { }
    }


    // Product Videos
    this.productVideos = {
      name: 'Product Videos',
      display: 'horizontal',
      type: 'video',
      buttons: [
        {
          title: 'Product Banners',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.productBanners;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Product Image',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.productImage;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Delete Video(s)',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            if (this.contents.some(x => x.isSelected)) {
              this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete ' +
                (this.contents.filter(x => x.isSelected).length === 1 ? 'this product video?' : 'these product videos?'), [
                  {
                    text: 'Yes',
                    callback: () => {
                      for (let i = this.currentItem.videos.length - 1; i > -1; i--) {
                        if (this.contents[i].isSelected) {
                          this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);
                          this.currentItem.videos.splice(i, 1);
                        }
                      }
                      this.contents = this.contents.filter(x => !x.isSelected)
                      this.saveService.checkForNoChanges();
                    }
                  },
                  {
                    text: 'No',
                    callback: () => { }
                  }
                ]);
            }
          },
          getDisabled: () => {
            return !this.contents.some(x => x.isSelected);
          }
        },
        {
          title: 'New Video',
          icon: 'fas fa-file-alt',
          onClick: () => {
            this.videoInput.nativeElement.value = '';
            this.showVideoInput = !this.showVideoInput;
          },
          getDisabled: () => {
            return false;
          }
        }
      ],
      initialize: () => {
        this.contents = [];
        if (this.currentItem.videos.length > 0) {
          this.currentItem.videos.forEach(video => this.contents.push({
            url: this.sanitizer.bypassSecurityTrustResourceUrl(video),
            isSelected: false
          }));
        }
      },
      onClick: () => { },
      onSubmit: (url) => {
        if (url.search(/\S/) !== -1) {
          this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);
          this.currentItem.videos.push(url);
          this.contents.push({
            url: this.sanitizer.bypassSecurityTrustResourceUrl(url),
            isSelected: false
          });
        }
        this.showVideoInput = false;
      }
    }

    // Product Banners
    this.productBanners = {
      name: 'Product Banners',
      display: 'vertical',
      type: 'image',
      buttons: [
        {
          title: 'Product Image',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.productImage;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Product Videos',
          icon: 'fas fa-film',
          onClick: () => {
            this.mode = this.productVideos;
            this.mode.initialize();
          },
          getDisabled: () => {
            return false;
          }
        },
        {
          title: 'Delete Banner(s)',
          icon: 'fas fa-trash-alt',
          onClick: () => {
            if (this.contents.some(x => x.isSelected)) {
              this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete ' +
                (this.contents.filter(x => x.isSelected).length === 1 ? 'this product banner?' : 'these product banners?'), [
                  {
                    text: 'Yes',
                    callback: () => {
                      for (let i = this.contents.length - 1; i > -1; i--) {
                        if (this.contents[i].isSelected) {
                          this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);

                          let saveItem = this.saveService.updatedItems.filter(x => x.item === this.currentItem)[0];

                          if (!saveItem.originalItem.banners.some(x => x.name === this.contents[i].name)) {
                            // Delete image on the server
                            this.dataService.delete('/api/Image', this.contents[i].name).subscribe(() => { });
                          }

                          this.contents.splice(i, 1);
                        }
                      }
                      this.saveService.checkForNoChanges();
                    }
                  },
                  {
                    text: 'No',
                    callback: () => { }
                  }
                ]);
            }
          },
          getDisabled: () => {
            return !this.contents.some(x => x.isSelected);
          }
        },
        {
          title: 'New Banner',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click(),
          getDisabled: () => {
            return false;
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.banners.push({
          name: image,
          isSelected: false
        });
      },
      initialize: () => {
        this.contents = [];
        if (this.currentItem.banners.length > 0) this.contents = this.currentItem.banners;
      },
      onClick: (image) => {
        this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);
        image.isSelected = !image.isSelected;
      }
    }
  }

  uploadImage(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let formData: FormData = new FormData();
      formData.append('image', file, file.name);

      this.dataService.post('/api/Image', formData)
        .subscribe((image: any) => {
          this.shopGrid.saveUpdate(this.currentItem, this.shopGrid.tiers[this.currentItem.tierIndex]);
          this.mode.setNewImage(image);
          this.mode.initialize(image);
        });
    }
  }

  onItemClick(item) {
    switch (item.tierIndex) {
      case 0:
        this.mode = this.categoryIcon;
        break;
      case 1:
        this.mode = this.nicheIcon;
        break;
      case 2:
        this.mode = this.productImage;
        break;
    }
    this.showVideoInput = false;
    this.currentItem = item;
    this.mode.initialize();
  }
}
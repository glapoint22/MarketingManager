import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  public images: Array<any> = [];
  public mode: any;
  private currentItem: any;
  private categoryIcon: any;
  private categoryImages: any;
  private nicheIcon: any;
  private productImage: any;
  private productVideos: any;
  private productBanners: any;

  constructor(public dataService: DataService) { }


  ngOnInit() {
    // Category Icon
    this.categoryIcon = {
      name: 'Category Icon',
      display: 'single',
      buttons: [
        {
          title: 'New Icon',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click()
        },
        {
          title: 'Switch to Category Images',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.categoryImages;
            this.mode.initialize();
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.icon = image;
      },
      initialize: () => {
        this.images = [];
        if (this.currentItem.icon !== null) {
          this.images[0] = {
            name: this.currentItem.icon,
            isSelected: false
          }
        }
      }
    }

    // Category Images
    this.categoryImages = {
      name: 'Category Images',
      display: 'horizontal',
      buttons: [
        {
          title: 'Delete Image',
          icon: 'fas fa-trash-alt',
          onClick: () => { }
        },
        {
          title: 'New Image',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click()
        },
        {
          title: 'Switch to Category Icon',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.categoryIcon;
            this.mode.initialize();
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
        this.images = [];
        if (this.currentItem.categoryImages.length > 0) this.images = this.currentItem.categoryImages;
      }
    }


    // Niche Icon
    this.nicheIcon = {
      name: 'Niche Icon',
      display: 'single',
      buttons: [
        {
          title: 'New Icon',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click()
        }
      ],
      setNewImage: (image) => {
        this.currentItem.icon = image;
      },
      initialize: () => {
        this.images = [];
        if (this.currentItem.icon !== null) {
          this.images[0] = {
            name: this.currentItem.icon,
            isSelected: false
          }
        }
      }
    }


    // Product Image
    this.productImage = {
      name: 'Product Image',
      display: 'single',
      buttons: [
        {
          title: 'New Image',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click()
        },
        {
          title: 'Product Videos',
          icon: 'fas fa-film',
          onClick: () => {
            this.mode = this.productVideos;
            this.mode.initialize();
          }
        },
        {
          title: 'Product Banners',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.productBanners;
            this.mode.initialize();
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.image = image;
      },
      initialize: () => {
        this.images = [];
        if (this.currentItem.image !== null) {
          this.images[0] = {
            name: this.currentItem.image,
            isSelected: false
          }
        }
      }
    }



    // Product Videos
    this.productVideos = {
      name: 'Product Videos',
      display: 'horizontal',
      buttons: [
        {
          title: 'New Video',
          icon: 'fas fa-file-alt',
          onClick: () => {}
        },
        {
          title: 'Product Image',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.productImage;
            this.mode.initialize();
          }
        },
        {
          title: 'Product Banners',
          icon: 'far fa-images',
          onClick: () => {
            this.mode = this.productBanners;
            this.mode.initialize();
          }
        }
      ],
      initialize: () => {
        // this.images = [];
        // if (this.currentItem.image !== null) {
        //   this.images[0] = {
        //     name: this.currentItem.image,
        //     isSelected: false
        //   }
        // }
      }
    }


    // Product Banners
    this.productBanners = {
      name: 'Product Banners',
      display: 'vertical',
      buttons: [
        {
          title: 'New Banner',
          icon: 'fas fa-file-alt',
          onClick: () => this.fileInput.nativeElement.click()
        },
        {
          title: 'Product Videos',
          icon: 'fas fa-film',
          onClick: () => {
            this.mode = this.productVideos;
            this.mode.initialize();
          }
        },
        {
          title: 'Product Image',
          icon: 'far fa-image',
          onClick: () => {
            this.mode = this.productImage;
            this.mode.initialize();
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.banners.push({
          name: image
        });
      },
      initialize: () => {
        this.images = [];
        if (this.currentItem.banners.length > 0) this.images = this.currentItem.banners;
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
          this.mode.setNewImage(image);
          this.mode.initialize(image);
        }, error => {
          // Error
        });
    }
  }

  onItemClick(item) {
    switch(item.tierIndex) {
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
    
    this.currentItem = item;
    this.mode.initialize();
  }

}

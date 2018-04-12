import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from "../data.service";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('videoInput') videoInput: ElementRef;
  public contents: Array<any> = [];
  public showVideoInput: boolean = false;
  public mode: any;
  private currentItem: any;
  private categoryIcon: any;
  private categoryImages: any;
  private nicheIcon: any;
  private productImage: any;
  private productVideos: any;
  private productBanners: any;

  constructor(public dataService: DataService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // Category Icon
    this.categoryIcon = {
      name: 'Category Icon',
      display: 'single',
      type: 'image',
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
        this.contents = [];
        if (this.currentItem.categoryImages.length > 0) this.contents = this.currentItem.categoryImages;
      },
      onClick: (image) => {
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
          onClick: () => this.fileInput.nativeElement.click()
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
          title: 'Delete Video(s)',
          icon: 'fas fa-trash-alt',
          onClick: () => { }
        },
        {
          title: 'New Video',
          icon: 'fas fa-file-alt',
          onClick: () => {
            this.videoInput.nativeElement.value = '';
            this.showVideoInput = !this.showVideoInput;
          }
          
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
        this.contents = [];
        if (this.currentItem.videos.length > 0) {
          this.currentItem.videos.forEach(video => this.contents.push({
            url: this.sanitizer.bypassSecurityTrustResourceUrl(video),
            isSelected: false
          }));
        }
      },
      onClick: () => {},
      onSubmit: (url) =>{
        this.currentItem.videos.push(url);
        this.contents.push({
          url: this.sanitizer.bypassSecurityTrustResourceUrl(url),
          isSelected: false
        });
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
          title: 'Delete Image',
          icon: 'fas fa-trash-alt',
          onClick: () => { }
        },
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
        this.contents = [];
        if (this.currentItem.banners.length > 0) this.contents = this.currentItem.banners;
      },
      onClick: () => { }
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
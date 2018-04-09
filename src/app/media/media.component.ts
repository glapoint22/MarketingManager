import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  // public buttons: Array<any> = [];
  public images: Array<any> = [];
  public mode: any;
  private currentItem: any;

  constructor(public dataService: DataService) { }


  ngOnInit() {
    // Category Icon Mode
    let CategoryIconMode = {
      name: 'Category Icon',
      imageWidth: 100,      
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
            this.mode = categoryImagesMode;
            this.mode.setImages();
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.icon = image;
      },
      setImages: () => {
        this.images = [];
        if (this.currentItem.icon !== null) this.images[0] = this.currentItem.icon;
      }
    }

    // Category Images mode
    let categoryImagesMode = {
      name: 'Category Images',
      imageWidth: 44,
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
            this.mode = CategoryIconMode;
            this.mode.setImages();
          }
        }
      ],
      setNewImage: (image) => {
        this.currentItem.categoryImages.push(image);
      },
      setImages: () => {
        this.images = [];
        if (this.currentItem.categoryImages.length > 0) this.images = this.currentItem.categoryImages;
      }
    }

    this.mode = CategoryIconMode;
  }



  uploadImage(event) {
    if (event.target.files.length > 0) {
      let file: File = event.target.files[0];
      let formData: FormData = new FormData();
      formData.append('image', file, file.name);

      this.dataService.post('/api/Image', formData)
        .subscribe((image: any) => {
          this.mode.setNewImage(image);
          this.mode.setImages(image);
        }, error => {
          // Error
        });
    }
  }

  onItemClick(item) {
    this.currentItem = item;
    this.mode.setImages();
  }

}

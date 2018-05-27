import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaComponent } from './media.component';
import { FormsModule } from '@angular/forms';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { ShopGridComponent } from '../shop-grid/shop-grid.component';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs';

class MockDataService {
  delete() { }
  post() { }
}
class MockSaveService {
  public updatedItems = [];
  checkForNoChanges() { }
}
class MockPromptService {
  public buttons;
  prompt(title: string, text: string, buttons: Array<any>) {
    this.buttons = buttons;
  }
}

describe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;
  let nativeElement: any;
  let promptService;
  let dataService;
  let saveService;
  let productItem = {
    "parentId": 112,
    "id": "6392272268",
    "tierIndex": 2,
    "featured": false,
    "image": "9796c5f5a376401694e356a9590e8c5c.jpg",
    "data": [
      {
        "value": "Strategy Guides 1"
      },
      {
        "value": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/"
      },
      {
        "value": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days."
      },
      {
        "value": "40.7934",
        "type": "currency"
      }
    ],
    "filters": [
      17,
      18,
      22,
      24,
      25,
      26
    ],
    "banners": [
      {
        "name": "244d85e1d87745cca9d5dbd03146fe06.jpg",
        "isSelected": false
      },
      {
        "name": "b4ac28e1a57440bca74db3b250d77231.jpg",
        "isSelected": false
      }
    ],
    "videos": [
      "//player.vimeo.com/video/203810510?title=0&byline=0&portrait=0&color=ffffff",
      "//player.vimeo.com/video/195471382?title=0&byline=0&portrait=0&color=ffffff"
    ],
    "isSelected": true
  }


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MediaComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    promptService = TestBed.get(PromptService);
    dataService = TestBed.get(DataService);
    saveService = TestBed.get(SaveService);
    let ele: ElementRef;
    component.shopGrid = new ShopGridComponent(dataService, ele, saveService, promptService);
    fixture.detectChanges();
  });

  describe('template', () => {
    it('should display "No Item Selected" if an item is NOT selected', () => {
      let noPreview = nativeElement.querySelector('.no-preview');
      expect(noPreview.innerHTML).toEqual('No Item Selected');
    });
  });

  describe('category icon', () => {
    beforeEach(() => {
      let item = { "id": 11, "tierIndex": 0, "featured": false, "icon": null, "categoryImages": [], "data": [{ "value": "Games" }], "isSelected": true };
      component.onItemClick(item);
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s icon when initialize is called', () => {
      component.currentItem = { icon: 'icon' }
      component.mode.initialize();
      expect(component.contents[0].name).toEqual('icon');
    });

    it('should display "Category Icon" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Category Icon');
    });

    it('should display two buttons, "Switch to Category Images" and "New Category Icon"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(2);
      expect(buttons[0].title).toEqual('Switch to Category Images');
      expect(buttons[1].title).toEqual('New Category Icon');
    });

    it('should set the title to "Category Images" and call initialize when "Switch to Category Images" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['categoryImages'], 'initialize');
      buttons[0].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Category Images');
      expect(initialize).toHaveBeenCalled();
    });

    it('should call click of the file input when "New Category Icon" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let click = spyOn(component.fileInput.nativeElement, 'click');
      buttons[1].click();
      expect(click).toHaveBeenCalled();
    });

    it('should set the current item\'s icon when setNewImage is called', () => {
      component.mode.setNewImage('icon');
      expect(component.currentItem.icon).toEqual('icon');
    });
  });


  describe('category Images', () => {
    beforeEach(() => {
      let item = { "id": 11, "tierIndex": 0, "featured": false, "icon": null, "categoryImages": [], "data": [{ "value": "Games" }], "isSelected": true };
      component.onItemClick(item);
      fixture.detectChanges();
      nativeElement.querySelectorAll('.button')[0].click();
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s category images when initialize is called', () => {
      component.currentItem = { categoryImages: ['image1', 'image2'] }
      component.mode.initialize();
      expect(component.contents).toEqual(['image1', 'image2']);
    });

    it('should display "Category Images" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Category Images');
    });

    it('should display three buttons, "Switch to Category Icon", "Delete Category Image", and "New Category Image"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(3);
      expect(buttons[0].title).toEqual('Switch to Category Icon');
      expect(buttons[1].title).toEqual('Delete Category Image');
      expect(buttons[2].title).toEqual('New Category Image');
    });

    it('should set the title to "Category Icon" and call initialize when "Switch to Category Icon" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['categoryIcon'], 'initialize');
      buttons[0].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Category Icon');
      expect(initialize).toHaveBeenCalled();
    });

    it('should call prompt when "Delete Category Image" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let prompt = spyOn(promptService, 'prompt');

      component.contents = ['image'];
      buttons[1].click();
      expect(prompt).toHaveBeenCalled();
    });

    describe('delete prompt yes button', () => {
      let saveUpdate;
      let del;
      let checkForNoChanges;
      let buttons;

      beforeEach(() => {
        buttons = nativeElement.querySelectorAll('.button');
        let item = { categoryImages: [{ name: 'image1' }, { name: 'image2' }] };


        component.currentItem = item;
        saveService.updatedItems = [{ item: item, originalItem: item }];

        saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
        del = spyOn(dataService, 'delete').and.returnValue(of('ok'));
        checkForNoChanges = spyOn(saveService, 'checkForNoChanges');

        component.contents = [{ name: 'imagezzz', isSelected: false }, { name: 'image1', isSelected: true }];
        buttons[1].click();
        promptService.buttons[0].callback();
      });


      it('should call saveUpdate', () => {
        expect(saveUpdate).toHaveBeenCalled();
      });

      it('should call dataService.delete only if the image is not stored on the server', () => {
        expect(del).not.toHaveBeenCalled();

        saveService.updatedItems[0].originalItem = { categoryImages: [{ name: 'image3' }, { name: 'image4' }] };
        component.contents = [{ name: 'imagezzz', isSelected: false }, { name: 'image1', isSelected: true }];
        buttons[1].click();
        promptService.buttons[0].callback();
        expect(del).toHaveBeenCalled();
      });

      it('should delete the selected image from contents', () => {
        expect(component.contents).toEqual([{ name: 'imagezzz', isSelected: true }]);
      });

      it('should call saveService.checkForNoChanges', () => {
        expect(checkForNoChanges).toHaveBeenCalled();
      });
    });


    it('should disable "Delete Category Image" button if there are no images', () => {
      component.contents = [{ name: 'imagezzz', isSelected: false }, { name: 'image1', isSelected: true }];
      expect(component.mode.buttons[1].getDisabled()).toBeFalsy();
      component.contents = [];
      expect(component.mode.buttons[1].getDisabled()).toBeTruthy();

    });

    it('should call click of the file input when "New Category Image" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let click = spyOn(component.fileInput.nativeElement, 'click');
      buttons[2].click();
      expect(click).toHaveBeenCalled();
    });

    it('should add a category image when setNewImage is called', () => {
      component.mode.setNewImage('image');
      expect(component.currentItem.categoryImages).toEqual([{
        name: 'image',
        isSelected: true
      }]);
    });

    it('should call shopGrid.saveUpdate when onClick is called', () => {
      let saveUpdate = spyOn(component.shopGrid, 'saveUpdate');

      component.mode.onClick();
      expect(saveUpdate).toHaveBeenCalled();
    });

    it('should mark the image as selected when onClick is called', () => {
      spyOn(component.shopGrid, 'saveUpdate');
      component.contents = [{ name: 'imagezzz', isSelected: false }, { name: 'image1', isSelected: true }];
      component.mode.onClick(component.contents[0]);
      expect(component.contents).toEqual([{ name: 'imagezzz', isSelected: true }, { name: 'image1', isSelected: false }]);
    });
  });

  describe('niche Icon', () => {
    beforeEach(() => {
      let item = { "parentId": 11, "id": 112, "tierIndex": 1, "icon": null, "data": [{ "value": "Strategy Guides" }], "isSelected": true };
      component.onItemClick(item);
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s icon when initialize is called', () => {
      component.currentItem = { icon: 'icon' }
      component.mode.initialize();
      expect(component.contents[0].name).toEqual('icon');
    });

    it('should display "Niche Icon" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Niche Icon');
    });

    it('should display one button, "New Icon"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(1);
      expect(buttons[0].title).toEqual('New Icon');
    });

    it('should call click of the file input when "New Icon" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let click = spyOn(component.fileInput.nativeElement, 'click');
      buttons[0].click();
      expect(click).toHaveBeenCalled();
    });

    it('should set the current item\'s icon when setNewImage is called', () => {
      component.mode.setNewImage('icon');
      expect(component.currentItem.icon).toEqual('icon');
    });
  });




  describe('product image', () => {
    beforeEach(() => {
      component.onItemClick(productItem);
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s image when initialize is called', () => {
      component.currentItem = productItem
      component.mode.initialize();
      expect(component.contents[0].name).toEqual('9796c5f5a376401694e356a9590e8c5c.jpg');
    });

    it('should display "Product Image" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Product Image');
    });

    it('should display three buttons, "Product Banners", "Product Videos", and "New Image"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(3);
      expect(buttons[0].title).toEqual('Product Banners');
      expect(buttons[1].title).toEqual('Product Videos');
      expect(buttons[2].title).toEqual('New Image');
    });

    it('should set the title to "Product Banners" and call initialize when "Product Banners" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productBanners'], 'initialize');
      buttons[0].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Banners');
      expect(initialize).toHaveBeenCalled();
    });

    it('should set the title to "Product Videos" and call initialize when "Product Videos" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productVideos'], 'initialize');
      buttons[1].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Videos');
      expect(initialize).toHaveBeenCalled();
    });

    it('should call click of the file input when "New Image" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let click = spyOn(component.fileInput.nativeElement, 'click');
      buttons[2].click();
      expect(click).toHaveBeenCalled();
    });

    it('should set the current item\'s image when setNewImage is called', () => {
      component.mode.setNewImage('image');
      expect(component.currentItem.image).toEqual('image');
    });
  });








  describe('product videos', () => {
    beforeEach(() => {
      component.onItemClick(productItem);
      fixture.detectChanges();
      nativeElement.querySelectorAll('.button')[1].click();
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s product videos when initialize is called', () => {
      component.currentItem = productItem
      component.mode.initialize();
      expect(component.contents.length).toEqual(2);
    });

    it('should display "Product Videos" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Product Videos');
    });

    it('should display four buttons, "Product Banners", "Product Image", "Delete Video(s)", and "New Video"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(4);
      expect(buttons[0].title).toEqual('Product Banners');
      expect(buttons[1].title).toEqual('Product Image');
      expect(buttons[2].title).toEqual('Delete Video(s)');
      expect(buttons[3].title).toEqual('New Video');
    });

    it('should set the title to "Product Banners" and call initialize when "Product Banners" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productBanners'], 'initialize');
      buttons[0].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Banners');
      expect(initialize).toHaveBeenCalled();
    });

    it('should set the title to "Product Image" and call initialize when "Product Image" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productImage'], 'initialize');
      buttons[1].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Image');
      expect(initialize).toHaveBeenCalled();
    });


    it('should call prompt when "Delete Video(s)" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let prompt = spyOn(promptService, 'prompt');

      component.contents[0].isSelected = true;
      buttons[2].click();
      expect(prompt).toHaveBeenCalled();
    });


    describe('delete prompt yes button', () => {
      let saveUpdate;
      let checkForNoChanges;
      let buttons;

      beforeEach(() => {
        buttons = nativeElement.querySelectorAll('.button');
        saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
        checkForNoChanges = spyOn(saveService, 'checkForNoChanges');

      });


      it('should call saveUpdate', () => {
        component.contents[1].isSelected = true;
        buttons[2].click();
        promptService.buttons[0].callback();
        expect(saveUpdate).toHaveBeenCalled();
      });

      it('should delete the selected videos', () => {
        component.contents[0].isSelected = true;
        buttons[2].click();
        promptService.buttons[0].callback();
        expect(component.contents.length).toEqual(0);
        expect(component.currentItem.videos.length).toEqual(0);
      });

      it('should call saveService.checkForNoChanges', () => {
        component.currentItem.Video = ['video'];
        component.contents = [{ isSelected: true }];
        buttons[2].click();
        promptService.buttons[0].callback();
        expect(checkForNoChanges).toHaveBeenCalled();
      });
    });

    it('should clear the video input\'s value when "New Video" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      component.videoInput.nativeElement.value = 'video';
      buttons[3].click();
      expect(component.videoInput.nativeElement.value).toEqual('');
    });

    it('should toggle the video input to be shown and hidden when "New Video" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      buttons[3].click();
      expect(component.showVideoInput).toBeTruthy();
      buttons[3].click();
      expect(component.showVideoInput).toBeFalsy();
    });

    it('should call saveUpdate when onSubmit is called', () => {
      let saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
      component.mode.onSubmit('//player.vimeo.com/video/195494203?title=0&byline=0&portrait=0&color=ffffff');
      expect(saveUpdate).toHaveBeenCalled();
    });

    it('should add the video when onSubmit is called', () => {
      let saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
      component.mode.onSubmit('//player.vimeo.com/video/195494203?title=0&byline=0&portrait=0&color=ffffff');
      expect(component.currentItem.videos.length).toEqual(2);
      expect(component.contents.length).toEqual(2);
    });

    it('should hide the video input when onSubmit is called', () => {
      component.showVideoInput = true;
      component.mode.onSubmit(' ');
      expect(component.showVideoInput).toBeFalsy();
    });
  });














  describe('product banners', () => {
    beforeEach(() => {
      component.onItemClick(productItem);
      fixture.detectChanges();
      nativeElement.querySelectorAll('.button')[0].click();
      fixture.detectChanges();
    });

    it('should set the contents to the current item\'s product banners when initialize is called', () => {
      component.currentItem = productItem
      component.mode.initialize();
      expect(component.contents).toEqual([{ "name": "244d85e1d87745cca9d5dbd03146fe06.jpg", "isSelected": false }, { "name": "b4ac28e1a57440bca74db3b250d77231.jpg", "isSelected": false }]);
    });

    it('should display "Product Banners" as the title', () => {
      let title = nativeElement.querySelector('.title');
      expect(title.innerHTML).toEqual('Product Banners');
    });

    it('should display four buttons, "Product Image", "Product Videos", "Delete Banner(s)", and "New Banner"', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      expect(buttons.length).toEqual(4);
      expect(buttons[0].title).toEqual('Product Image');
      expect(buttons[1].title).toEqual('Product Videos');
      expect(buttons[2].title).toEqual('Delete Banner(s)');
      expect(buttons[3].title).toEqual('New Banner');
    });

    it('should set the title to "Product Image" and call initialize when "Product Image" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productImage'], 'initialize');
      buttons[0].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Image');
      expect(initialize).toHaveBeenCalled();
    });

    it('should set the title to "Product Videos" and call initialize when "Product Videos" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let initialize = spyOn(component['productVideos'], 'initialize');
      buttons[1].click();
      fixture.detectChanges();
      expect(nativeElement.querySelector('.title').innerHTML).toEqual('Product Videos');
      expect(initialize).toHaveBeenCalled();
    });


    it('should call prompt when "Delete Banner(s)" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let prompt = spyOn(promptService, 'prompt');

      component.contents[0].isSelected = true;
      buttons[2].click();
      expect(prompt).toHaveBeenCalled();
    });





    describe('delete prompt yes button', () => {
      let saveUpdate;
      let del;
      let checkForNoChanges;
      let buttons;

      beforeEach(() => {
        buttons = nativeElement.querySelectorAll('.button');
        let item = {
          "banners": [
            {
              "name": "244d85e1d87745cca9d5dbd03146fe06.jpg",
              "isSelected": true
            },
            {
              "name": "b4ac28e1a57440bca74db3b250d77231.jpg",
              "isSelected": false
            }
          ]
        };


        component.currentItem = item;
        saveService.updatedItems = [{
          item: item, originalItem: {
            "banners": [

              {
                "name": "b4ac28e1a57440bca74db3b250d77231.jpg",
                "isSelected": false
              }
            ]
          }
        }];

        saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
        del = spyOn(dataService, 'delete').and.returnValue(of('ok'));
        checkForNoChanges = spyOn(saveService, 'checkForNoChanges');

        component.contents = [
          {
            "name": "244d85e1d87745cca9d5dbd03146fe06.jpg",
            "isSelected": true
          },
          {
            "name": "b4ac28e1a57440bca74db3b250d77231.jpg",
            "isSelected": false
          }
        ];
        buttons[2].click();
        promptService.buttons[0].callback();
      });


      it('should call saveUpdate', () => {
        expect(saveUpdate).toHaveBeenCalled();
      });

      it('should call dataService.delete only if the image is not stored on the server', () => {
        expect(del).toHaveBeenCalled();
      });

      it('should delete the selected image from contents', () => {
        expect(component.contents).toEqual([
          {
            "name": "b4ac28e1a57440bca74db3b250d77231.jpg",
            "isSelected": false
          }
        ]);
      });

      it('should call saveService.checkForNoChanges', () => {
        expect(checkForNoChanges).toHaveBeenCalled();
      });
    });


    it('should call click of the file input when "New Banner" button is clicked', () => {
      let buttons = nativeElement.querySelectorAll('.button');
      let click = spyOn(component.fileInput.nativeElement, 'click');
      buttons[3].click();
      expect(click).toHaveBeenCalled();
    });

    it('should add a banner to the current item when setNewImage is called', () => {
      component.mode.setNewImage('banner');
      expect(component.currentItem.banners).toEqual([{ "name": "244d85e1d87745cca9d5dbd03146fe06.jpg", "isSelected": true }, { "name": "b4ac28e1a57440bca74db3b250d77231.jpg", "isSelected": false }, { "name": "banner", "isSelected": false }]);
    });


    it('should call shopGrid.saveUpdate when onClick is called', () => {
      let saveUpdate = spyOn(component.shopGrid, 'saveUpdate');

      component.mode.onClick({ isSelected: false });
      expect(saveUpdate).toHaveBeenCalled();
    });


    it('should toggle the image being selected when onClick is called', () => {
      spyOn(component.shopGrid, 'saveUpdate');

      let image = { isSelected: false };

      component.mode.onClick(image);
      expect(image.isSelected).toBeTruthy();

      image = { isSelected: true };

      component.mode.onClick(image);
      expect(image.isSelected).toBeFalsy();
    });
  });

  describe('uploadImage', () => {
    it('should call dataService.post, saveUpdate, setNewImage, and initialize', () => {
      component.onItemClick(productItem);

      let post = spyOn(dataService, 'post').and.returnValue(of('ok'));
      let saveUpdate = spyOn(component.shopGrid, 'saveUpdate');
      let setNewImage = spyOn(component.mode, 'setNewImage');
      let initialize = spyOn(component.mode, 'initialize');

      component.uploadImage({ target: { files: ['image'] } });
      expect(post).toHaveBeenCalled();
      expect(saveUpdate).toHaveBeenCalled();
      expect(setNewImage).toHaveBeenCalled();
      expect(initialize).toHaveBeenCalled();
    });
  });
});
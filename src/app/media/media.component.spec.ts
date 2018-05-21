import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaComponent } from './media.component';
import { FormsModule } from '@angular/forms';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { ShopGridComponent } from '../shop-grid/shop-grid.component';
import { ElementRef } from '@angular/core';
import { of } from 'rxjs/observable/of';

class MockDataService {
  delete() { }
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

fdescribe('MediaComponent', () => {
  let component: MediaComponent;
  let fixture: ComponentFixture<MediaComponent>;
  let nativeElement: any;
  let promptService;
  let dataService;
  let saveService;

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


});

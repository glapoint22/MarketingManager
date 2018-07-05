import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedGridComponent } from './featured-grid.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { TierComponent } from '../tier/tier.component';
import { QueryList } from '@angular/core';
import { EditableGridComponent } from '../editable-grid/editable-grid.component';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'tier',
  template: '',
})
class MockTierComponent extends TierComponent { }
class MockDataService { }
class MockSaveService {
  checkForNoChanges() { }
}
class MockPromptService { }

describe('FeaturedGridComponent', () => {
  let component: FeaturedGridComponent;
  let fixture: ComponentFixture<FeaturedGridComponent>;
  let saveService: SaveService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FeaturedGridComponent, MockTierComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedGridComponent);
    component = fixture.componentInstance;
    component.tierComponent = new MockTierComponent();
    component.tierComponent.tierComponents = new QueryList<TierComponent>();
    component.categories = {
      index: 0,
      name: 'Categories',
      items: [{ id: 0, name: 'MyItem', tierIndex: 0, featured: true, data: [{ "value": "Business / Investing" }] }]
    }
    component.products = {
      index: 1,
      name: 'Products',
      items: [{ id: 0, name: 'MyItem', tierIndex: 1, featured: true, data: [{ "value": "Arabic 2" }, { "value": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/" }, { "value": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days." }, { "value": "10.85", "type": "currency" }] }]
    }
    component.currentItem = {
      isSelected: true
    }
    saveService = TestBed.get(SaveService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set parent height', () => {
      expect(component.tierComponent.parentTierHeight).toBeTruthy();
    });
  });

  describe('createTiers', () => {
    it('should create categoriesTier and productsTier', () => {
      component.createTiers();
      expect(component['categoriesTier']).toBeTruthy();
      expect(component['productsTier']).toBeTruthy();
    });
  });

  describe('switchTiers', () => {
    let clearSearchText;
    let setTier;
    beforeEach(() => {
      component.showNonFeaturedList = true;
      component.nonFeaturedSearchValue = 'Hello';
      component.createTiers();
      clearSearchText = spyOn(component, 'clearSearchText');
      setTier = spyOn(component.tierComponent, 'setTier');
      component.switchTiers(component['productsTier']);
    });

    it('should unselect current item', () => {
      expect(component.currentItem.isSelected).toBeFalsy();
    });

    it('should set the tier', () => {
      expect(component.tiers[0]).toEqual(component['productsTier']);
    });

    it('should set selectedSearchOption', () => {
      expect(component.selectedSearchOption).toEqual(component['productsTier'].name);
    });

    it('should hide the non featured list', () => {
      expect(component.showNonFeaturedList).toBeFalsy();
    });

    it('should call clearSearchText and setTier', () => {
      expect(clearSearchText).toHaveBeenCalled();
      expect(setTier).toHaveBeenCalled();
    });

    it('should clear nonFeaturedSearchValue', () => {
      expect(component.nonFeaturedSearchValue).toEqual('');
    });
  });

  describe('deleteItem', () => {
    let saveUpdate;
    let checkForNoChanges;
    beforeEach(() => {
      saveUpdate = spyOn(component, 'saveUpdate');
      checkForNoChanges = spyOn(saveService, 'checkForNoChanges');
      component.deleteItem(component.categories.items[0]);
    });

    it('should set the item to not featured', () => {
      expect(component.categories.items[0].featured).toBeFalsy();
    });

    it('should call saveUpdate and checkForNoChanges', () => {
      expect(saveUpdate).toHaveBeenCalled();
      expect(checkForNoChanges).toHaveBeenCalled();
    });
  });

  describe('createNewItem', () => {
    beforeEach(() => {
      component.showNonFeaturedList = true;
      component.createNewItem();
    });
    it('should toggle non featured list to show or hide', () => {
      expect(component.showNonFeaturedList).toBeFalsy();
      component.showNonFeaturedList = false;
      component.createNewItem();
      expect(component.showNonFeaturedList).toBeTruthy();
    });

    it('should unselect the current item', () => {
      expect(component.currentItem.isSelected).toBeFalsy();
    });
  });

  describe('onNonFeaturedItemClick', () => {
    let saveUpdate;
    let checkForNoChanges;
    beforeEach(() => {
      saveUpdate = spyOn(component, 'saveUpdate');
      checkForNoChanges = spyOn(saveService, 'checkForNoChanges');
      component.categories.items[0].featured = false;
      component.change = 0;
      component.showNonFeaturedList = true;
      component.nonFeaturedSearchValue = 'foo';
      component.onNonFeaturedItemClick(component.categories.items[0]);
    });

    it('should call saveUpdate and checkForNoChanges', () => {
      expect(saveUpdate).toHaveBeenCalled();
      expect(checkForNoChanges).toHaveBeenCalled();
    });

    it('should set the item to featured', () => {
      expect(component.categories.items[0].featured).toBeTruthy();
    });

    it('should increment the change property', () => {
      expect(component.change).toEqual(1);
    });

    it('should hide the non featrued list and clear the non featured search value', () => {
      expect(component.showNonFeaturedList).toBeFalsy();
      expect(component.nonFeaturedSearchValue).toEqual('');
    });

  });

  describe('clearSearch', () => {
    it('should clear the search input and clear nonFeaturedSearchValue', () => {
      let dom = fixture.debugElement.nativeElement;
      let search = dom.appendChild(document.createElement('input'));
      search.value = 'foo';
      component.nonFeaturedSearchValue = 'foo';
      component.clearSearch(search);
      expect(search.value).toEqual('');
      expect(component.nonFeaturedSearchValue).toEqual('');
    });
  });

  describe('handleKeyboardEvent', () => {
    let handleKeyboardEvent;
    let event: KeyboardEvent;
    beforeEach(() => {
      handleKeyboardEvent = spyOn(EditableGridComponent.prototype, 'handleKeyboardEvent');
      event = new KeyboardEvent("keydown", {
        "code": "Escape",
      });

    });

    it('should hide the non featured list if the grid has focus and escape was pressed', () => {
      component.hasFocus = true;
      component.showNonFeaturedList = true;
      component.handleKeyboardEvent(event);
      expect(component.showNonFeaturedList).toBeFalsy();
    });

    it('should call super handleKeyboardEvent if the grid does not have focus or escape was not pressed or the non featured list is not showing', () => {
      component.hasFocus = true;
      component.showNonFeaturedList = false;
      component.handleKeyboardEvent(event);
      expect(handleKeyboardEvent).toHaveBeenCalled();
    });
  });

  describe('onItemSelect', () => {
    let onItemSelect;
    beforeEach(() => {
      onItemSelect = spyOn(GridComponent.prototype, 'onItemSelect');
      component.showNonFeaturedList = true;
      component.onItemSelect({});
    });

    it('should hide the non featured list', () => {
      expect(component.showNonFeaturedList).toBeFalsy();
    });

    it('should call super onItemSelect', () => {
      expect(onItemSelect).toHaveBeenCalled();
    });
  });

});

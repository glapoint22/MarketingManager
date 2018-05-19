import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopGridComponent } from './shop-grid.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { TierComponent } from '../tier/tier.component';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridComponent } from '../grid/grid.component';
import { EditableGridComponent } from '../editable-grid/editable-grid.component';

@Component({
  selector: 'tier',
  template: '',
})
class MockTierComponent extends TierComponent { }
class MockDataService { }
class MockSaveService {
  checkForNoChanges() { }
  addSaveItem() { }
}
class MockPromptService {
  prompt() { }
}

describe('ShopGridComponent', () => {
  let component: ShopGridComponent;
  let fixture: ComponentFixture<ShopGridComponent>;
  let ngOnInit;
  let setParentTierHeight;
  let promptService: MockPromptService;
  let saveService: MockSaveService;
  let data = [
    {
      "id": 1,
      "name": "Arts & Entertainment",
      "featured": false,
      "icon": null,
      "categoryImages": [],
      "niches": [
        {
          "id": 1,
          "name": "Architecture",
          "icon": null,
          "products": [
            {
              "id": "015BCB08EE",
              "name": "Architecture 8",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 84.6565,
              "featured": true,
              "videos": [],
              "banners": [],
              "filters": [
                17,
                24,
                25,
                26
              ]
            },
            {
              "id": "208B588000",
              "name": "Architecture 15",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 23.9957,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                18,
                19,
                20,
                21,
                26
              ]
            }
          ]
        },
        {
          "id": 2,
          "name": "Art",
          "icon": null,
          "products": [
            {
              "id": "05ACA943FE",
              "name": "Art 15",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 19.4396,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                17,
                21,
                24,
                26
              ]
            },
            {
              "id": "08C9439BFC",
              "name": "Art 16",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 5.8752,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                17,
                18,
                20,
                25,
                26
              ]
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "name": "As Seen on TV",
      "featured": false,
      "icon": null,
      "categoryImages": [],
      "niches": [
        {
          "id": 20,
          "name": "Auto",
          "icon": null,
          "products": [
            {
              "id": "0106900EE4",
              "name": "Auto 10",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 85.5628,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                17,
                19,
                21,
                22,
                24,
                26
              ]
            },
            {
              "id": "01A2BC40DB",
              "name": "Auto 12",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 28.173,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                19,
                20,
                22,
                24,
                25,
                26
              ]
            }
          ]
        },
        {
          "id": 21,
          "name": "Backyard Living",
          "icon": null,
          "products": [
            {
              "id": "07DFFD24AB",
              "name": "Backyard Living 2",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 30.4263,
              "featured": true,
              "videos": [],
              "banners": [],
              "filters": [
                17,
                18,
                19,
                21,
                22,
                26
              ]
            },
            {
              "id": "37846F4B6C",
              "name": "Backyard Living 15",
              "hopLink": "http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/",
              "description": "A Foolproof, Science-Based System that's Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.",
              "image": null,
              "price": 94.6388,
              "featured": false,
              "videos": [],
              "banners": [],
              "filters": [
                18,
                19,
                21,
                24,
                25,
                26
              ]
            }
          ]
        }
      ]
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        ShopGridComponent,
        MockTierComponent
      ],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopGridComponent);
    component = fixture.componentInstance;
    component.tierComponent = new MockTierComponent();
    ngOnInit = spyOn(GridComponent.prototype, 'ngOnInit');
    setParentTierHeight = spyOn(component, 'setParentTierHeight').and.callThrough();
    promptService = TestBed.get(PromptService);
    saveService = TestBed.get(SaveService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set api url and parameters', () => {
      expect(component.apiUrl).toBeTruthy();
      expect(component.apiParameters.length).toBeGreaterThan(0);
    });

    it('should call setParentTierHeight', () => {
      expect(setParentTierHeight).toHaveBeenCalled();
    });

    it('should call super ngOnInit', () => {
      expect(ngOnInit).toHaveBeenCalled();
    });
  });

  describe('createTiers', () => {
    let createTiers;
    let prompt;
    beforeEach(() => {
      createTiers = spyOn(GridComponent.prototype, 'createTiers');
      prompt = spyOn(promptService, 'prompt');
      component.createTiers(data);
    });

    it('should create the tiers', () => {
      expect(component.tiers.length).toEqual(3);
    });

    describe('categories tier', () => {
      beforeEach(() => {
        component.tiers[0].items[0].icon = 'icon';
        component.tiers[0].items[0].categoryImages = ['images']
      });

      it('should prompt the user if there is NOT an icon for an item', () => {
        component.tiers[0].check(component.tiers[0].items[0]);
        expect(prompt).not.toHaveBeenCalled();

        component.tiers[0].items[0].icon = null;
        component.tiers[0].check(component.tiers[0].items[0]);
        expect(prompt).toHaveBeenCalledTimes(1);
      });

      it('should prompt the user if there is NOT a category image for an item', () => {
        component.tiers[0].check(component.tiers[0].items[0]);
        expect(prompt).not.toHaveBeenCalled();

        component.tiers[0].items[0].categoryImages = [];
        component.tiers[0].check(component.tiers[0].items[0]);
        expect(prompt).toHaveBeenCalledTimes(1);
      });
    });

    describe('niche tier', () => {
      it('should prompt the user if there is NOT an icon for an item', () => {
        component.tiers[1].items[0].icon = 'icon';
        component.tiers[1].check(component.tiers[1].items[0]);
        expect(prompt).not.toHaveBeenCalled();

        component.tiers[1].items[0].icon = null;
        component.tiers[1].check(component.tiers[1].items[0]);
        expect(prompt).toHaveBeenCalled();
      });
    });


    describe('products tier', () => {
      it('should prompt the user if there is NOT an image for an item', () => {
        component.tiers[2].items[0].image = 'image';
        component.tiers[2].check(component.tiers[2].items[0]);
        expect(prompt).not.toHaveBeenCalled();

        component.tiers[2].items[0].image = null;
        component.tiers[2].check(component.tiers[2].items[0]);
        expect(prompt).toHaveBeenCalled();
      });

      it('should create two buttons in rowButtons', () => {
        expect(component.tiers[2].rowButtons.length).toEqual(2);
      });
    });

    it('should call super createTiers', () => {
      expect(createTiers).toHaveBeenCalled();
    });

    it('should set focus to the grid', () => {
      expect(component.hasFocus).toBeTruthy();
    });
  });

  describe('onResize', () => {
    it('should call setParentTierHeight', () => {
      let event = new Event("resize", {});
      setParentTierHeight.calls.reset();
      component.onResize(event);
      expect(setParentTierHeight).toHaveBeenCalled();
    });
  });

  describe('handleKeyboardEvent', () => {
    it('should hide filters if the escape key is pressed', () => {
      let event = new KeyboardEvent("keydown", {
        "code": "Escape",
      });
      component.showFiltersContainer = true;
      component.handleKeyboardEvent(event);
      expect(component.showFiltersContainer).toBeFalsy();
    });

    it('should call super handleKeyboardEvent if filters are hidden', () => {
      let event = new KeyboardEvent("keydown", {
        "code": "Escape",
      });
      let handleKeyboardEvent = spyOn(EditableGridComponent.prototype, 'handleKeyboardEvent');
      component.showFiltersContainer = false;
      component.handleKeyboardEvent(event);
      expect(handleKeyboardEvent).toHaveBeenCalled();
    });
  });

  describe('onItemSelect', () => {
    it('should not hide the filters container if the filter button was clicked', () => {
      component.showFiltersContainer = true;
      component['filterButtonClicked'] = true;
      component.onItemSelect({});
      expect(component.showFiltersContainer).toBeTruthy();
    });

    it('should hide the filters container if the filter button was NOT clicked and the item is NOT the current item', () => {
      let item = { name: 'bar' };

      component.currentItem = { name: 'foo' };
      component.showFiltersContainer = true;
      component.onItemSelect(item);
      expect(component.showFiltersContainer).toBeFalsy();

      component.currentItem = item;
      component.showFiltersContainer = true;
      component.onItemSelect(item);
      expect(component.showFiltersContainer).toBeTruthy();
    });

    it('should call super onItemSelect and onItemClick.emit', () => {
      let onItemSelect = spyOn(GridComponent.prototype, 'onItemSelect');
      let emit = spyOn(component.onItemClick, 'emit');

      component.onItemSelect({});
      expect(onItemSelect).toHaveBeenCalled();
      expect(emit).toHaveBeenCalled();
    });
  });

  describe('onTierCollapse', () => {
    it('should hide the filters container', () => {
      component.showFiltersContainer = true;
      component.onTierCollapse();
      expect(component.showFiltersContainer).toBeFalsy();
    });
  });

  describe('setParentTierHeight', () => {
    it('should set tier component parentTierHeight', () => {
      component.setParentTierHeight();
      expect(component.tierComponent.parentTierHeight).toBeTruthy();
    });
  });

  describe('setDelete', () => {
    it('should call super setDelete and onChange.emit', () => {
      let setDelete = spyOn(EditableGridComponent.prototype, 'setDelete');
      let emit = spyOn(component.onChange, 'emit');
      component.setDelete();
      expect(setDelete).toHaveBeenCalled();
      expect(emit).toHaveBeenCalled();
    });
  });

  describe('createItemId', () => {
    it('should create an id if it\'s an item from the products tier', () => {
      component.createTiers(data);
      let id = component.createItemId(component.tiers[2].items, 2);
      expect(id).toBeTruthy();
    });

    it('should call super createItemId if the item is NOT from the products tier', () => {
      let createItemId = spyOn(EditableGridComponent.prototype, 'createItemId');
      component.createTiers(data);
      let id = component.createItemId(component.tiers[0].items, 0);
      expect(createItemId).toHaveBeenCalled();
    });
  });

  describe('onFilterOptionChange', () => {
    let option;
    let saveUpdate;
    beforeEach(() => {
      saveUpdate = spyOn(component, 'saveUpdate');
      option = { "id": 27, "name": "Trial", "isChecked": false };
      component.currentItem = {
        filters: [1, 2, 3]
      }
    });

    it('should call saveUpdate', () => {
      component.onFilterOptionChange(option);
      expect(saveUpdate).toHaveBeenCalled();
    });

    it('should add filter option to current item filters', () => {
      component.onFilterOptionChange(option);
      expect(component.currentItem.filters).toEqual([1, 2, 3, 27]);
    });

    it('should remove option from current item filters if checked', () => {
      option = { "id": 27, "name": "Trial", "isChecked": true };
      component.currentItem = {
        filters: [1, 2, 3, 27]
      }
      component.onFilterOptionChange(option);
      expect(component.currentItem.filters).toEqual([1, 2, 3]);
    });

    it('should call checkForNoChanges', () => {
      let checkForNoChanges = spyOn(saveService, 'checkForNoChanges');
      component.onFilterOptionChange(option);
      expect(checkForNoChanges).toHaveBeenCalled();
    });
  });

  describe('createNewItem', () => {
    beforeEach(() => {
      component.createTiers(data);
      spyOn(EditableGridComponent.prototype, 'editItem');
    });

    it('should call super createNewItem', () => {
      let createNewItem = spyOn(EditableGridComponent.prototype, 'createNewItem');
      component.createNewItem(2, 1);
      expect(createNewItem).toHaveBeenCalled();
    });

    it('should set categories tier item', () => {
      let item = { "parentId": 1, "id": 3, "tierIndex": 0, "data": [{ "value": "Category Name" }], "isInEditMode": true, "isSelected": true, "featured": false, "icon": null, "categoryImages": [] };
      component.createNewItem(0, 1);
      expect(component.tiers[0].items[0]).toEqual(item);
    });

    it('should set niche tier item', () => {
      let item = { "parentId": 1, "id": 22, "tierIndex": 1, "data": [{ "value": "Niche Name" }], "isInEditMode": true, "isSelected": true, "icon": null };
      component.createNewItem(1, 1);
      expect(component.tiers[1].items[0]).toEqual(item);
    });

    it('should set products tier item', () => {
      spyOn(component, 'createItemId').and.returnValue('DF7EB352A1');
      let item = {
        "parentId": 1,
        "id": "DF7EB352A1",
        "tierIndex": 2,
        "data": [
          {
            "value": "Product Name"
          },
          {
            "value": "HopLink URL"
          },
          {
            "value": "Product Description"
          },
          {
            "value": "0",
            type: 'currency'
          }
        ],
        "isInEditMode": true,
        "isSelected": true,
        "featured": false,
        "filters": [],
        "image": null,
        "banners": [],
        "videos": []
      }
      component.createNewItem(2, 1);
      expect(component.tiers[2].items[0]).toEqual(item);
    });

    it('should call onItemClick.emit', () => {
      let emit = spyOn(component.onItemClick, 'emit');
      component.createNewItem(2, 1);
      expect(emit).toHaveBeenCalled();
    });
  });

  describe('onBlur', () => {
    it('should call super onBlur', () => {
      let onBlur = spyOn(GridComponent.prototype, 'onBlur');
      component.onBlur();
      expect(onBlur).toHaveBeenCalled();
    });

    it('should call super onBlur', () => {
      component.showFiltersContainer = true;
      component.onBlur();
      expect(component.showFiltersContainer).toBeFalsy();
    });
  });


});

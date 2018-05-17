import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShopGridComponent } from './shop-grid.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { TierComponent } from '../tier/tier.component';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'tier',
  template: '',
})
class MockTierComponent extends TierComponent { }
class MockDataService { }
class MockSaveService { }
class MockPromptService {
  prompt() { }
}

describe('ShopGridComponent', () => {
  let component: ShopGridComponent;
  let fixture: ComponentFixture<ShopGridComponent>;
  let ngOnInit;
  let setParentTierHeight;
  let promptService: MockPromptService;
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
    setParentTierHeight = spyOn(component, 'setParentTierHeight');
    promptService = TestBed.get(PromptService);
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
      beforeEach(()=>{
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
    });

    
    
    


    it('should call super createTiers', () => {
      expect(createTiers).toHaveBeenCalled();
    });

    it('should set focus to the grid', () => {
      expect(component.hasFocus).toBeTruthy();
    });



  });


});

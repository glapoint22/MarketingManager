import { TestBed, inject } from '@angular/core/testing';
import { SaveService } from './save.service';
import { DataService } from "./data.service";
import { of } from 'rxjs/observable/of';

class MockDataService {
  post(url: string, body: any) { }
  put(url: string, body: any) { }
  delete(url: string, body: any) { }
}

describe('SaveService', () => {
  let dataService: DataService;
  let saveService: SaveService;
  let items: Array<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveService, { provide: DataService, useClass: MockDataService }]
    });
    dataService = TestBed.get(DataService);
    saveService = TestBed.get(SaveService);
    spyOn(dataService, 'post').and.returnValue(of('ok'));
    spyOn(dataService, 'put').and.returnValue(of('ok'));
    spyOn(dataService, 'delete').and.returnValue(of('ok'));
  });

  beforeEach(inject([SaveService], (saveService: SaveService) => {


    items = [
      {
        "check": (item) => {
          return true;
        },
        "setItem": (item) => {
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
          };
        },
        "item": {
          "id": 25,
          "tierIndex": 0,
          "data": [
            {
              "value": "Foo"
            }
          ],
          "isInEditMode": false,
          "isSelected": true,
          "featured": false,
          "icon": "d959528881ca4f59bfb1860b2f400d68.jpg",
          "categoryImages": [
            {
              "name": "bdf5e8fa60e741aeac065ba28acd66f7.png",
              "isSelected": true
            }
          ]
        },
        "url": "api/Categories",
        "originalItem": {
          "id": 25,
          "tierIndex": 0,
          "data": [
            {
              "value": "Category Name"
            }
          ],
          "isInEditMode": true,
          "isSelected": true
        }
      },
      {
        "check": (item) => {
          return true;
        },
        "setItem": (item) => {
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
          };
        },
        "item": {
          "id": 26,
          "tierIndex": 0,
          "data": [
            {
              "value": "Bar"
            }
          ],
          "isInEditMode": false,
          "isSelected": true,
          "featured": false,
          "icon": "d435b7ce75594919b7dcc17983380b3a.png",
          "categoryImages": [
            {
              "name": "d1c00682dda84b318cc411c97939afe9.png",
              "isSelected": true
            }
          ]
        },
        "url": "api/Categories",
        "originalItem": {
          "id": 26,
          "tierIndex": 0,
          "data": [
            {
              "value": "Category Name"
            }
          ],
          "isInEditMode": true,
          "isSelected": true
        }
      }
    ]
  }));

  describe('save', () => {
    it('should start the saving process if there are changes', () => {
      let next = spyOn(saveService['savePosts'], 'next');

      saveService.save();
      expect(next).not.toHaveBeenCalled();

      saveService.newItems = items;
      saveService.save();
      expect(next).toHaveBeenCalled();
    });

    it('should save new items', () => {
      let saveItem = spyOn(saveService, 'saveItem').and.callThrough();
      saveService.newItems = items;
      saveService.save();
      expect(saveItem).toHaveBeenCalled();
    });

    it('should save deleted items', () => {
      let saveItem = spyOn(saveService, 'saveItem').and.callThrough();
      saveService.deletedItems = items;
      saveService.save();
      expect(saveItem).toHaveBeenCalled();
    });

    it('should save updated items', () => {
      let saveItem = spyOn(saveService, 'saveItem').and.callThrough();
      saveService.updatedItems = items;
      saveService.save();
      expect(saveItem).toHaveBeenCalled();
    });

    it('should save new items, deleted items, and updated items', () => {
      let saveItem = spyOn(saveService, 'saveItem').and.callThrough();
      saveService.newItems = items;
      saveService.deletedItems = items;
      saveService.updatedItems = items;
      saveService.save();
      expect(saveItem).toHaveBeenCalledTimes(3);
    });

    it('should set saving as complete', () => {
      saveService.updatedItems = items;
      saveService.save();
      expect(saveService.isSaving).toBeFalsy();
    });
  });

  describe('mapItems', () => {
    it('should map the items', () => {
      let mappedItems = [
        {
          "url": "api/Categories",
          "items": [
            {
              "ID": 25,
              "Name": "Foo",
              "Icon": "d959528881ca4f59bfb1860b2f400d68.jpg",
              "Featured": false,
              "CategoryImages": [
                {
                  "CategoryID": 25,
                  "Name": "bdf5e8fa60e741aeac065ba28acd66f7.png",
                  "Selected": true
                }
              ]
            },
            {
              "ID": 26,
              "Name": "Bar",
              "Icon": "d435b7ce75594919b7dcc17983380b3a.png",
              "Featured": false,
              "CategoryImages": [
                {
                  "CategoryID": 26,
                  "Name": "d1c00682dda84b318cc411c97939afe9.png",
                  "Selected": true
                }
              ]
            }
          ]
        }
      ]

      let result = saveService.mapItems(items);
      expect(result).toEqual(mappedItems);
    });
  });

  describe('addSaveItem', () => {
    it('should add an item to the save array', () => {
      let tier = {
        setItem: (item) => { },
        check: (item) => { },
        url: 'api/Niches'
      }
      saveService.addSaveItem(saveService.newItems, items[0].item, tier);
      expect(saveService.newItems.length).toEqual(1);
    });
  });

  describe('isChange', () => {
    it('should return true if there are any changes', () => {
      expect(saveService.isChange()).toBeFalsy();
      saveService.newItems = items;
      expect(saveService.isChange()).toBeTruthy();

      saveService.newItems = saveService.deletedItems = saveService.updatedItems = [];

      saveService.deletedItems = items;
      expect(saveService.isChange()).toBeTruthy();

      saveService.newItems = saveService.deletedItems = saveService.updatedItems = [];

      saveService.updatedItems = items;
      expect(saveService.isChange()).toBeTruthy();
    });
  });

  describe('checkForNoChanges', () => {
    let updatedItems;

    beforeEach(() => {
      updatedItems = [
        {
          "item": {
            "id": 25,
            "tierIndex": 0,
            "data": [
              {
                "value": "Foo"
              }
            ],
            "isInEditMode": false,
            "isSelected": true,
            "icon": "d959528881ca4f59bfb1860b2f400d68.jpg",
            "categoryImages": [
              {
                "name": "bdf5e8fa60e741aeac065ba28acd66f7.png",
                "isSelected": true
              }
            ]
          },
          "url": "api/Categories",
          "originalItem": {
            "id": 25,
            "tierIndex": 0,
            "data": [
              {
                "value": "Category Name"
              }
            ],
            "isInEditMode": true,
            "isSelected": true,
            "icon": "d959528881ca4f59bfb1860b2f400d68.jpg",
            "categoryImages": [
              {
                "name": "bdf5e8fa60e741aeac065ba28acd66f7.png",
                "isSelected": true
              }
            ]
          }
        },
        {
          "item": {
            "id": 26,
            "tierIndex": 0,
            "data": [
              {
                "value": "Bar"
              }
            ],
            "isInEditMode": false,
            "isSelected": true,
            "icon": "d435b7ce75594919b7dcc17983380b3a.png",
            "categoryImages": [
              {
                "name": "d1c00682dda84b318cc411c97939afe9.png",
                "isSelected": true
              }
            ]
          },
          "url": "api/Categories",
          "originalItem": {
            "id": 26,
            "tierIndex": 0,
            "data": [
              {
                "value": "Category Name"
              }
            ],
            "isInEditMode": true,
            "isSelected": true,
            "icon": "d435b7ce75594919b7dcc17983380b3a.png",
            "categoryImages": [
              {
                "name": "d1c00682dda84b318cc411c97939afe9.png",
                "isSelected": true
              }
            ]
          }
        }
      ]
    });

    it('should have changes', () => {
      saveService.updatedItems = updatedItems;
      saveService.checkForNoChanges();
      expect(saveService.updatedItems.length).toBeGreaterThan(0);
    });

    it('should have no changes', () => {
      updatedItems[0].item.data[0].value = 'Category Name';
      updatedItems[1].item.data[0].value = 'Category Name';
      saveService.updatedItems = updatedItems;
      saveService.checkForNoChanges();
      expect(saveService.updatedItems.length).toEqual(0);
    });
  });
});
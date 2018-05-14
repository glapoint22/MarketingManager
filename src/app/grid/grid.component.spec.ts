import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from './grid.component';
import { FormsModule } from '@angular/forms';
import { DataService } from "../data.service";
import { of } from "rxjs/observable/of";
import { Component } from '@angular/core';
import { Itier } from '../itier';
import { TierComponent } from '../tier/tier.component';

@Component({
  selector: 'tier',
  template: '',
})
class MockTierComponent extends TierComponent {
  setTier(tier: Itier) { }
  checkItemResults() { }
  collapseTiers() { }
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let dataService: DataService;
  let domElement;
  let data = { id: 0, name: 'myItem' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        GridComponent,
        MockTierComponent
      ],
      providers: [{ provide: DataService, useValue: { get: () => of(data) } }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    let tiers = [
      {
        index: 1,
        name: 'MyTier1',
        items: [],
        fields: [],
        headerButtons: [],
        rowButtons: []
      },
      {
        index: 2,
        name: 'MyTier2',
        items: [],
        fields: [],
        headerButtons: [],
        rowButtons: []
      },
      {
        index: 3,
        name: 'MyTier3',
        items: [],
        fields: [],
        headerButtons: [],
        rowButtons: []
      }
    ];

    fixture = TestBed.createComponent(GridComponent);
    dataService = TestBed.get(DataService);
    component = fixture.componentInstance;
    component.tierComponent = new MockTierComponent();
    component.tiers = tiers;
    domElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  describe('Template', () => {
    it('should show loading before tiers are created', () => {
      component.tiers = [];
      fixture.detectChanges();

      let loadingContainer = domElement.querySelector('.loading-container');
      expect(loadingContainer).not.toBeNull();
    });

    it('should NOT show loading when tiers are created', () => {
      let loadingContainer = domElement.querySelector('.loading-container');
      expect(loadingContainer).toBeNull();
    });

    it('should call onSearchChange when a value is entered into the search input', () => {
      let input = domElement.querySelector('input');

      spyOn(component, 'onSearchChange');
      input.value = 'a';
      input.dispatchEvent(new Event('input'));

      expect(component.onSearchChange).toHaveBeenCalledWith('a');
    });

    it('should call clearSearchText when x is clicked within the search input', () => {
      let clearSearch = domElement.querySelector('#clearSearch');
      let clearSearchText = spyOn(component, 'clearSearchText');
      clearSearch.click();
      expect(clearSearchText).toHaveBeenCalled();
    });

    it('should set property hasFocus to true when grid gets focus', () => {
      component.hasFocus = false;
      domElement.querySelector('.grid-container').dispatchEvent(new Event('focus'));
      expect(component.hasFocus).toBeTruthy();
    });

    it('should set property hasFocus to false when grid loses focus', () => {
      component.hasFocus = true;
      domElement.querySelector('.grid-container').dispatchEvent(new Event('blur'));
      expect(component.hasFocus).toBeFalsy();
    });
  });

  describe('ngOnInit', () => {
    it('should call dataService to get the data', () => {
      spyOn(dataService, 'get').and.callThrough();
      component.ngOnInit();
      expect(dataService.get).toHaveBeenCalled();
    });

    it('should call createTiers and setSearchOptions when we receive data', () => {
      let createTiers = spyOn(component, 'createTiers');
      let setSearchOptions = spyOn(component, 'setSearchOptions');
      component.ngOnInit();
      expect(createTiers).toHaveBeenCalledWith(data);
      expect(setSearchOptions).toHaveBeenCalled();
    });
  });

  describe('createTiers', () => {
    let setTier;
    beforeEach(() => {
      setTier = spyOn(component.tierComponent, 'setTier');
      component.createTiers();
    });
    it('should assign the grid to tier component', () => {
      expect(component.tierComponent.grid).toBeTruthy();
    });

    it('should call setTier', () => {
      expect(setTier).toHaveBeenCalled();
    });
  });

  describe('setSearchOptions', () => {
    beforeEach(() => {
      component.setSearchOptions();
    });

    it('should set searchOptions array', () => {
      expect(component.searchOptions.length).toBeGreaterThan(0);
    });

    it('should set selectedSearchOption as the first tier', () => {
      expect(component.selectedSearchOption).toEqual('MyTier1');
    });
  });

  describe('onSearchChange', () => {
    it('should call checkItemResults', () => {
      spyOn(component.tierComponent, 'checkItemResults');
      component.onSearchChange('a');
      expect(component.tierComponent.checkItemResults).toHaveBeenCalled();
    });

    it('should call collapseTiers', () => {
      spyOn(component.tierComponent, 'collapseTiers');
      component.onSearchChange('a');
      expect(component.tierComponent.collapseTiers).toHaveBeenCalled();
    });

    it('should unselect the current item', () => {
      component.currentItem = { isSelected: true };
      component.onSearchChange('a');
      expect(component.currentItem.isSelected).toBeFalsy();
    });

    it('should select the correct tier based on the selected search option', () => {
      component.selectedSearchOption = 'MyTier2';
      component.onSearchChange('a');
      expect(component.tierToSearch).toEqual(1);
    });

    it('should select the first tier if the search value is an empty string', () => {
      component.tierToSearch = 2;
      component.onSearchChange('');
      expect(component.tierToSearch).toEqual(0);
    });
  });

  describe('clearSearchText', () => {
    let onSearchChange;
    let input;
    beforeEach(()=>{
      onSearchChange = spyOn(component, 'onSearchChange');
      input = domElement.querySelector('input');
      input.value = 'Hello';
      component.clearSearchText();
    });
    
    it('should set the search input value to an empty string', () => {
      expect(input.value).toEqual('');
    });

    it('should call onSearchChange', () => {
      expect(onSearchChange).toHaveBeenCalled();
    });

  });

  describe('onItemSelect', () => {
    it('should set the item as selected', () => {
      let item = { isSelected: false }
      component.onItemSelect(item);
      expect(item.isSelected).toBeTruthy();
    });
  });

  describe('handleKeyboardEvent', () => {
    it('should unselect current item if grid has focus when escape key is pressed', () => {
      let event = new KeyboardEvent("keydown", {
        "code": "Escape",
      });
      component.hasFocus = true;
      component.currentItem = { isSelected: true }
      component.handleKeyboardEvent(event);
      expect(component.currentItem.isSelected).toBeFalsy();
    });

    it('should NOT unselect current item if grid does NOT have focus when escape key is pressed', () => {
      let event = new KeyboardEvent("keydown", {
        "code": "Escape",
      });
      component.hasFocus = false;
      component.currentItem = { isSelected: true }
      component.handleKeyboardEvent(event);
      expect(component.currentItem.isSelected).toBeTruthy();
    });
  });
});
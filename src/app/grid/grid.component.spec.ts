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
export class MockTierComponent extends TierComponent {
  setTier(tier: Itier) { }
  checkItemResults() { }
  collapseTiers() { }
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let dataService: DataService;
  let compiled;
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
    compiled = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should show loading before tiers are created', () => {
    component.tiers = [];
    fixture.detectChanges();

    let loadingContainer = compiled.querySelector('.loading-container');
    expect(loadingContainer).not.toBeNull();
  });

  it('should NOT show loading when tiers are created', () => {
    let loadingContainer = compiled.querySelector('.loading-container');
    expect(loadingContainer).toBeNull();
  });

  it('should call dataService to get the data', () => {
    spyOn(dataService, 'get').and.callThrough();
    component.ngOnInit();
    expect(dataService.get).toHaveBeenCalled();
  });

  it('should call createTiers when we receive data', () => {
    spyOn(component, 'createTiers');
    component.ngOnInit();
    expect(component.createTiers).toHaveBeenCalledWith(data);
  });

  it('sets the search options after tiers have been created', () => {
    expect(component.searchOptions).toEqual(['MyTier1', 'MyTier2', 'MyTier3']);
    expect(component.selectedSearchOption).toEqual('MyTier1');
  });

  it('should call onSearchChange when a value is entered into the search input', () => {
    let input = compiled.querySelector('input');

    spyOn(component, 'onSearchChange');
    input.value = 'a';
    input.dispatchEvent(new Event('input'));

    expect(component.onSearchChange).toHaveBeenCalledWith('a');
  });

  it('should call checkItemResults within onSearchChange', () => {
    spyOn(component.tierComponent, 'checkItemResults');
    component.onSearchChange('a');
    expect(component.tierComponent.checkItemResults).toHaveBeenCalled();
  });

  it('should call collapseTiers within onSearchChange', () => {
    spyOn(component.tierComponent, 'collapseTiers');
    component.onSearchChange('a');
    expect(component.tierComponent.collapseTiers).toHaveBeenCalled();
  });

  it('should have onSearchChange method unselect the current item', () => {
    component.currentItem = { isSelected: true };
    component.onSearchChange('a');
    expect(component.currentItem.isSelected).toBeFalsy();
  });

  it('should have onSearchChange method select the correct tier based on the selected search option', () => {
    component.selectedSearchOption = 'MyTier2';
    component.onSearchChange('a');
    expect(component.tierToSearch).toEqual(1);
  });

  it('should have onSearchChange method select the first tier if the search value is an empty string', () => {
    component.tierToSearch = 2;
    component.onSearchChange('');
    expect(component.tierToSearch).toEqual(0);
  });

  it('should clear search text when x is clicked within the search input', () => {
    let clearSearch = compiled.querySelector('#clearSearch');
    let input = compiled.querySelector('input');
    input.value = 'Hello';
    clearSearch.click();

    expect(input.value).toEqual('');
  });

  it('should call onSearchChange when x is clicked within the search input and the input value has 1 or more characters', () => {
    let input = compiled.querySelector('input');
    input.value = 'Hello';
    spyOn(component, 'onSearchChange');
    component.clearSearchText();

    expect(component.onSearchChange).toHaveBeenCalled();
  });

  it('should set the item as selected when onItemSelect is called', () => {
    let item = { isSelected: false }
    component.onItemSelect(item);
    expect(item.isSelected).toBeTruthy();
  });

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

  it('should set property hasFocus to true when grid gets focus', () => {
    component.hasFocus = false;
    compiled.querySelector('.grid-container').dispatchEvent(new Event('focus'));
    expect(component.hasFocus).toBeTruthy();
  });

  it('should set property hasFocus to false when grid loses focus', () => {
    component.hasFocus = true;
    compiled.querySelector('.grid-container').dispatchEvent(new Event('blur'));
    expect(component.hasFocus).toBeFalsy();
  });
});
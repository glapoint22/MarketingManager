import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterGridComponent } from './filter-grid.component';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { TierComponent } from '../tier/tier.component';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'tier',
  template: '',
})
class MockTierComponent extends TierComponent { }
class MockDataService { }
class MockSaveService { }
class MockPromptService { }

describe('FilterGridComponent', () => {
  let component: FilterGridComponent;
  let fixture: ComponentFixture<FilterGridComponent>;
  let ngOnInit;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FilterGridComponent, MockTierComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterGridComponent);
    component = fixture.componentInstance;
    component.tierComponent = new MockTierComponent();
    ngOnInit = spyOn(GridComponent.prototype, 'ngOnInit');
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set apiUri', () => {
      expect(component.apiUri).toEqual('api/Filters');
    });

    it('should set parent height', () => {
      expect(component.tierComponent.parentTierHeight).toBeTruthy();
    });

    it('should call super ngOnInit', () => {
      expect(ngOnInit).toHaveBeenCalled();
    });
  });

  describe('createTiers', () => {
    let createTiers;
    beforeEach(() => {
      createTiers = spyOn(GridComponent.prototype, 'createTiers');
      let data = [{ "id": 2, "name": "Language", "options": [{ "id": 17, "name": "English" }, { "id": 18, "name": "German" }, { "id": 19, "name": "Spanish" }, { "id": 20, "name": "French" }, { "id": 21, "name": "Italian" }, { "id": 22, "name": "Portuguese" }] }, { "id": 3, "name": "Product Type", "options": [{ "id": 23, "name": "Digital Download" }, { "id": 24, "name": "Shippable" }] }, { "id": 4, "name": "Billing", "options": [{ "id": 25, "name": "Single Payment" }, { "id": 26, "name": "Subscription" }, { "id": 27, "name": "Trial" }] }];
      component.createTiers(data);
    });

    it('should create the tiers', () => {
      expect(component.tiers.length).toBeGreaterThan(0);
    });

    it('should call super createTiers', () => {
      expect(createTiers).toHaveBeenCalled();
    });
  });
});

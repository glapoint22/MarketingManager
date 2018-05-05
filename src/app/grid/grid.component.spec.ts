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
}

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        GridComponent,
        MockTierComponent
      ],
      providers: [{ provide: DataService, useValue: { get: () => of('Hello') } }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    let myTier: Itier = {
      index: 1,
      name: 'MyTier',
      items: [],
      fields: [],
      headerButtons: [],
      rowButtons: []
    }
    
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.tierComponent = new MockTierComponent();
    component.tiers = [myTier]
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
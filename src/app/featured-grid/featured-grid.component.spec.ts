import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedGridComponent } from './featured-grid.component';

describe('FeaturedGridComponent', () => {
  let component: FeaturedGridComponent;
  let fixture: ComponentFixture<FeaturedGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

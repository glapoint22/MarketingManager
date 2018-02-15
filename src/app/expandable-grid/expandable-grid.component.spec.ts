import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandableGridComponent } from './expandable-grid.component';

describe('ExpandableGridComponent', () => {
  let component: ExpandableGridComponent;
  let fixture: ComponentFixture<ExpandableGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpandableGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpandableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

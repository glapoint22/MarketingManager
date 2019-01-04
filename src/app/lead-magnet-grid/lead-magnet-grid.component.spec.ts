import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadMagnetGridComponent } from './lead-magnet-grid.component';

describe('LeadMagnetGridComponent', () => {
  let component: LeadMagnetGridComponent;
  let fixture: ComponentFixture<LeadMagnetGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadMagnetGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadMagnetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

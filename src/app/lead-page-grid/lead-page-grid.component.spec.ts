import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPageGridComponent } from './lead-page-grid.component';

describe('LeadPageGridComponent', () => {
  let component: LeadPageGridComponent;
  let fixture: ComponentFixture<LeadPageGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPageGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPageGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

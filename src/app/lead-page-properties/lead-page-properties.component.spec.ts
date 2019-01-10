import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPagePropertiesComponent } from './lead-page-properties.component';

describe('LeadPagePropertiesComponent', () => {
  let component: LeadPagePropertiesComponent;
  let fixture: ComponentFixture<LeadPagePropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPagePropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPagePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

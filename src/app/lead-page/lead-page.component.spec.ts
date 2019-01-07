import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadPageComponent } from './lead-page.component';

describe('LeadPageComponent', () => {
  let component: LeadPageComponent;
  let fixture: ComponentFixture<LeadPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

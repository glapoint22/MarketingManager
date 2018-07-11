import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGridComponent } from './email-grid.component';

xdescribe('EmailGridComponent', () => {
  let component: EmailGridComponent;
  let fixture: ComponentFixture<EmailGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

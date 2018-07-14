import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniformBoxComponent } from './uniform-box.component';

xdescribe('UniformBoxComponent', () => {
  let component: UniformBoxComponent;
  let fixture: ComponentFixture<UniformBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniformBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniformBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

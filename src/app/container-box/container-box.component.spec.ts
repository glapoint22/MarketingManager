import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContainerBoxComponent } from './container-box.component';

describe('ContainerBoxComponent', () => {
  let component: ContainerBoxComponent;
  let fixture: ComponentFixture<ContainerBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContainerBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MenuButtonComponent } from './menu-button.component';

describe('MenuButtonComponent', () => {
  let component: MenuButtonComponent;
  let fixture: ComponentFixture<MenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should show icon', () => {
    component.icon = 'fa-shopping-cart';
    fixture.detectChanges();

    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('i').classList).toContain('fa-shopping-cart');
  });

  it('OnbuttonClick is defined', () => {
    expect(component.onButtonClick).toBeDefined();
  });

  it('should call emit on OnbuttonClick with button Id at startup if button is default', () => {
    spyOn(component.onButtonClick, 'emit');
    component.buttonId = 'MyButtonId';
    component.default = true;
    component.ngOnInit();

    expect(component.onButtonClick.emit).toHaveBeenCalledWith('MyButtonId');
  });

  it('should NOT call emit on OnbuttonClick with button Id at startup if button is  NOT default', () => {
    spyOn(component.onButtonClick, 'emit');
    component.buttonId = 'MyButtonId';
    component.default = false;
    component.ngOnInit();

    expect(component.onButtonClick.emit).not.toHaveBeenCalledWith('MyButtonId');
  });

  it('should call emit on OnbuttonClick with button Id when button is clicked', () => {
    let compiled = fixture.debugElement.nativeElement;
    let label =  compiled.querySelector('label');

    spyOn(component.onButtonClick, 'emit');
    component.buttonId = 'MyButtonId';
    label.click();
    expect(component.onButtonClick.emit).toHaveBeenCalledWith('MyButtonId');
  });
});
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Component } from '@angular/core';
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";

// menu-button
@Component({
  selector: 'menu-button',
  template: ''
})
class MockMenuButtonComponent { }

// shop
@Component({
  selector: 'shop',
  template: ''
})
class MockShop { }

// email
@Component({
  selector: 'email',
  template: ''
})
class MockEmail { }

// leads
@Component({
  selector: 'leads',
  template: ''
})
class MockLeads { }

// social
@Component({
  selector: 'social',
  template: ''
})
class MockSocial { }

// prompt
@Component({
  selector: 'prompt',
  template: ''
})
class MockPrompt { }

// save service
class MockSaveService {
  public isSaving: boolean;

  save() { }
  isChange() { }
}

// prompt service
class MockPromptService { }

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let domElement: any;
  let promptService: PromptService;
  let saveService: SaveService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, MockMenuButtonComponent, MockShop, MockEmail, MockLeads, MockSocial, MockPrompt],
      providers: [
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    domElement = fixture.debugElement.nativeElement;
    promptService = TestBed.get(PromptService);
    saveService = TestBed.get(SaveService);
    fixture.detectChanges();
  });

  it('should display the menu', () => {
    let menu = domElement.querySelector('.menu');
    expect(menu).toBeTruthy();
  });

  it('should display the menu buttons', () => {
    let menuButtons = domElement.querySelectorAll('menu-button');
    expect(menuButtons.length).toBeGreaterThan(0);
  });

  it('should display the save button', () => {
    let saveButton = domElement.querySelectorAll('.save-button');
    expect(saveButton).toBeTruthy();
  });

  it('should display the save button blinking when there is a change', () => {
    spyOn(saveService, 'isChange').and.returnValue(true);
    fixture.detectChanges();
    let blink = domElement.querySelector('.blink');
    expect(blink).toBeTruthy();
  });

  it('should display the save button as disabled when there is NOT a change', () => {
    spyOn(saveService, 'isChange').and.returnValue(false);
    fixture.detectChanges();
    let disabled = domElement.querySelector('.button-disabled');
    expect(disabled).toBeTruthy();
  });

  it('should call saveService save method when the save button has been clicked', () => {
    spyOn(saveService, 'save');
    domElement.querySelector('.save-button').click();
    expect(saveService.save).toHaveBeenCalled();
  });

  it('should display the active screen', () => {
    component.activeScreen = 'shop';
    fixture.detectChanges();
    let shop = domElement.querySelector('shop');
    expect(shop).toBeTruthy();
  });

  it('should display the prompt when initiated', () => {
    promptService.show = true;
    fixture.detectChanges();
    let prompt = domElement.querySelector('prompt');
    expect(prompt).toBeTruthy();
  });

  it('should display the saving mask when initiated', () => {
    saveService.isSaving = true;
    fixture.detectChanges();
    let saving = domElement.querySelector('.saving');
    expect(saving).toBeTruthy();
  });
});
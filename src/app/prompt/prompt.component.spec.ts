import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PromptComponent } from './prompt.component';
import { PromptService } from "../prompt.service";

class MockPromptService {
  public title = 'My Title';
  public text = 'My Text';
  public show = true;
  public buttons = [
    {
      text: 'Yes',
      callback: () => { }
    },
    {
      text: 'No',
      callback: () => { }
    }
  ];
 }

describe('PromptComponent', () => {
  let component: PromptComponent;
  let fixture: ComponentFixture<PromptComponent>;
  let nativeElement;
  let promptService: PromptService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptComponent ],
      providers: [
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    promptService = TestBed.get(PromptService);
    fixture.detectChanges();
  });

  it('should display the title', () => {
    let title = nativeElement.querySelector('.prompt-title').innerHTML;
    expect(title).toEqual('My Title');
  });

  it('should hide the prompt when the close button is clicked', () => {
    let close = nativeElement.querySelector('.close');
    close.click();
    expect(promptService.show).toBeFalsy();
  });

  it('should display the text', () => {
    let text = nativeElement.querySelector('.prompt-text').innerHTML;
    expect(text).toEqual('My Text');
  });

  it('should display the buttons', () => {
    let buttons = nativeElement.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should assign the "default-prompt-button" id to the first button', () => {
    let buttons = nativeElement.querySelectorAll('button');
    expect(buttons[0].id).toEqual('default-prompt-button');
    expect(buttons[1].id).toEqual('');
  });

  it('should display the button text on the buttons', () => {
    let buttons = nativeElement.querySelectorAll('button');
    expect(buttons[0].innerHTML).toEqual('Yes');
    expect(buttons[1].innerHTML).toEqual('No');
  });

  it('should hide the prompt when a button is clicked', () => {
    let buttons = nativeElement.querySelectorAll('button');
    buttons[0].click();
    expect(promptService.show).toBeFalsy();
  });

  it('should call the button\'s callback function when a button is clicked', () => {
    let buttons = nativeElement.querySelectorAll('button');
    let callback = spyOn(promptService.buttons[0],'callback');
    buttons[0].click();
    expect(callback).toHaveBeenCalled();
  });
});
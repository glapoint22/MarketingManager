import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableGridComponent } from './editable-grid.component';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from '../grid-button';
import { GridComponent } from '../grid/grid.component';

class MockDataService { }
class MockSaveService {
  checkForNoChanges() { }
}
class MockPromptService {
  prompt(title: string, text: string, buttons: Array<any>) { }
}

describe('EditableGridComponent', () => {
  let component: EditableGridComponent;
  let fixture: ComponentFixture<EditableGridComponent>;
  let saveService: SaveService;
  let event: KeyboardEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditableGridComponent],
      providers: [
        { provide: DataService, useClass: MockDataService },
        { provide: SaveService, useClass: MockSaveService },
        { provide: PromptService, useClass: MockPromptService }
      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableGridComponent);
    component = fixture.componentInstance;
    spyOn(component, 'ngOnInit');
    saveService = TestBed.get(SaveService);
    component.currentItem = {
      isSelected: true,
      isInEditMode: true,
      tierIndex: 2,
      data: [
        { value: 'Strategy Guides 1' },
        { value: 'http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/' },
        { value: 'A Foolproof, Science-Based System that\'s Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 14 Days.' },
        { value: '40.7934' }
      ]
    }
    component.grid = {
      nativeElement: { focus() { } }
    }
    component['editedFields'] = [
      { value: 'Strategy Guides 1' },
      { value: 'http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/' },
      { value: 'A Foolproof, Science-Based System that\'s Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 22 Days.' },
      { value: '40.7934' }
    ]
    event = new KeyboardEvent("keydown", {
      "code": "Enter",
    });
    fixture.detectChanges();
  });

  it('should create two grid buttons when setHeaderButtons is called', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    expect(buttons.length).toEqual(2);
    expect(buttons[0].name).toEqual('MyNewButtonName');
    expect(buttons[0].icon).toEqual('fas fa-file-alt');
    expect(buttons[1].name).toEqual('MyDeleteButtonName');
    expect(buttons[1].icon).toEqual('fas fa-trash-alt');
  });

  it('should call createNewItem when the new item header button is clicked', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    spyOn(component, 'createNewItem');

    buttons[0].onClick(0, 0);
    expect(component.createNewItem).toHaveBeenCalled();
  });

  it('should not disable the new item header button', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    let result = buttons[0].getDisabled();
    expect(result).toBeFalsy();
  });

  it('should prompt the user when the delete header button is clicked and only if an item is selected', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    let spy = spyOn(component.promptService, 'prompt');

    component.currentItem.isSelected = false;
    buttons[1].onClick();
    expect(spy).not.toHaveBeenCalled();

    component.currentItem.isSelected = true;
    buttons[1].onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT disable the delete header button if an item is selected', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    let result = buttons[1].getDisabled(2);
    expect(result).toBeFalsy();
  });

  it('should disable the delete header button if item is NOT selected', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    component.currentItem.isSelected = false;

    let result = buttons[1].getDisabled(2);
    expect(result).toBeTruthy();
  });

  it('should create an edit button when setRowButtons is called', () => {
    let buttons: Array<GridButton> = component.setRowButtons('MyEditButtonName');
    expect(buttons.length).toEqual(1);
    expect(buttons[0].name).toEqual('MyEditButtonName');
    expect(buttons[0].icon).toEqual('fas fa-edit');
  });

  it('should call editItem when the edit item row button is clicked', () => {
    let buttons: Array<GridButton> = component.setRowButtons('MyEditButtonName');
    spyOn(component, 'editItem');

    buttons[0].onClick();
    expect(component.editItem).toHaveBeenCalled();
  });

  it('should not call super handleKeyboardEvent if selected item is in edit mode when a key is pressed', () => {
    spyOn(GridComponent.prototype, 'handleKeyboardEvent');
    let spy = spyOn(component, 'saveUpdate');
    component.handleKeyboardEvent(event);
    expect(GridComponent.prototype.handleKeyboardEvent).not.toHaveBeenCalled();
  });

  it('should call saveUpdate if a field was updated and enter was pressed', () => {
    let spy = spyOn(component, 'saveUpdate');
    component.handleKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should update the current item\'s data if a field was edited and enter was pressed', () => {
    spyOn(component, 'saveUpdate');
    component.handleKeyboardEvent(event);
    expect(component.currentItem.data[2].value).toEqual('A Foolproof, Science-Based System that\'s Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 22 Days.')
  });

  it('should call saveService.checkForNoChanges if a field was updated and enter was pressed', () => {
    let spy = spyOn(saveService, 'checkForNoChanges');
    spyOn(component, 'saveUpdate');
    component.handleKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should set the current item to be not in edit mode if escape or enter was pressed', () => {
    spyOn(component, 'saveUpdate');
    component.handleKeyboardEvent(event);
    expect(component.currentItem.isInEditMode).toBeFalsy();

    event = new KeyboardEvent("keydown", {
      "code": "Escape",
    });
    component.currentItem.isInEditMode = true;
    component.handleKeyboardEvent(event);
    expect(component.currentItem.isInEditMode).toBeFalsy();
  });

  it('should put focus to the grid if the item was in edit mode and escape or enter was pressed', () => {
    let spy = spyOn(component.grid.nativeElement, 'focus');
    spyOn(component, 'saveUpdate');
    
    component.handleKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();

    event = new KeyboardEvent("keydown", {
      "code": "Escape",
    });
    component.currentItem.isInEditMode = true;

    component.handleKeyboardEvent(event);
    expect(spy).toHaveBeenCalled();
  });
});
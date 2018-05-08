import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditableGridComponent } from './editable-grid.component';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from '../grid-button';
import { GridComponent } from '../grid/grid.component';

class MockDataService { }
class MockSaveService { }
class MockPromptService {
  prompt(title: string, text: string, buttons: Array<any>) { }
}

describe('EditableGridComponent', () => {
  let component: EditableGridComponent;
  let fixture: ComponentFixture<EditableGridComponent>;

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

    component.currentItem = {
      isSelected: false,
      data: [{ value: 'myItem' }]
    }
    buttons[1].onClick();
    expect(spy).not.toHaveBeenCalled();

    component.currentItem.isSelected = true;
    buttons[1].onClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should NOT disable the delete header button if and item is selected', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    component.currentItem = {
      isSelected: true
    }
    let result = buttons[1].getDisabled();
    expect(result).toBeFalsy();
  });

  it('should disable the delete header button if and item is NOT selected', () => {
    let buttons: Array<GridButton> = component.setHeaderButtons('MyNewButtonName', 'MyDeleteButtonName');
    let result = buttons[1].getDisabled();
    expect(result).toBeTruthy();

    component.currentItem = {
      isSelected: false
    }

    result = buttons[1].getDisabled();
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

  it('should not call super handleKeyboardEvent if selected item is in edit mode', () => {
    spyOn(GridComponent.prototype, 'handleKeyboardEvent');
    let event = new KeyboardEvent("keydown", {
      "code": "Escape",
    });

    component.currentItem = {
      isSelected: true,
      isInEditMode: true
    }
    component.grid = {
      nativeElement: { focus() { } }
    }
    component.handleKeyboardEvent(event);
    expect(GridComponent.prototype.handleKeyboardEvent).not.toHaveBeenCalled();

  });
});
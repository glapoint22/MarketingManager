import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditableGridComponent } from './editable-grid.component';
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from '../grid-button';
import { GridComponent } from '../grid/grid.component';
import { TierComponent } from '../tier/tier.component';
import { QueryList } from '@angular/core';

class MockDataService { }
class MockSaveService {
  public newItems = [];
  public updatedItems = [];
  checkForNoChanges() { }
  addSaveItem(array: Array<any>, saveItem: any, tier: any) { }
}
class MockPromptService {
  prompt(title: string, text: string, buttons: Array<any>) { }
}
class MockTierComponent extends TierComponent {
  checkItemResults() { }
  collapseTiers() { }
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
    component.currentItem = {
      id: 22,
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
    saveService = TestBed.get(SaveService);
    fixture.detectChanges();
  });


  describe('setHeaderButtons', () => {
    it('should create two grid buttons', () => {
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
  });


  describe('setRowButtons', () => {
    it('should create an edit button', () => {
      let buttons: Array<GridButton> = component.setRowButtons('MyEditButtonName');
      expect(buttons.length).toEqual(1);
      expect(buttons[0].name).toEqual('MyEditButtonName');
      expect(buttons[0].icon).toEqual('fas fa-edit');
    });

    it('should call editItem when the edit button is clicked', () => {
      let buttons: Array<GridButton> = component.setRowButtons('MyEditButtonName');
      spyOn(component, 'editItem');

      buttons[0].onClick();
      expect(component.editItem).toHaveBeenCalled();
    });
  });

  describe('handleKeyboardEvent', () => {
    beforeEach(() => {
      component.grid = {
        nativeElement: { focus() { } }
      }

      component['editedFields'] = [
        { value: 'Strategy Guides 1' },
        { value: 'http://56e2c0n4zhqi1se007udp9fq11.hop.clickbank.net/' },
        { value: 'A Foolproof, Science-Based System that\'s Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 22 Days.' },
        { value: '40.7934' }
      ];

      event = new KeyboardEvent("keydown", {
        "code": "Enter",
      });
    });

    it('should not call super if selected item is in edit mode when a key is pressed', () => {
      spyOn(GridComponent.prototype, 'handleKeyboardEvent');
      component.handleKeyboardEvent(event);
      expect(GridComponent.prototype.handleKeyboardEvent).not.toHaveBeenCalled();
    });

    it('should increment change property if a field was updated and enter was pressed', () => {
      component.change = 0;
      component.handleKeyboardEvent(event);
      expect(component.change).toEqual(1);
    });

    it('should call saveUpdate if a field was updated and enter was pressed', () => {
      let spy = spyOn(component, 'saveUpdate');
      component.handleKeyboardEvent(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should update the current item\'s data if a field was edited and enter was pressed', () => {
      component.handleKeyboardEvent(event);
      expect(component.currentItem.data[2].value).toEqual('A Foolproof, Science-Based System that\'s Guaranteed to Melt Away All Your Unwanted Stubborn Body Fat in Just 22 Days.')
    });

    it('should call saveService.checkForNoChanges if a field was updated and enter was pressed', () => {
      let spy = spyOn(saveService, 'checkForNoChanges');
      component.handleKeyboardEvent(event);
      expect(spy).toHaveBeenCalled();
    });

    it('should set the current item to be not in edit mode if escape or enter was pressed', () => {
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

  describe('saveUpdate', () => {
    it('should only call saveService.addSaveItem if the item has NOT been previously set for save', () => {
      let spy = spyOn(saveService, 'addSaveItem');

      saveService.newItems.push({ item: component.currentItem });
      component.saveUpdate(component.currentItem, { index: 0, name: 'Categories' });
      expect(spy).not.toHaveBeenCalled();

      saveService.newItems = []
      saveService.updatedItems.push({ item: component.currentItem });
      component.saveUpdate(component.currentItem, { index: 0, name: 'Categories' });
      expect(spy).not.toHaveBeenCalled();

      saveService.updatedItems = [];
      saveService.newItems = []

      component.saveUpdate(component.currentItem, { index: 0, name: 'Categories' });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('editItem', () => {
    beforeEach(() => {
      let dom = fixture.debugElement.nativeElement;
      dom.appendChild(document.createElement('input')).setAttribute('class', 'edit one');
      dom.appendChild(document.createElement('input')).setAttribute('class', 'edit two');
      dom.appendChild(document.createElement('input')).setAttribute('class', 'edit three');
    });

    it('should set the item in edit mode', () => {
      component.currentItem.isInEditMode = false;
      component.editItem(component.currentItem);
      expect(component.currentItem.isInEditMode).toBeTruthy();
    });

    it('should create an array of edited fields', fakeAsync(() => {
      component.editItem(component.currentItem);
      tick(1);
      expect(component['editedFields'].length).toBeGreaterThan(0);
    }));

    it('should set focus to the first edited field', fakeAsync(() => {
      component.editItem(component.currentItem);
      tick(1);
      expect(document.activeElement).toEqual(component['editedFields'][0]);
    }));
  });

  describe('setDelete', () => {
    beforeEach(() => {
      component.tierComponent = new MockTierComponent();
      component.tierComponent.tierComponents = new QueryList<TierComponent>();
    });

    it('should set the current item to be unselected', () => {
      component.setDelete();
      expect(component.currentItem.isSelected).toBeFalsy();
    });

    it('should increment change property', () => {
      component.change = 0;
      component.setDelete();
      expect(component.change).toEqual(1);
    });

    it('should call deleteItem, tierComponent.checkItemResults, collapseDeletedTier, and  saveDelete', () => {
      let deleteItem = spyOn(component, 'deleteItem');
      let checkItemResults = spyOn(component.tierComponent, 'checkItemResults');
      let collapseDeletedTier = spyOn(component, 'collapseDeletedTier');
      let saveDelete = spyOn(component, 'saveDelete');

      component.setDelete();
      expect(deleteItem).toHaveBeenCalled();
      expect(checkItemResults).toHaveBeenCalled();
      expect(collapseDeletedTier).toHaveBeenCalled();
      expect(saveDelete).toHaveBeenCalled();
    });
  });

  describe('saveDelete', () => {
    it('should NOT call saveService.addSaveItem if the current item is in saveService.newItems and the item should be removed from saveService.newItems', () => {
      let spy = spyOn(saveService, 'addSaveItem');
      saveService.newItems.push({ item: component.currentItem });
      component.saveDelete(component.currentItem);
      expect(spy).not.toHaveBeenCalled();
      expect(saveService.newItems.length).toEqual(0);
    });

    it('should call saveService.addSaveItem if the current item is NOT in saveService.newItems and should remove the item from saveService.updatedItems', () => {
      let spy = spyOn(saveService, 'addSaveItem');
      saveService.updatedItems.push({ item: component.currentItem });
      component.saveDelete(component.currentItem);
      expect(spy).toHaveBeenCalled();
      expect(saveService.updatedItems.length).toEqual(0);
    });
  });


  describe('collapseDeletedTier', () => {
    let parentTier: TierComponent;
    let chidTier: TierComponent;
    beforeEach(()=>{
      component.tierComponent = new MockTierComponent();
      component.tierComponent.tierComponents = new QueryList<TierComponent>();
      parentTier = new TierComponent();
      chidTier = new TierComponent();
      chidTier.isExpanded = true;
      chidTier.parentId = 22;
      parentTier.isExpanded = true;
      parentTier.parentId = 0;
      parentTier.tierComponents = new QueryList<TierComponent>();
      parentTier.tierComponents['_results'] = [chidTier];
      component.tierComponent.tierComponents['_results'] = [parentTier];
    });

    it('should not set the parent tier isExpanded to false', () => {
      component.collapseDeletedTier(component.tierComponent.tierComponents);
      expect(parentTier.isExpanded).toBeTruthy();
    });

    it('should set the child tier isExpanded to false', () => {
      component.collapseDeletedTier(component.tierComponent.tierComponents);
      expect(chidTier.isExpanded).toBeFalsy();
    });
  });








});
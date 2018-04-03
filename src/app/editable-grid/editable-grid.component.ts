import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from "../data.service";

@Component({
  template: ''
})
export class EditableGridComponent extends GridComponent {
  public change: number = 0;
  private editedFields: Array<any>;

  constructor(dataService: DataService) { super(dataService) }

  setHeaderButtons(newButtonName: string, deleteButtonName: string, tierIndex: number) {
    return [
      {
        name: newButtonName,
        icon: 'fas fa-file-alt',
        onClick: (tierIndex: number, parentId: number) => {
          this.createNewItem(tierIndex, parentId);
        },
        getDisabled: () => {
          return false;
        }
      },
      {
        name: deleteButtonName,
        icon: 'fas fa-trash-alt',
        onClick: () => {
          this.setDelete();
        },
        getDisabled: () => {
          return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == tierIndex) : true;
        }
      }
    ]
  }

  setRowButtons(buttonName: string) {
    return [
      {
        name: buttonName,
        icon: 'fas fa-edit',
        onClick: (item, rowButton) => {
          this.editItem(item);
        }
      }
    ]
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    // Enter key
    if (event.keyCode === 13) {
      if (this.currentItem && this.currentItem.isInEditMode) {
        for (let i = 0; i < this.editedFields.length; i++) {
          this.currentItem.data[i].value = this.editedFields[i].value;
        }
        this.currentItem.isInEditMode = false;
        this.grid.nativeElement.focus();
      }
    }

    super.handleKeyboardEvent(event);
  }

  editItem(item) {
    item.isInEditMode = true;
    window.setTimeout(() => {
      this.editedFields = Array.from(document.getElementsByClassName('edit'));
      this.editedFields[0].focus();
    }, 1);
  }

  setDelete() {
    if (this.currentItem && this.currentItem.isSelected) {
      this.currentItem.isSelected = false;
      this.deleteItem(this.currentItem);
      this.change += 1;
      this.tierComponent.checkItemResults();
      this.collapseDeletedTier(this.tierComponent.tierComponents);
    }
  }

  collapseDeletedTier(tierComponents){
    tierComponents.toArray().filter(x => x.isExpanded).forEach(x => {
      if(x.parentId === this.currentItem.id){
        x.isExpanded = false;
      }else{
        this.collapseDeletedTier(x.tierComponents);
      }
    });
  }

  deleteItem(item: any) {
    //Delete this current item
    item.isDeleted = true;

    //Delete any sub items
    let nextTier = this.tiers[item.tierIndex + 1];
    if (nextTier) {
      let items = nextTier.items.filter(x => x.parentId === item.id);
      items.forEach(x => this.deleteItem(x));
    }
  }

  createNewItem(tierIndex: number, parentId: number) {
    let newItem = {
      parentId: parentId,
      id: this.createItemId(this.tiers[tierIndex].items, tierIndex),
      tierIndex: tierIndex,
      data: [],
      isInEditMode: true,
      isSelected: true
    }
    this.tiers[tierIndex].fields.forEach(x => newItem.data.push({ value: x.defaultValue }));
    this.tiers[tierIndex].items.unshift(newItem);
    this.change += 1;
    this.currentItem = newItem;
    this.editItem(newItem);
  }

  createItemId(items, tierIndex) {
    return Math.max(-1, Math.max.apply(null, items.map(x => x.id))) + 1;
  }
}
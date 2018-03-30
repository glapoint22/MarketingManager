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
        onClick: () => {
          console.log('Create');
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
          item.isInEditMode = true;
          window.setTimeout(() => {
            this.editedFields = Array.from(document.getElementsByClassName('edit'));
            this.editedFields[0].focus();
          }, 1);
        }
      }
    ]
  }

  handleKeyboardEvent(event: KeyboardEvent) {
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

  setDelete() {
    if (this.currentItem && this.currentItem.isSelected) {
      this.currentItem.isSelected = false;
      this.deleteItem(this.currentItem);
      this.change += 1;
      this.tierComponent.checkItemResults();
    }
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
}

import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from "../data.service";
import { SaveService } from "../save.service";
import { PromptService } from "../prompt.service";
import { GridButton } from "../grid-button";

@Component({
  template: ''
})
export class EditableGridComponent extends GridComponent {
  public change: number = 0;
  private editedFields: Array<any>;

  constructor(dataService: DataService, saveService: SaveService, public promptService: PromptService) { super(dataService, saveService) }

  setHeaderButtons(newButtonName: string, deleteButtonName: string): Array<GridButton> {
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
          if (this.currentItem && this.currentItem.isSelected) {
            this.promptService.prompt('Confirm Delete', 'Are you sure you want to delete "' + this.currentItem.data[0].value + '"?', [
              {
                text: 'Yes',
                callback: () => this.setDelete()
              },
              {
                text: 'No',
                callback: () => { }
              }
            ]);
          }
        },
        getDisabled: (tierIndex: number) => {
          return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == tierIndex) : true;
        }
      }
    ]
  }

  setRowButtons(buttonName: string): Array<GridButton> {
    return [
      {
        name: buttonName,
        icon: 'fas fa-edit',
        onClick: (item) => {
          this.editItem(item);
        }
      }
    ]
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    let dataChanged: boolean;

    // Don't call super if item is in edit mode
    if (this.currentItem && !this.currentItem.isInEditMode) {
      super.handleKeyboardEvent(event);
    }

    // Enter key or escape key
    if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Escape') {
      if (this.currentItem && this.currentItem.isInEditMode) {

        // If enter key was pressed
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
          dataChanged = this.editedFields.some((x, i) => x.value !== this.currentItem.data[i].value);

          // If there was a change to the data
          if (dataChanged) {
            this.change += 1;
            this.saveUpdate(this.currentItem, this.tiers[this.currentItem.tierIndex]);
            this.currentItem.data.forEach((x, i) => {
              if (this.editedFields[i].value.search(/\S/) !== -1) {
                x.value = this.editedFields[i].value;
              }
            });
            this.saveService.checkForNoChanges();
          }
        }

        // Get out of edit mode
        this.currentItem.isInEditMode = false;
        this.grid.nativeElement.focus();
      }
    }
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
      // this.collapseDeletedTier(this.tierComponent.tierComponents);
      this.saveDelete(this.currentItem);
    }
  }

  saveDelete(item) {
    // Put this deleted item in the deleted items array so it can be saved to the database
    if (!this.saveService.newItems.some(x => x.item == item)) {
      this.saveService.addSaveItem(this.saveService.deletedItems, item, this.tiers[item.tierIndex]);
      this.saveService.updatedItems.splice(this.saveService.updatedItems.findIndex(x => x.item == item), 1);
    } else {
      this.saveService.newItems.splice(this.saveService.newItems.findIndex(x => x.item == item), 1);
    }
  }

  // collapseDeletedTier(tierComponents) {
  //   tierComponents.toArray().filter(x => x.isExpanded).forEach(x => {
  //     if (x.parentId === this.currentItem.id) {
  //       x.isExpanded = false;
  //     } else {
  //       this.collapseDeletedTier(x.tierComponents);
  //     }
  //   });
  // }

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

    // Put this item in the newItems array so it can be saved to the database
    this.saveService.addSaveItem(this.saveService.newItems, this.tiers[tierIndex].items[0], this.tiers[tierIndex]);
  }

  createItemId(items, tierIndex) {
    return Math.max(-1, Math.max.apply(null, items.map(x => x.id))) + 1;
  }
}
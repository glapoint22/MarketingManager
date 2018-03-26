import { Component } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from "../data.service";

@Component({
  template: ''
})
export class EditableGridComponent extends GridComponent  {

  constructor(dataService: DataService) { super(dataService) }


  setHeaderButtons(newButtonName: string, deleteButtonName: string, tierIndex: number){
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
          console.log('Delete');
        },
        getDisabled: () => {
          return this.currentItem ? !(this.currentItem.isSelected && this.currentItem.tierIndex == tierIndex) : true;
        }
      }
    ]
  }


  setRowButtons(buttonName: string){
    return [
      {
        name: buttonName,
        icon: 'fas fa-edit',
        onClick: (item, row) => {
          console.log(item);
        }
      }
    ]
  }
}

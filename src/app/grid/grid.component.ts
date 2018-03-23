import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../data.service";
import { TierComponent } from '../tier/tier.component';
import { Itier } from '../itier';
import { Igrid } from '../igrid';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, Igrid {
  @ViewChild(TierComponent) tierComponent: TierComponent;
  public tiers: Array<Itier> = [];
  public searchOptions: Array<string> = [];
  public selectedSearchOption: string;
  public apiUrl: string;
  public apiParameters: Array<any> = [];
  public gridHeight: number;
  public searchValue: string = '';
  public tierToSearch: number = 0;
  public currentItem: any;

  constructor(public dataService: DataService) { }

  createTiers(data: Array<any>) { }
  setGridHeight() { }

  ngOnInit() {
    this.dataService.get(this.apiUrl, this.apiParameters)
      .subscribe((data: any) => {
        this.createTiers(data);
        this.setSearchOptions();
        this.setGridHeight();

      }, error => {
        // Error
      });
  }

  setSearchOptions() {
    this.tiers.forEach(x => this.searchOptions.push(x.name));
    this.selectedSearchOption = this.searchOptions[0];
  }

  onSearchChange(searchValue: string) {
    this.searchValue = searchValue;
    this.tierToSearch = this.tiers.findIndex(x => x.name == this.selectedSearchOption);


    this.tierComponent.setTier(this.tiers[this.tierToSearch]);

    if (searchValue.length == 0) {
      this.tierToSearch = 0;
      this.tierComponent.setTier(this.tiers[0]);
    }
  }

  clearSearchText(inputField) {
    let value = inputField.value;

    //Set the input field's value to an empty string
    inputField.value = '';

    //Call onSearchChange to get items back
    if (value.length > 0) this.onSearchChange('');
  }

  onItemSelect(item: any): void {
    if(this.currentItem !== item){
      item.isSelected = true;

      //If there is a current item
      if (this.currentItem) {
        //Set that the current item is not selected
        this.currentItem.isSelected = false;
      }
      //Set this item as the current item
      this.currentItem = item;
    }
  }
}

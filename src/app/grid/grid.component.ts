import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
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
  @ViewChild('searchInput') searchInput: ElementRef;
  public tiers: Array<Itier> = [];
  public searchOptions: Array<string> = [];
  public selectedSearchOption: string;
  public apiUrl: string;
  public apiParameters: Array<any> = [];
  public searchValue: string = '';
  public tierToSearch: number = 0;
  public currentItem: any;
  public hasFocus: boolean = false;

  constructor(public dataService: DataService) { }

  createTiers(data?: Array<any>) {
    this.tierComponent.grid = this;
    this.tierComponent.setTier(this.tiers[0]);
   }

  onTierCollapse(){}

  ngOnInit() {
    this.dataService.get(this.apiUrl, this.apiParameters)
      .subscribe((data: any) => {
        this.createTiers(data);
        this.setSearchOptions();

      }, error => {
        // Error
      });
  }

  setSearchOptions() {
    this.tiers.forEach(x => this.searchOptions.push(x.name));
    this.selectedSearchOption = this.searchOptions[0];
  }

  onSearchChange(searchValue: string) {
    this.tierComponent.collapseTiers();
    if(this.currentItem && this.currentItem.isSelected){
      this.currentItem.isSelected = false;
    }
    
    this.searchValue = searchValue;
    this.tierToSearch = this.tiers.findIndex(x => x.name == this.selectedSearchOption);


    this.tierComponent.setTier(this.tiers[this.tierToSearch]);

    if (searchValue.length == 0) {
      this.tierToSearch = 0;
      this.tierComponent.setTier(this.tiers[0]);
    }
  }

  clearSearchText() {
    let value = this.searchInput.nativeElement.value;

    //Set the input field's value to an empty string
    this.searchInput.nativeElement.value = '';

    //Call onSearchChange to get items back
    if (value.length > 0) this.onSearchChange('');
  }

  onItemSelect(item: any): void {
    //Select the item
    item.isSelected = true;

    //If there is a current item
    if (this.currentItem && this.currentItem !== item) {
      //Set that the current item is not selected
      this.currentItem.isSelected = false;
    }
    //Set this item as the current item
    this.currentItem = item;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.hasFocus) {
      //Escape
      if (event.keyCode === 27) {
        if (this.currentItem) {
          this.currentItem.isSelected = false;
        }
      }
    }
  }
}

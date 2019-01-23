import { Component, OnInit, ViewChild, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { DataService } from "../data.service";
import { TierComponent } from '../tier/tier.component';
import { Itier } from '../itier';
import { Igrid } from '../igrid';
import { SaveService } from '../save.service';

@Component({
  selector: 'grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit, Igrid {
  @Output() onItemClick = new EventEmitter<any>();
  @Output() onCollapsedTier = new EventEmitter<any>();
  @ViewChild(TierComponent) tierComponent: TierComponent;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('grid') grid: ElementRef;
  public tiers: Array<Itier> = [];
  public searchOptions: Array<string> = [];
  public selectedSearchOption: string;
  public apiUri: string;
  public searchValue: string = '';
  public tierToSearch: number = 0;
  public currentItem: any;
  public hasFocus: boolean = false;
  public isHighlightRow: boolean = true;
  public defaultMaxItemCount: number = 50;
  public maxItems: number = this.defaultMaxItemCount;

  constructor(public dataService: DataService, public saveService: SaveService) { }

  ngOnInit() {
    this.dataService.validateToken().subscribe(()=>{
      this.dataService.get(this.apiUri)
      .subscribe((data: any) => {
        this.createTiers(data);
        this.setSearchOptions();
      });
    });
    
  }

  createTiers(data?: Array<any>) {
    this.tierComponent.grid = this;
    this.tierComponent.setTier(this.tiers[0]);
  }

  setSearchOptions() {
    this.tiers.forEach(x => this.searchOptions.push(x.name));
    this.selectedSearchOption = this.searchOptions[0];
  }

  onSearchChange(searchValue: string) {
    //Assign the search value to the grid
    this.searchValue = searchValue;

    //Check the item result count
    this.tierComponent.checkItemResults();

    //Collapse all tiers of the grid
    this.tierComponent.collapseTiers();

    //Make sure no item is selected
    if (this.currentItem && this.currentItem.isSelected) {
      this.currentItem.isSelected = false;
    }

    //Set the tier to search based on which search option is selected
    let tierIndex = this.tiers.findIndex(x => x.name == this.selectedSearchOption);
    if (tierIndex !== this.tierToSearch) {
      this.tierToSearch = tierIndex;
      this.tierComponent.setTier(this.tiers[this.tierToSearch]);
    }

    //If the search value is an empty string, set the tier to search to the first tier
    if (searchValue.length == 0 && this.tierToSearch !== 0) {
      this.tierToSearch = 0;
      this.tierComponent.setTier(this.tiers[0]);
    }

    this.maxItems = this.defaultMaxItemCount;
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

    this.onItemClick.emit(item);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.hasFocus) {
      //Escape
      if (event.code === 'Escape') {
        if (this.currentItem) {
          this.currentItem.isSelected = false;
        }
      }
    }
  }

  saveUpdate(item, tier) {
    // Put this edited item in the updated items array so it can be saved to the database
    if (!this.saveService.newItems.some(x => x.item == item) && !this.saveService.updatedItems.some(x => x.item == item)) {
      this.saveService.addSaveItem(this.saveService.updatedItems, item, tier);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setParentTierHeight();
  }

  setParentTierHeight() {
    this.tierComponent.parentTierHeight = window.innerHeight - 91;
  }

  setMaxItems(event) {
    let scrollPos = event.srcElement.scrollTop / (event.srcElement.scrollHeight - event.srcElement.offsetHeight);
    if (scrollPos > 0.9) this.maxItems += this.defaultMaxItemCount;
  }

  onFocus() {
    this.hasFocus = true;
  }

  onBlur() {
    this.hasFocus = false;
  }

  onTierCollapse() {
    this.onCollapsedTier.emit();
  }
}
import { Component, ViewChildren, QueryList, Input, ElementRef } from '@angular/core';
import { Itier } from '../itier';
import { Igrid } from '../igrid';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements Itier {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  @ViewChildren('checkbox') checkboxElements: QueryList<ElementRef>;
  @ViewChildren('row') itemResults: QueryList<ElementRef>;
  @ViewChildren('edit') editInputElements: QueryList<ElementRef>;
  @Input() grid: Igrid;
  public index: number = -1;
  public name: string;
  public items: Array<any>;
  public fields: Array<any>;
  public headerButtons: Array<any> = [];
  public rowButtons: Array<any> = [];
  public isExpanded: boolean = false;
  public parentId: number;
  public margin: number = 0;
  public parentTierHeight: number;
  public noResults: boolean;

  constructor() { }

  setTier(tier: Itier) {
    this.index = tier.index;
    this.name = tier.name;
    this.items = tier.items;
    this.fields = tier.fields;
    this.headerButtons = tier.headerButtons;
    this.rowButtons = tier.rowButtons;
  }

  onToggleExpandCollapse(itemId: number, rowIndex: number) {
    let child: TierComponent = this.tierComponents.toArray()[rowIndex];

    //This will expand or collapse the row
    if (child.isExpanded) {
      this.collapseTier(child);
    } else {
      child.setTier(this.grid.tiers[this.index + 1]);
      child.parentId = itemId;
      child.margin = 21;

      window.setTimeout(() => {
        child.isExpanded = true;
      }, 1);
    }
  }

  onTransitionEnd(rowIndex: number, event: TransitionEvent) {
    let child = this.tierComponents.toArray()[rowIndex];

    if (!child.isExpanded && event.elapsedTime >= 0.5) {
      child.index = -1;
    }
  }

  collapseTier(tier: TierComponent, checkbox?: ElementRef) {
    this.grid.onTierCollapse();

    if (this.grid.currentItem && tier.index == this.grid.currentItem.tierIndex) {
      this.grid.currentItem.isSelected = false;
    }
    tier.isExpanded = false;
    if (checkbox) {
      checkbox.nativeElement.checked = false;
      checkbox.nativeElement.parentElement.parentElement.classList.remove('max-expand');
    }

    if (tier.tierComponents.length > 0) {
      tier.collapseTiers();
    }
  }

  collapseTiers() {
    let children = this.tierComponents.toArray();
    let checkboxes = this.checkboxElements.toArray();

    for (let i = 0; i < children.length; i++) {
      this.collapseTier(children[i], checkboxes.length > 0 ? checkboxes[i] : null);
    }
  }

  onCheckboxChange(checkbox, row) {
    if (checkbox.checked) {
      row.classList.add('max-expand');
    } else {
      row.classList.remove('max-expand');
    }
  }

  isCollapsed() {
    //Test to see if all rows in this tier is collapsed.
    if (this.tierComponents.length > 0) {
      return this.tierComponents.toArray().some(x => x.isExpanded);
    }
  }

  checkItemResults() {
    //This is used to test if we need to dsiplay the no results message
    window.setTimeout(() => {
      this.noResults = false;
      if (this.itemResults.toArray().length === 0 && this.grid.searchValue.length > 0) this.noResults = true;
    }, 1);
  }

  checkFocus(item: any) {
    window.setTimeout(() => {
      if(!this.editInputElements.some(x => x.nativeElement == document.activeElement)){
        item.isInEditMode = false;
      }
    }, 1);
    
  }
}
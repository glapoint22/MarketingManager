import { Component, ViewChildren, QueryList, Input, AfterViewInit } from '@angular/core';
import { Itier } from '../itier';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements AfterViewInit, Itier {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  // @Input() tiers: Itier[];
  @Input() grid;
  public parentId: number;
  public margin: number = 0;
  public children: Array<TierComponent>;
  public index: number = -1;
  public name: string;
  public items: Array<any>;
  public fields: Array<any>;

  constructor() { }

  ngAfterViewInit() {
    this.tierComponents.changes.subscribe((x: QueryList<TierComponent>) => {
      if (x.length > 0) {
        this.children = x.toArray();
      }
    });
  }

  onRowButtonClick(itemId, rowIndex) {
    let childTier: TierComponent = this.children[rowIndex];

    //This will expand or collapse the row
    if (childTier.items) {
      this.clearChildTier(childTier);
    } else {
      childTier.setTier(this.grid.tiers[this.index + 1]);
      childTier.parentId = itemId;
      childTier.margin = 16;
    }
  }

  collapse() {
    //Collapse all rows from this tier
    this.children.forEach(x => this.clearChildTier(x));
  }

  isCollapsed() {
    //Test to see if all rows in this tier is collapsed.
    if (this.children) {
      return this.children.some(x => x.items !== undefined);
    }
  }

  setTier(tier: Itier){
    this.index = tier.index;
    this.name = tier.name;
    this.items = tier.items;
    this.fields = tier.fields;
  }

  clearChildTier(childTier: TierComponent){
    delete childTier.items;
    delete childTier.fields;
  }
}

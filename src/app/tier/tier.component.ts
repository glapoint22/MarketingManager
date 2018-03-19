import { Component, ViewChildren, QueryList, Input, AfterViewInit } from '@angular/core';
import { Itier } from '../itier';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements AfterViewInit, Itier {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  @Input() grid;
  public parentId: number;
  public margin: number = 0;
  public children: Array<TierComponent>;
  public index: number = -1;
  public name: string;
  public items: Array<any>;
  public fields: Array<any>;
  public isExpanded: boolean = false;;
  public isMaxExpanded: boolean = false;


  constructor() { }

  ngAfterViewInit() {
    this.tierComponents.changes.subscribe((x: QueryList<TierComponent>) => {
      if (x.length > 0) {
        this.children = x.toArray();
      }
    });
  }

  setTier(tier: Itier) {
    this.index = tier.index;
    this.name = tier.name;
    this.items = tier.items;
    this.fields = tier.fields;
  }

  onToggleExpandCollapse(itemId: number, rowIndex: number) {
    let childTier: TierComponent = this.children[rowIndex];

    //This will expand or collapse the row
    if (childTier.isExpanded) {
      childTier.isExpanded = false;
      if (childTier.isMaxExpanded) {
        childTier.isMaxExpanded = false;
      }
    } else {
      childTier.setTier(this.grid.tiers[this.index + 1]);
      childTier.parentId = itemId;
      childTier.margin = 21;

      window.setTimeout(() => {
        childTier.isExpanded = true;
      }, 1);

      if (this.isExpanded) {
        this.isMaxExpanded = true;
      }
    }
  }

  onTransitionEnd(rowIndex: number) {
    if (!this.children[rowIndex].isExpanded) {
      this.children[rowIndex].index = -1;
    }
  }

  // collapse() {
  //   //Collapse all rows from this tier
  //   this.children.forEach(x => this.clearChildTier(x));
  // }

  // isCollapsed() {
  //   //Test to see if all rows in this tier is collapsed.
  //   if (this.children) {
  //     return this.children.some(x => x.items !== undefined);
  //   }
  // }



  // clearChildTier(childTier: TierComponent) {
  //   delete childTier.items;
  //   delete childTier.fields;
  // }
}

import { Component, ViewChildren, QueryList, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements AfterViewInit {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  @Input() tiers;
  public tier;
  public parentId;
  public margin: number = 0;
  public children: Array<TierComponent>;

  constructor() { }

  ngAfterViewInit() {
    this.tierComponents.changes.subscribe((x: QueryList<TierComponent>) => {
      if (x.length > 0) {
        this.children = x.toArray();
      }
    });
  }

  onRowButtonClick(parentId, index) {
    let child = this.children[index];

    //This will expand or collapse the row
    if (child.tier) {
      delete child.tier;
    } else {
      child.tier = this.tiers[this.tier.index + 1];
    }

    //Parent id is used to filter out only child records associated with the parent
    child.parentId = parentId;
    
    child.margin = 16;
  }

  collapse() {
    //Collapse all rows from this tier
    this.children.forEach(x => delete x.tier);
  }

  isCollapsed() {
    //Test to see if all rows in this tier is collapsed.
    if (this.children) {
      return this.children.some(x => x.tier);
    }
  }
}

import { Component, ViewChildren, QueryList, Input, AfterViewInit, ElementRef } from '@angular/core';
import { Itier } from '../itier';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements AfterViewInit, Itier {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  @ViewChildren('checkbox') checkboxElements: QueryList<ElementRef>;
  @Input() grid;
  public parentId: number;
  public margin: number = 0;
  public children: Array<TierComponent>;
  public index: number = -1;
  public name: string;
  public items: Array<any>;
  public fields: Array<any>;
  public isExpanded: boolean = false;;

  public checkboxes: Array<ElementRef> = [];


  constructor() { }

  ngAfterViewInit() {
    this.tierComponents.changes.subscribe((x: QueryList<TierComponent>) => {
      if (x.length > 0) {
        this.children = x.toArray();
      }
    });

    this.checkboxElements.changes.subscribe((x: QueryList<ElementRef>) => {
      if (x.length > 0) {
        this.checkboxes = x.toArray();
      }
    });
  }

  setTier(tier: Itier) {
    this.checkboxes = [];
    this.children = [];
    this.index = tier.index;
    this.name = tier.name;
    this.items = tier.items;
    this.fields = tier.fields;
  }

  onToggleExpandCollapse(itemId: number, rowIndex: number) {
    let childTier: TierComponent = this.children[rowIndex];

    //This will expand or collapse the row
    if (childTier.isExpanded) {
      // childTier.isExpanded = false;
      this.collapseTier(childTier);
    } else {
      childTier.setTier(this.grid.tiers[this.index + 1]);
      childTier.parentId = itemId;
      childTier.margin = 21;

      window.setTimeout(() => {
        childTier.isExpanded = true;
      }, 1);
    }
  }

  onTransitionEnd(rowIndex: number, event: TransitionEvent) {
    if (!this.children[rowIndex].isExpanded && event.elapsedTime >= 0.5) {
      this.children[rowIndex].index = -1;
    }
  }

  collapseTier(tier: TierComponent, checkbox?: ElementRef) {
    tier.isExpanded = false;
    if (checkbox) checkbox.nativeElement.checked = false;

    if (tier.children) {
      this.collapseTiers(tier);
    }
  }

  collapseTiers(tier: TierComponent) {
    for (let i = 0; i < tier.children.length; i++) {
      this.collapseTier(tier.children[i], tier.checkboxes ? tier.checkboxes[i] : null);
    }
  }

  // isCollapsed() {
  //   //Test to see if all rows in this tier is collapsed.
  //   if (this.children) {
  //     return this.children.some(x => x.items !== undefined);
  //   }
  // }
}

import { Component, ViewChildren, QueryList, Input, ElementRef } from '@angular/core';
import { Itier } from '../itier';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements Itier {
  @ViewChildren(TierComponent) tierComponents: QueryList<TierComponent>;
  @ViewChildren('checkbox') checkboxElements: QueryList<ElementRef>;
  @Input() grid;
  public parentId: number;
  public margin: number = 0;
  public index: number = -1;
  public name: string;
  public items: Array<any>;
  public fields: Array<any>;
  public isExpand: boolean = false;;

  constructor() { }

  setTier(tier: Itier) {
    this.index = tier.index;
    this.name = tier.name;
    this.items = tier.items;
    this.fields = tier.fields;
  }

  onToggleExpandCollapse(itemId: number, rowIndex: number) {
    let child: TierComponent = this.tierComponents.toArray()[rowIndex];

    //This will expand or collapse the row
    if (child.isExpand) {
      this.collapseTier(child);
    } else {
      child.setTier(this.grid.tiers[this.index + 1]);
      child.parentId = itemId;
      child.margin = 21;

      window.setTimeout(() => {
        child.isExpand = true;
      }, 1);
    }
  }

  onTransitionEnd(rowIndex: number, event: TransitionEvent) {
    let child = this.tierComponents.toArray()[rowIndex];
    
    if (!child.isExpand && event.elapsedTime >= 0.5) {
      child.index = -1;
    }
  }

  collapseTier(tier: TierComponent, checkbox?: ElementRef) {
    tier.isExpand = false;
    if (checkbox) {
      checkbox.nativeElement.checked = false;
      checkbox.nativeElement.parentElement.parentElement.parentElement.classList.remove('max-expand');
    }

    if (tier.tierComponents.length > 0) {
      this.collapseTiers(tier);
    }
  }

  collapseTiers(tier: TierComponent) {
    let children = tier.tierComponents.toArray();
    let checkboxes = tier.checkboxElements.toArray();

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
      return this.tierComponents.toArray().some(x => x.isExpand);
    }
  }
}

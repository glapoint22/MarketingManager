import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'expandable-grid',
  templateUrl: './expandable-grid.component.html',
  styleUrls: ['./expandable-grid.component.scss']
})
export class ExpandableGridComponent implements OnInit {
  public items: Array<any>;
  public apiUrl: string;
  public tier1: string;
  public tier2: string;
  public tier3: string;

  private all: Array<any>;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get(this.apiUrl)
      .subscribe((response: any) => {
        this.all = response;
        this.items = response.map(x => ({ name: x.name }));
      }, error => {
        // Error
      });
  }

  onTier1CheckboxChange(index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[index][this.tier2] = this.all[index][this.tier2].map(x => ({ name: x.name }));
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier2TransitionEnd(index: number, checkbox){
    if(!checkbox.checked && this.items[index][this.tier2]){
      delete this.items[index][this.tier2];
    }
  }

  onTier2CheckboxChange(tier1Index: number, tier2Index: number, checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false;

      this.items[tier1Index][this.tier2][tier2Index][this.tier3] = this.all[tier1Index][this.tier2][tier2Index][this.tier3];
      window.setTimeout(() => {
        checkbox.checked = true;
      }, 1);
    }
  }

  tier3TransitionEnd(tier1Index: number, tier2Index: number, checkbox){
    if(!checkbox.checked && this.items[tier1Index][this.tier2][tier2Index][this.tier3]){
      delete this.items[tier1Index][this.tier2][tier2Index][this.tier3];
    }
  }
}

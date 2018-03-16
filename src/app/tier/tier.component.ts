import { Component, OnInit, ViewChildren, QueryList, Input } from '@angular/core';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss']
})
export class TierComponent implements OnInit {
  @ViewChildren(TierComponent) children: QueryList<TierComponent>;
  @Input() tiers;
  public tier;
  public parentId;
  public margin: number = 0;

  constructor() { }

  ngOnInit() {
  }

  // ngAfterViewInit(){
  //   console.log(this.gridId);
  // }

  expandRow(item, index) {
    let child = this.children.toArray()[index];

    if(child.tier){
      delete child.tier;
    }else{
      child.tier = this.tiers[item.tier + 1];
    }
    
    child.parentId = item.id;
    child.margin = 17;
  }

  rotateArrow(button){
    if(button.classList.contains('rotate-arrow')){
      button.classList.remove('rotate-arrow')
    }else{
      button.classList.add('rotate-arrow');
    }
  }
}

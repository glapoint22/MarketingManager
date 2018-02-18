import { Component, OnInit } from '@angular/core';
import { ExpandableGridComponent } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";
import { HostListener } from '@angular/core';

@Component({
  selector: 'shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends ExpandableGridComponent implements OnInit {
  public gridHeight: number;

  constructor(dataService: DataService) {super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    this.tier2 = 'niches';
    this.tier3 = 'products';
    super.ngOnInit();
    this.setHeight();
  }

  setHeight(){
    this.gridHeight = window.innerHeight - 66;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight();
  }

}

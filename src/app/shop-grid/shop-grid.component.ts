import { Component, OnInit } from '@angular/core';
import { ExpandableGridComponent } from "../expandable-grid/expandable-grid.component";
import { DataService } from "../data.service";

@Component({
  selector: 'shop-grid',
  templateUrl: './shop-grid.component.html',
  styleUrls: ['../expandable-grid/expandable-grid.component.scss', './shop-grid.component.scss']
})
export class ShopGridComponent extends ExpandableGridComponent implements OnInit {

  constructor(dataService: DataService) {super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Categories';
    super.ngOnInit();
  }

}

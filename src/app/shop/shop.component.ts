import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss', '../expandable-grid/expandable-grid.component.scss', '../shop-grid/shop-grid.component.scss']
})
export class ShopComponent implements OnInit {
  public filters;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get('api/Filters')
      .subscribe((data: any) => {
        this.filters = data
      }, error => {
        // Error
      });
  }
}

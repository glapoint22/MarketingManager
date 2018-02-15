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

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get(this.apiUrl)
        .subscribe((response: any) => {
          this.items = response;
        }, error => {
          // Error
        });
  }

}

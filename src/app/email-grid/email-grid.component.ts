import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from '../data.service';

@Component({
  selector: 'email-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class EmailGridComponent extends GridComponent implements OnInit {
  @Output() onItemClick = new EventEmitter<any>();

  constructor(dataService: DataService) { super(dataService) }

  ngOnInit() {
    this.apiUrl = 'api/Mail';
    this.setParentTierHeight();
    super.ngOnInit();
  }

  createTiers(data: Array<any>) {
    // Categories
    this.tiers.push({
      index: 0,
      name: 'Categories',
      items: data
        .map(x => ({
          id: x.id,
          tierIndex: 0,
          data: [
            {
              value: x.name
            }
          ]
        })),
      fields: [
        {
          name: 'Category',
          width: 5000
        }
      ]
    });

    //Niches
    let items = data
      .map(x => x.niches
        .map(y => ({
          parentId: x.id,
          id: y.id,
          tierIndex: 1,
          emails: y.emails,
          data: [
            {
              value: y.name
            }
          ]
        })));
    items = [].concat.apply([], items);

    this.tiers.push({
      index: 1,
      name: 'Niches',
      items: items,
      fields: [
        {
          name: 'Niche',
          width: 5000
        }
      ],
    });

    //Products
    items = data
      .map(x => x.niches
        .map(y => y.products
          .map(z => ({
            parentId: y.id,
            id: z.id,
            tierIndex: 2,
            emails: z.emails,
            hoplink: z.hoplink,
            data: [
              {
                value: z.name
              }
            ]
          }))));

    items = [].concat.apply([], items.concat.apply([], items));

    this.tiers.push({
      index: 2,
      name: 'Products',
      items: items,
      fields: [
        {
          name: 'Product',
          width: 5000
        }
      ],
    });

    super.createTiers();
  }

  onItemSelect(item: any): void {
    this.onItemClick.emit(item);
    super.onItemSelect(item);
  }

}

import { Component, OnInit, ElementRef } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { DataService } from '../data.service';
import { SaveService } from '../save.service';

@Component({
  selector: 'lead-magnet-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class LeadMagnetGridComponent extends GridComponent implements OnInit {

  constructor(dataService: DataService, saveService: SaveService, private element: ElementRef) { super(dataService, saveService) }

  ngOnInit() {
    this.apiUrl = 'api/Leads';
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
          documents: y.leadPages,
          leadMagnet: y.leadMagnet,
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
      setItem: (item) => {
        return {
          ID: item.id,
          LeadPages: item.documents.map(x => ({
            ID: x.id,
            NicheID: item.id,
            Title: x.title,
            Body: x.body,
            PageTitle: x.pageTitle
          }))
        }
      },
      check: (item) => {
        return true;
      },
      url: 'api/Niches'
    });


    super.createTiers();
    this.element.nativeElement.firstElementChild.focus();
    this.hasFocus = true;
  }

}

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GridComponent } from "../grid/grid.component";
import { DataService } from '../data.service';
import { SaveService } from '../save.service';
import { LinkService } from '../link.service';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'email-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class EmailGridComponent extends GridComponent implements OnInit {
  @Output() onItemClick = new EventEmitter<any>();

  constructor(dataService: DataService, saveService: SaveService, private linkService: LinkService, private promptService: PromptService) { super(dataService, saveService) }

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
          LeadMagnetEmails: item.emails.map(x => ({
            ID: x.id,
            NicheID: item.id,
            Subject: x.subject,
            Body: x.body
          }))
        }
      },
      check: (item) => {
        let pattern = new RegExp(/href=\"(\{3\}([\/a-zA-Z\?=\{\d\}&\.]+)?|([(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6})\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))\"/g);
        let match = /href/g.exec(item.emails[0].body);
        
        while (match !== null) {
          match = /href/g.exec(item.emails[0].body);
        }

        return false;
      },
      url: 'api/Niches'
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
      setItem: (item) => {
        return {
          ID: item.id,
          EmailCampaigns: item.emails.map(x => ({
            ID: x.id,
            ProductID: item.id,
            Subject: x.subject,
            Body: x.body,
            Day: x.day
          }))
        }
      },
      check: (item) => {
        
        // Check url
        for(let i = 0; i < item.emails.length; i++){
          if(!this.linkService.validateUrl(item.emails[i].body)){
            this.promptService.prompt('Quality Control', 'Email "' + item.emails[i].subject + '", from product "' + item.data[0].value + '", has an invalid URL.', [
              {
                text: 'Ok',
                callback: () => { }
              }
            ]);
            return false
          }
        }

        return true;
        
      },
      url: 'api/Products'
    });

    super.createTiers();
  }

  onItemSelect(item: any): void {
    this.onItemClick.emit(item);
    super.onItemSelect(item);
  }

}

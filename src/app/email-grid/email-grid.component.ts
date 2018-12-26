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
        return this.validateEmails(item);
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
        return this.validateEmails(item);
      },
      url: 'api/Products'
    });

    super.createTiers();
  }

  onItemSelect(item: any): void {
    this.onItemClick.emit(item);
    super.onItemSelect(item);
  }

  validateEmails(item): boolean {
    let itemType = this.tiers[item.tierIndex].fields[0].name;

    for (let i = 0; i < item.emails.length; i++) {
      // Check for invlaid tags
      if (/<font/.test(item.emails[i].body) || /<b>/.test(item.emails[i].body) || /<i>/.test(item.emails[i].body) || /<u>/.test(item.emails[i].body)) {
        this.promptService.prompt('Quality Control', 'Email "' + item.emails[i].subject + '" from ' + itemType.substr(0, 1).toLowerCase() + itemType.substr(1) + ' "' + item.data[0].value + '" has an invalid tag.', [
          {
            text: 'Ok',
            callback: () => { }
          }
        ]);
        return false
      }

      // Check for invalid urls
      if (!this.linkService.validateUrl(item.emails[i].body)) {
        this.promptService.prompt('Quality Control', 'Email "' + item.emails[i].subject + '" from ' + itemType.substr(0, 1).toLowerCase() + itemType.substr(1) + ' "' + item.data[0].value + '" has an invalid URL.', [
          {
            text: 'Ok',
            callback: () => { }
          }
        ]);
        return false
      }

      // Check that subject is not called subject
      if (item.emails[i].subject.toLowerCase() === 'subject') {
        this.promptService.prompt('Quality Control', itemType + ' "' + item.data[0].value + '" cannot have an email with the subject named "subject".', [
          {
            text: 'Ok',
            callback: () => { }
          }
        ]);
        return false
      }

      // Check for duplicate subject names
      for (let j = 0; j < item.emails.length; j++) {
        if (j !== i && item.emails[i].subject === item.emails[j].subject) {
          this.promptService.prompt('Quality Control', itemType + ' "' + item.data[0].value + '" cannot have duplicate subject names.', [
            {
              text: 'Ok',
              callback: () => { }
            }
          ]);
          return false
        }
      }
    }

    return true;
  }
}

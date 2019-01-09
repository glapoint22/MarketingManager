import { Component, OnInit, ElementRef } from '@angular/core';
import { GridComponent } from '../grid/grid.component';
import { DataService } from '../data.service';
import { SaveService } from '../save.service';
import { PromptService } from '../prompt.service';

@Component({
  selector: 'lead-page-grid',
  templateUrl: '../grid/grid.component.html',
  styleUrls: ['../grid/grid.component.scss']
})
export class LeadPageGridComponent extends GridComponent implements OnInit {

  constructor(dataService: DataService, saveService: SaveService, private element: ElementRef, private promptService: PromptService) { super(dataService, saveService) }

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
          itemType: 'leadPage',
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
        return this.validateLeadPages(item);
      },
      url: 'api/Niches'
    });


    super.createTiers();
    this.element.nativeElement.firstElementChild.focus();
    this.hasFocus = true;
  }

  validateLeadPages(item): boolean {
    for (let i = 0; i < item.documents.length; i++) {
      // Check that the title is not called title
      if (item.documents[i].title.toLowerCase() === 'title') {
        this.promptService.prompt('Quality Control', '"' + item.data[0].value + '" cannot have a lead page with the title named "title".', [
          {
            text: 'Ok',
            callback: () => { }
          }
        ]);
        return false
      }

      // Check for invlaid tags
        if (/<font|<b>|<i>|<u>/.test(item.documents[i].body)) {
        this.promptService.prompt('Quality Control', 'Lead page "' + item.documents[i].title + '" from "' + item.data[0].value + '" has an invalid tag.', [
          {
            text: 'Ok',
            callback: () => { }
          }
        ]);
        return false
      }
    }
    return true;
  }
}
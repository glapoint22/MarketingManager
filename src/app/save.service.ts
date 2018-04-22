import { Injectable } from '@angular/core';
import { DataService } from "./data.service";

@Injectable()
export class SaveService {
  public newItems: Array<any> = [];
  public deletedItems: Array<any> = [];
  public updatedItems: Array<any> = [];

  constructor(private dataService: DataService) { }

  save() {
    // Posts
    if (this.newItems.length > 0) {
      let posts = this.mapItems(this.newItems);
      this.saveItem(posts[0], 'post', posts, this.newItems);
    }

    // Deletes
    if (this.deletedItems.length > 0) {
      let deletes = this.mapItems(this.deletedItems).map(x => ({
        items: x.items.map(y => y.ID),
        url: x.url
      }));
      this.saveItem(deletes[0], 'delete', deletes, this.deletedItems);
    }

    // Updates
    if (this.updatedItems.length > 0) {
      let updates = this.mapItems(this.updatedItems);
      this.saveItem(updates[0], 'put', updates, this.updatedItems);
    }
  }

  mapItems(items: Array<any>) {
    let mappedItems: Array<any> = [], urls: Array<any> = items.map(x => x.url).filter((v, i, a) => a.indexOf(v) === i);

    urls.forEach(url => {
      mappedItems.push(
        {
          url: url,
          items: items.filter(x => x.url == url).map(x => x.setItem(x.item))
        }
      );
    });

    return mappedItems;
  }

  saveItem(item, verb, items, saveArray: Array<any>) {
    this.dataService[verb](item.url, item.items)
      .subscribe((data: any) => {
        items = items.filter(x => x !== item);

        // Save the next item
        if (items.length > 0) {
          this.saveItem(items[0], verb, items, saveArray);
        } else {
          saveArray = [];
        }
      }, (error: any) => {
        // Error
        console.log(error);
      });
  }

  addSaveItem(array: Array<any>, saveItem: any, tier: any) {
    if (!this.newItems.some(x => x.item == saveItem)) {
      array.push(
        {
          item: saveItem,
          setItem: (item) => tier.setItem(item),
          url: tier.url
        });
    } else {
      this.newItems.splice(this.newItems.findIndex(x => x.item == saveItem), 1);
    }
  }
}
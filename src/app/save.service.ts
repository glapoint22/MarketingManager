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
      let posts = this.mapItems(this.newItems.sort((a, b) => a.postOrder - b.postOrder));
      this.saveItem(posts[0], 'post', posts);
    }

    // Deletes
    if (this.deletedItems.length > 0) {
      let deletes = this.mapItems(this.deletedItems).map(x => ({
        items: x.items.map(y => y.ID),
        url: x.url
      }));
      this.saveItem(deletes[0], 'delete', deletes);
    }

    // Updates
    if (this.updatedItems.length > 0) {
      let updates = this.mapItems(this.updatedItems);
      this.saveItem(updates[0], 'put', updates);
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

  saveItem(item: any, verb: string, items: Array<any>) {
    this.dataService[verb](item.url, item.items)
      .subscribe((data: any) => {
        items = items.filter(x => x !== item);

        // Save the next item
        if (items.length > 0) {
          this.saveItem(items[0], verb, items);
        } else {
          switch (verb) {
            case 'post':
              this.newItems = [];
              break;
            case 'delete':
              this.deletedItems = [];
              break;
            case 'put':
              this.updatedItems = [];
              break;
          }

          this.newItems = [];
        }
      }, (error: any) => {
        // Error
        console.log(error);
      });
  }

  addSaveItem(array: Array<any>, saveItem: any, tier: any) {
    array.push(
      {
        item: saveItem,
        setItem: (item) => tier.setItem(item),
        url: tier.url,
        postOrder: tier.postOrder,
        originalItem: JSON.parse(JSON.stringify(saveItem))
      });
  }

  isChange() {
    return this.newItems.length > 0 ||
      this.deletedItems.length > 0 ||
      this.updatedItems.length > 0;
  }

  checkForNoChanges() {
    let regEx = /(,*"isSelected":(true|false))|(,*"isInEditMode":(true|false))/g;

    if (this.updatedItems.every(x => JSON.stringify(x.originalItem).replace(regEx, '') === JSON.stringify(x.item).replace(regEx, ''))) {
      this.updatedItems = [];
    }
  }
}
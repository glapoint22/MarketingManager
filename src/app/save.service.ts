import { Injectable } from '@angular/core';
import { DataService } from "./data.service";
import { Subject } from 'rxjs';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class SaveService {
  public newItems: Array<any> = [];
  public deletedItems: Array<any> = [];
  public updatedItems: Array<any> = [];
  public isSaving: boolean;
  private savePosts = new Subject<void>();
  private saveDeletes = new Subject<void>();
  private saveUpdates = new Subject<void>();
  private saveComplete = new Subject<void>();

  constructor(private dataService: DataService) {
    // Posts
    this.savePosts.subscribe(() => {
      if (this.newItems.length > 0) {
        if (this.newItems.every(x => x.check(x.item))) {
          this.isSaving = true;
          let posts = this.mapItems(this.newItems);
          this.saveItem(posts[0], 'post', posts);
        }
      } else {
        this.saveDeletes.next();
      }
    });

    // Deletes
    this.saveDeletes.subscribe(() => {
      if (this.deletedItems.length > 0) {
        this.isSaving = true;
        let deletes = this.mapItems(this.deletedItems).map(x => ({
          items: x.items.map(y => y.ID),
          url: x.url
        }));
        this.saveItem(deletes[0], 'delete', deletes);
      } else {
        this.saveUpdates.next();
      }
    });

    // Updates
    this.saveUpdates.subscribe(() => {
      if (this.updatedItems.length > 0) {
        if (this.updatedItems.every(x => x.check(x.item))) {
          this.isSaving = true;
          let updates = this.mapItems(this.updatedItems);
          this.saveItem(updates[0], 'put', updates);
        }
      } else {
        this.saveComplete.next();
      }
    });

    // Save complete
    this.saveComplete.subscribe(() => {
      this.isSaving = false;
    });
  }

  save() {
    if (this.newItems.length > 0 ||
      this.deletedItems.length > 0 ||
      this.updatedItems.length > 0) {
      this.savePosts.next();
    }
  }

  mapItems(items: Array<any>) {
    let mappedItems: Array<any> = [],
      urls: Array<any> = items.map(x => x.url).filter((v, i, a) => a.indexOf(v) === i);

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
              this.saveDeletes.next();
              break;
            case 'delete':
              this.deletedItems = [];
              this.saveUpdates.next();
              break;
            case 'put':
              this.updatedItems = [];
              this.saveComplete.next();
              break;
          }
        }
      });
  }

  addSaveItem(array: Array<any>, saveItem: any, tier: any) {
    array.push(
      {
        item: saveItem,
        setItem: (item) => tier.setItem(item),
        check: (item) => tier.check ? tier.check(item) : true,
        url: tier.url,
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
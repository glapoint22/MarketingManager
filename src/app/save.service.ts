import { Injectable } from '@angular/core';
import { Save } from './save';
import { DataService } from "./data.service";
import { Category } from "./category";

@Injectable()
export class SaveService {
  public saveObject = new Save();

  constructor(private dataService: DataService) { }

  save() {
    this.saveObject.newCategories.forEach(x => {
      let category: Category = {
        ID: x.id,
        Name: x.data[0].value,
        Icon: x.icon,
        Featured: x.featured,
        CategoryImages: x.categoryImages.map(y => ({
          CategoryID: x.id,
          Name: y.name,
          Selected: y.isSelected
        }))
      }


      this.dataService.post('api/Categories', category)
        .subscribe((data: any) => {

        }, error => {
          // Error
        });
    })
  }

}

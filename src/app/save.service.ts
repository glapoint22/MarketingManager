import { Injectable } from '@angular/core';
import { Save } from './save';
import { DataService } from "./data.service";
import { Category } from "./category";

@Injectable()
export class SaveService {
  public saveObject = new Save();
  private posts: Array<any> = [];

  constructor(private dataService: DataService) { }

  save() {
    this.setPosts();
    // this.deleteCategories();
  }

  setPosts() {
    let urls: Array<any> = this.saveObject.posts.map(x => x.url).filter((v, i, a) => a.indexOf(v) === i);

    if (urls.length > 0) {
      urls.forEach(url => {
        this.posts.push(
          {
            url: url,
            items: this.saveObject.posts.filter(x => x.url == url).map(x => x.setItem(x.item))
          }
        );
      });

      this.savePost(this.posts[0]);
    }
  }

  savePost(post: any) {
    this.dataService.post(post.url, post.items)
      .subscribe((data: any) => {
        this.saveObject.posts = this.saveObject.posts.filter(x => x.url !== post.url);
        this.posts = this.posts.filter(x => x !== post);

        if (this.posts.length > 0) this.savePost(this.posts[0]);

      }, error => {
        // Error
        error;
      });
  }

  // deleteCategories() {
  //   if (this.saveObject.deletedCategories.length > 0) {
  //     this.dataService.delete('api/Categories', this.saveObject.deletedCategories.map(x => x.id))
  //       .subscribe((data: any) => {
  //         this.saveObject.deletedCategories = [];
  //       }, error => {
  //         // Error
  //       });
  //   }
  // }
}

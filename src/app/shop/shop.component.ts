import { Component, OnInit } from '@angular/core';
// import { DataService } from "../data.service";
// import { Http, RequestOptions, Headers, Response } from '@angular/http';
// import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss', '../shop-grid/shop-grid.component.scss', '../featured-grid/featured-grid.component.scss']
})
export class ShopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // fileChange(event) {
  //   if (event.target.files.length > 0) {
  //     let file: File = event.target.files[0];
  //     let formData: FormData = new FormData();
  //     formData.append('image', file, file.name);

  //     this.dataService.post('/api/Image', formData)
  //       .subscribe((data: any) => {
  //         data;
  //       }, error => {
  //         // Error
  //       });

        
  //   }








  // }
}

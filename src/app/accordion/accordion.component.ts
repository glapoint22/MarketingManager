import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";

@Component({
  selector: 'accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss']
})
export class AccordionComponent implements OnInit {
  public items: Array<any>;
  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.get('api/Categories')
        .subscribe((response: any) => {
          this.items = response;
        }, error => {
          
        });





    
  }

}

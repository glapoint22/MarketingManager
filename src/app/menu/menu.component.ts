import { Component, OnInit } from '@angular/core';
import { EditBoxManagerService } from '../edit-box-manager.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public editBoxManagerService: EditBoxManagerService) { }

  ngOnInit() {
  }

}

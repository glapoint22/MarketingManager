import { Component, OnInit } from '@angular/core';
import { EditBoxManagerService } from '../edit-box-manager.service';
import { EditBoxService } from '../edit-box.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  constructor(public editBoxManagerService: EditBoxManagerService, public editBoxService: EditBoxService) { }

  ngOnInit() {
  }

}

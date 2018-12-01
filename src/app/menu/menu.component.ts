import { Component } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  constructor(public menuService: MenuService) { }
}
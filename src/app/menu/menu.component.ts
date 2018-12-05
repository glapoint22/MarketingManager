import { Component, ViewChild, ElementRef } from '@angular/core';
import { MenuService } from '../menu.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  @ViewChild('menu') menu: ElementRef;

  constructor(public menuService: MenuService) { }

  ngAfterViewInit(){
    this.menu.nativeElement.focus();
  }
}
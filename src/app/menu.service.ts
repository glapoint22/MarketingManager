import { Injectable } from '@angular/core';
import { Vector2 } from './vector2';
import { ContextMenu } from './context-menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public menu: ContextMenu;
  public show: boolean;
  public menuPos: Vector2

  constructor() { }

  showMenu(event: MouseEvent, menu: ContextMenu) {
    event.preventDefault();
    this.menuPos = new Vector2(event.clientX, event.clientY)
    this.menu = menu;
    this.show = true;
  }
}

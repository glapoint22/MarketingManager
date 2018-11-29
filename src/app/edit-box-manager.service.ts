import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Rect } from './rect';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { Container } from './container';

@Injectable({
  providedIn: 'root'
})
export class EditBoxManagerService {
  public currentEditBox: EditBoxComponent;
  public currentContainer: Container;
  public mainContainer: Container;
  public change = new Subject<void>();
  public insertType: string = null;
  public showMenu: boolean;
  public menuLeft: number;
  public menuTop: number;

  setMenu(event) {
    event.preventDefault();
    this.menuLeft = event.clientX;
    this.menuTop = event.clientY;
    this.showMenu = true;
  }
}
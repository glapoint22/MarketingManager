import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { EditBoxComponent } from './edit-box/edit-box.component';
import { Container } from './container';
import { ContextMenu } from './context-menu';

@Injectable({
  providedIn: 'root'
})
export class EditBoxManagerService {
  public currentEditBox: EditBoxComponent;
  public currentContainer: Container;
  public mainContainer: Container;
  public change = new Subject<void>();
  public insertType: string = null;
  public boxMenu: ContextMenu = new ContextMenu();
}
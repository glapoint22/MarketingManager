import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  public onSelection = new Subject<any>();
  public onSetEditMode = new Subject<any>();
  public onUnSelect = new Subject<any>();

  setSelection(){
    this.onSelection.next();
  }

  setEditMode(){
    this.onSetEditMode.next();
  }

  unSelect(){
    this.onUnSelect.next();
  }
}

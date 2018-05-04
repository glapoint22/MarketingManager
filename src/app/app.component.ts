import { Component } from '@angular/core';
import { SaveService } from "./save.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public activeScreen: string;

  constructor(public saveService: SaveService) { }
}
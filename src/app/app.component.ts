import { Component, OnInit } from '@angular/core';
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";
import { LinkService } from './link.service';
import { DocumentPreviewService } from './document-preview.service';
import { MenuService } from './menu.service';
import { ColorService } from './color.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public activeScreen: string;

  constructor(public saveService: SaveService, public promptService: PromptService, public linkService: LinkService, public documentPreviewService: DocumentPreviewService, public menuService: MenuService, public colorService: ColorService, private dataService: DataService) { }

  ngOnInit() {
    // Get the access token from local storage
    this.dataService.setAccessToken(localStorage.getItem('token'));

    // If there is an access token, set the http headers
    if (this.dataService.accessToken) this.dataService.setHeaders(this.dataService.accessToken.token);
  }

  ngAfterContentChecked() {
    if (this.promptService.show) this.saveService.isSaving = false;
  }
}
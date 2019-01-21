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
  public isAuthorized: boolean;

  constructor(public saveService: SaveService, public promptService: PromptService, public linkService: LinkService, public documentPreviewService: DocumentPreviewService, public menuService: MenuService, public colorService: ColorService, private dataService: DataService) { }

  ngOnInit() {
    let token = sessionStorage.getItem('token');

    if (!token) {
      this.dataService.post('api/Token', 'username=Gabe&password=Cyb668622&grant_type=password')
        .subscribe((response: any) => {
          sessionStorage.setItem('token', response.access_token);
          this.isAuthorized = true;
        });

      return;
    }

    this.isAuthorized = true;
  }

  ngAfterContentChecked() {
    if (this.promptService.show) this.saveService.isSaving = false;
  }
}
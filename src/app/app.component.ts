import { Component } from '@angular/core';
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";
import { LinkService } from './link.service';
import { EmailPreviewService } from './email-preview.service';
import { MenuService } from './menu.service';
import { ColorService } from './color.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public activeScreen: string;

  constructor(public saveService: SaveService, public promptService: PromptService, public linkService: LinkService, public emailPreviewService: EmailPreviewService, public menuService: MenuService, public colorService: ColorService) { }

  ngAfterContentChecked() {
    if (this.promptService.show) this.saveService.isSaving = false;
  }
}
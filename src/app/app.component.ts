import { Component, OnInit } from '@angular/core';
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";
import { LinkService } from './link.service';
import { DocumentPreviewService } from './document-preview.service';
import { MenuService } from './menu.service';
import { ColorService } from './color.service';
import { TokenService } from './token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public activeScreen: string;

  constructor(public saveService: SaveService,
    public promptService: PromptService,
    public linkService: LinkService,
    public documentPreviewService: DocumentPreviewService,
    public menuService: MenuService,
    public colorService: ColorService,
    private tokenService: TokenService) { }

  ngOnInit() {
    // Get the access token from local storage
    this.tokenService.refreshToken = this.tokenService.getToken(localStorage.getItem('refreshToken'));

    if (!this.tokenService.refreshToken || this.tokenService.hasTokenExpired(this.tokenService.refreshToken.expires, 0)) {
      // Log in
    }
  }

  ngAfterContentChecked() {
    if (this.promptService.show) this.saveService.isSaving = false;
  }
}
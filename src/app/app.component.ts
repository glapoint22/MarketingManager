import { Component, OnInit } from '@angular/core';
import { SaveService } from "./save.service";
import { PromptService } from "./prompt.service";
import { LinkService } from './link.service';
import { DocumentPreviewService } from './document-preview.service';
import { MenuService } from './menu.service';
import { ColorService } from './color.service';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public static activeScreen: string;
  public hasServerTime: boolean;
  public app = AppComponent;

  constructor(public saveService: SaveService,
    public promptService: PromptService,
    public linkService: LinkService,
    public documentPreviewService: DocumentPreviewService,
    public menuService: MenuService,
    public colorService: ColorService,
    public loginService: LoginService,
    private tokenService: TokenService,
    private dataService: DataService) { }

  ngOnInit() {
    this.dataService.get('api/Time')
      .subscribe((serverTime: any) => {
        this.hasServerTime = true;

        // Get the access token from local storage
        this.tokenService.refreshToken = this.tokenService.getToken(localStorage.getItem('refreshToken'));

        if (!this.tokenService.refreshToken || this.tokenService.hasRefreshTokenExpired(serverTime.utc)) {
          // Log in
          this.loginService.showLogin = true;
        }
      });



  }

  ngAfterContentChecked() {
    if (this.promptService.show) this.saveService.isSaving = false;
  }
}
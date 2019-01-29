import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { TokenService } from '../token.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private dataService: DataService, private tokenService: TokenService, private loginService: LoginService) { }

  onLogin(userName: string, password: string) {
    this.loginService.showLogin = false;
    this.loginService.isLoggingIn = true;
    this.dataService.post('api/Token', 'username=' +
      userName + '&password=' +
      password + '&grant_type=password&client_id=' +
      this.tokenService.clientId + '&client_secret=' +
      this.tokenService.clientSecret, () => { this.loginService.showLogin = true })
      .subscribe((response: any) => {
        this.tokenService.setToken(response);
        this.loginService.isLoggingIn = false;
        this.loginService.invalidLogin = false;
      }, (error: any) => {
        this.loginService.isLoggingIn = false;
        this.loginService.invalidLogin = true;
      });
  }

}

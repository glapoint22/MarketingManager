import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public accessToken: any;
  public refreshToken: any;
  public clientId: string = 'Manager';
  public clientSecret: string = '3eware0blivion1s@Hand!';
  private waitForToken = new Subject<void>();
  private isGettingToken: boolean;

  constructor(private dataService: DataService) { }

  hasAccessTokenExpired(): boolean {
    // Check to see if the current token has expired
    return (this.accessToken.expires - new Date().getTime()) < 60000;
  }

  hasRefreshTokenExpired(): boolean {
    // Check to see if the current token has expired
    return (this.refreshToken.expires - new Date().setHours(new Date().getHours() + 5)) < 0;
  }


  getToken(tokenString: string) {
    if (!tokenString) return null;

    let tokenExpiresIndex = tokenString.indexOf('~');

    return {
      id: tokenString.substr(0, tokenExpiresIndex),
      expires: new Date(tokenString.substr(tokenExpiresIndex + 1)).getTime()
    }
  }

  setToken(response: any) {
    let refreshTokenString = response.refresh_token + '~' + response.refreshTokenExpires;

    localStorage.setItem('refreshToken', refreshTokenString);
    this.accessToken = this.getToken(response.access_token + '~' + response[".expires"]);
    this.refreshToken = this.getToken(refreshTokenString);
    this.dataService.setHeaders(this.accessToken.id);
  }

  validateToken(): Observable<any> {
    // If the token has expired, get a token from the server
    if (!this.accessToken || this.hasAccessTokenExpired()) {
      if (!this.isGettingToken) {
        this.isGettingToken = true;
        this.dataService.headers = null;

        // Get a new token
        this.dataService.post('api/Token', 'grant_type=refresh_token&refresh_token=' +
          this.refreshToken.id + '&client_id=' +
          this.clientId + '&client_secret=' +
          this.clientSecret)
          .subscribe((response: any) => {
            this.isGettingToken = false;
            this.setToken(response);
            this.waitForToken.next();
          });
      }
    } else {
      window.setTimeout(() => {
        this.waitForToken.next();
      }, 1);

    }
    return this.waitForToken;
  }
}
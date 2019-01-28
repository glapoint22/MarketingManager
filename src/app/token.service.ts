import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public accessToken: any;
  public refreshToken: any;
  private waitForToken = new Subject<void>();
  private isGettingToken: boolean;
  private clientId = 'Manager';
  private clientSecret = '3eware0blivion1s@Hand!';

  constructor(private dataService: DataService) { }

  hasTokenExpired(expiration: number, milliseconds: number): boolean {
    // Check to see if the current token has expired
    return (expiration - new Date().getTime()) < milliseconds;
  }


  getToken(tokenString: string) {
    if (!tokenString) return null;

    let tokenExpiresIndex = tokenString.indexOf('~');

    return {
      id: tokenString.substr(0, tokenExpiresIndex),
      expires: new Date(tokenString.substr(tokenExpiresIndex + 1)).getTime()
    }
  }

  validateToken(): Observable<any> {
    // If the token has expired, get a token from the server
    if (!this.accessToken || this.hasTokenExpired(this.accessToken.expires, 60000)) {
      if (!this.isGettingToken) {
        this.isGettingToken = true;
        this.dataService.headers = null;
        // this.dataService.post('api/Token', 'username=Gabe&password=Cyb668622&grant_type=password&client_id=Manager&client_secret=3eware0blivion1s@Hand!')
        this.dataService.post('api/Token', 'grant_type=refresh_token&refresh_token=' + this.refreshToken.id + '&client_id=' + this.clientId + '&client_secret=' + this.clientSecret)
          .subscribe((response: any) => {
            let refreshTokenString = response.refresh_token + '~' + response.refreshTokenExpires;

            this.isGettingToken = false;

            localStorage.setItem('refreshToken', refreshTokenString);
            this.accessToken = this.getToken(response.access_token + '~' + response[".expires"]);
            this.refreshToken = this.getToken(refreshTokenString);


            this.dataService.setHeaders(this.accessToken.id);
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

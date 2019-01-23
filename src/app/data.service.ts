import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PromptService } from "./prompt.service";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DataService {
  public accessToken: any;
  private waitForToken = new Subject<void>();
  private isGettingToken: boolean;
  private headers: HttpHeaders;

  constructor(private http: HttpClient, private promptService: PromptService) { }

  get(url: string): Observable<any> {
    //Get the data
    return this.http.get(url, { headers: this.headers })
      .pipe(catchError(this.handleError()));
  }

  post(url: string, body: any) {
    return this.http.post(url, body, { headers: this.headers })
      .pipe(catchError(this.handleError()));
  }

  put(url: string, body: any) {
    return this.http.put(url, body, { headers: this.headers })
      .pipe(catchError(this.handleError()));
  }

  delete(url: string, body: any) {
    let params = new HttpParams();

    params = params.set('itemIds', body);
    return this.http.delete(url, { params: params, headers: this.headers })
      .pipe(catchError(this.handleError()));
  }

  handleError() {
    // Show a prompt of the error
    return (error) => {
      this.promptService.prompt('Error', error.message, [
        {
          text: 'Ok',
          callback: () => { }
        }
      ])
      return of();
    }
  }

  hasTokenExpired(): boolean {
    // Check to see if the current token has expired
    return (this.accessToken.expires - new Date().getTime()) < 0;
  }

  setHeaders(token: string) {
    // Set the http headers to include the current token
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }

  setAccessToken(tokenString: string) {
    // Create a access token object from the passed in string
    if (tokenString !== null) {
      let index = tokenString.indexOf(':');

      this.accessToken = {
        expires: parseInt(tokenString.substring(0, index)),
        token: tokenString.substr(index + 1)
      }
    }

  }

  validateToken(): Observable<any> {
    // If there is not an access token or the token has expired, get a token from the server
    if (!this.accessToken || this.hasTokenExpired()) {
      if (!this.isGettingToken) {
        this.isGettingToken = true;

        this.post('api/Token', 'username=Gabe&password=Cyb668622&grant_type=password')
          .subscribe((response: any) => {
            let tokenString = new Date(response[".expires"]).getTime() + ':' + response.access_token;
            localStorage.setItem('token', tokenString);

            this.setAccessToken(tokenString);

            this.isGettingToken = false;
            this.setHeaders(this.accessToken.token);
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
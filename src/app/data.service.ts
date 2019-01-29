import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PromptService } from "./prompt.service";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DataService {
  public headers: HttpHeaders;

  constructor(private http: HttpClient, private promptService: PromptService) { }

  get(url: string): Observable<any> {
    //Get the data
    return this.http.get(url, { headers: this.headers })
      .pipe(catchError(this.handleError()));
  }

  post(url: string, body: any, callback?: Function) {
    return this.http.post(url, body, { headers: this.headers })
      .pipe(catchError(this.handleError(callback)));
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

  handleError(callback?: Function) {
    // Show a prompt of the error
    return (error: any) => {
      this.promptService.prompt('Error', error.message, [
        {
          text: 'Ok',
          callback: () => { if (callback) callback() }
        }
      ])
      return throwError(error);
    }
  }

  setHeaders(token: string) {
    // Set the http headers to include the current token
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  }
}
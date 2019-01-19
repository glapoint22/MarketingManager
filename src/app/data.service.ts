import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PromptService } from "./prompt.service";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DataService {

  constructor(private http: HttpClient, private promptService: PromptService) { }

  get(url: string): Observable<any> {
    //Get the data
    return this.http.get(url)
      .pipe(catchError(this.handleError()));
  }

  post(url: string, body: any) {
    return this.http.post(url, body)
      .pipe(catchError(this.handleError()));
  }

  put(url: string, body: any) {
    return this.http.put(url, body)
      .pipe(catchError(this.handleError()));
  }

  delete(url: string, body: any) {
    let params = new HttpParams();

    params = params.set('itemIds', body);
    return this.http.delete(url, { params: params })
      .pipe(catchError(this.handleError()));
  }

  handleError() {
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
}
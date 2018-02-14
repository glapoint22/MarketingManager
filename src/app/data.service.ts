import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  // public data: any = {};
  // public searchBar: any = {};

  // //isLoading
  // private _isLoading: boolean = false;
  // set isLoading(bool: boolean) {
  //   this._isLoading = bool;
  //   document.body.style.overflow = bool ? 'hidden' : 'visible';
  // }
  // get isLoading(): boolean { return this._isLoading; }


  // //error
  // private _error: any;
  // set error(error: any) {
  //   this._error = error;
  //   document.body.style.overflow = error != null ? 'hidden' : 'visible';
  // }
  // get error(): any { return this._error; }
  



  constructor(private http: Http) { }

  get(url: string, parameters?: Array<any>): Observable<Response> {
    if (parameters) {
      let params: URLSearchParams = new URLSearchParams(),
        requestOptions: RequestOptions = new RequestOptions();

      //Loop through the parameters
      for (let i = 0; i < parameters.length; i++) {
        params.set(parameters[i].key, parameters[i].value);
      }

      //Assign the params to the request options
      requestOptions.params = params;

      //Get the data
      return this.http.get(url, requestOptions)
        .map((response: Response) => response.json())
    } else {
      return this.http.get(url)
        .map((response: Response) => response.json())
    }
  }


  post(url: string, body: any): Observable<Response> {
    return this.http.post(url, body)
      .map((response: Response) => response.json())
  }

  put(url: string, body: any): Observable<Response> {
    return this.http.put(url, body)
      .map((response: Response) => response.json())
  }
}
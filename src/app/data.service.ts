import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(private http: Http) { }

  get(url: string, parameters?: Array<any>): Observable<Response> {
    let params: URLSearchParams, requestOptions: RequestOptions;

    if (parameters && parameters.length > 0) {
      params = new URLSearchParams();
      requestOptions = new RequestOptions();

      //Set the params
      parameters.forEach(x => params.set(x.key, x.value));

      //Assign the params to the request options
      requestOptions.params = params;
    }

    //Get the data
    return this.http.get(url, requestOptions)
      .map((response: Response) => response.json());
  }


  post(url: string, body: any): Observable<Response> {
    return this.http.post(url, body)
      .map((response: any) => {
        if (response._body !== "") {
          return response.json();
        }
      });
  }

  put(url: string, body: any): Observable<Response> {
    return this.http.put(url, body);
  }

  delete(url: string, body: any): Observable<Response> {
    let requestOptions: RequestOptions = new RequestOptions({
      body: body
    });

    return this.http.delete(url, requestOptions);
  }
}
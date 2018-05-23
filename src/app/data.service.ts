import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  constructor(private http: HttpClient) { }

  get(url: string, parameters?: Array<any>): Observable<any> {
    let params = new HttpParams();

    //Set the params
    parameters.forEach(x => params = params.set(x.key, x.value));

    //Get the data
    return this.http.get(url, { params: params });
  }


  post(url: string, body: any) {
    return this.http.post(url, body);
  }

  put(url: string, body: any) {
    return this.http.put(url, body);
  }

  delete(url: string, body: any) {
    let params = new HttpParams();

    params = params.set('itemIds', body);
    return this.http.delete(url, { params: params });
  }
}
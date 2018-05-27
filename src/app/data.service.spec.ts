// import { TestBed, inject } from '@angular/core/testing';
// import { DataService } from './data.service';
// import {
//   HttpModule,
//   Http,
//   Response,
//   ResponseOptions,
//   XHRBackend,
//   RequestOptions,
//   URLSearchParams
// } from '@angular/http';
// import { MockBackend } from '@angular/http/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';



xdescribe('DataService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockResponse = [
    { id: 0, name: 'Arts & Entertainment' },
    { id: 1, name: 'As Seen on TV' },
    { id: 2, name: 'Betting Systems' },
    { id: 3, name: 'Business / Investing' },
  ];

  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   imports: [HttpModule],
    //   providers: [
    //     DataService,
    //     { provide: XHRBackend, useClass: MockBackend }
    //   ]
    // });
    // http = TestBed.get(Http);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });

    // Inject the http service and test controller for each test
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should return data when the get method is called', () => {
    // mockBackend.connections.subscribe((connection) => {
    //   connection.mockRespond(new Response(new ResponseOptions({
    //     body: JSON.stringify(mockResponse)
    //   })));
    // });

    httpClient.get('/data').subscribe((data: any) => {
      expect(data.length).toEqual(4);
      expect(data[0].name).toEqual('Arts & Entertainment');
      expect(data[1].name).toEqual('As Seen on TV');
      expect(data[2].name).toEqual('Betting Systems');
      expect(data[3].name).toEqual('Business / Investing');
    });
  });

  // it('should return data when the get method is called with parameters', inject([DataService, XHRBackend], (dataService: DataService, mockBackend: MockBackend) => {
  //   let requestOptions = new RequestOptions();
  //   let params = new URLSearchParams();

  //   params.set('id', '0');
  //   requestOptions.params = params;
  //   spyOn(httpClient, 'get').and.callThrough();

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(new ResponseOptions({
  //       body: JSON.stringify(mockResponse)
  //     })));
  //   });

  //   dataService.get('http://example.com', [{ key: 'id', value: '0' }]).subscribe((data: any) => {
  //     expect(data.length).toEqual(4);
  //     expect(data[0].name).toEqual('Arts & Entertainment');
  //     expect(data[1].name).toEqual('As Seen on TV');
  //     expect(data[2].name).toEqual('Betting Systems');
  //     expect(data[3].name).toEqual('Business / Investing');
  //     expect(httpClient.get).toHaveBeenCalledWith('http://example.com', requestOptions);
  //   });
  // }));

  // it('should return data when the post method is called', inject([DataService, XHRBackend], (dataService: DataService, mockBackend: MockBackend) => {
  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(new ResponseOptions({
  //       body: JSON.stringify(mockResponse)
  //     })));
  //   });

  //   dataService.post('http://example.com', 'foo').subscribe((data: any) => {
  //     expect(data.length).toEqual(4);
  //     expect(data[0].name).toEqual('Arts & Entertainment');
  //     expect(data[1].name).toEqual('As Seen on TV');
  //     expect(data[2].name).toEqual('Betting Systems');
  //     expect(data[3].name).toEqual('Business / Investing');
  //   });
  // }));

  // it('should NOT return data when the post method is called', inject([DataService, XHRBackend], (dataService: DataService, mockBackend: MockBackend) => {
  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond(new Response(new ResponseOptions({
  //       body: ''
  //     })));
  //   });

  //   dataService.post('http://example.com', 'foo').subscribe((data: any) => {
  //     expect(data).toBeUndefined();
  //   });
  // }));

  // it('should call http.put when put is called', inject([DataService, XHRBackend], (dataService: DataService, mockBackend: MockBackend) => {
  //   spyOn(httpClient, 'put').and.callThrough();

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond();
  //   });

  //   dataService.put('http://example.com', 'foo').subscribe((data: any) => {
  //     expect(httpClient.put).toHaveBeenCalled();
  //   });
  // }));

  // it('should call http.delete when delete is called', inject([DataService, XHRBackend], (dataService: DataService, mockBackend: MockBackend) => {
  //   let requestOptions = new RequestOptions();
  //   requestOptions.body = '0';

  //   spyOn(httpClient, 'delete').and.callThrough();

  //   mockBackend.connections.subscribe((connection) => {
  //     connection.mockRespond();
  //   });

  //   dataService.delete('http://example.com', '0').subscribe((data: any) => {
  //     expect(httpClient.delete).toHaveBeenCalledWith('http://example.com', requestOptions);
  //   });
  // }));
});

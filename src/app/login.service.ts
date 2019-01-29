import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public showLogin: boolean;
  public isLoggingIn: boolean;
  public invalidLogin: boolean;

  constructor() { }
}

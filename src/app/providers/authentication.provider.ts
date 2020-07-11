import { Injectable } from '@angular/core';
import {
  AuthService,
  GoogleLoginProvider,
  SocialUser
} from 'angular-6-social-login';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class Authentication {
  private credentials: SocialUser;
  private authService: AuthService;
  private validAccounts = [
    'sagargudka@gmail.com',
    'mit721996@gmail.com',
    'pnf7772@gmail.com',
    'pb7772@gmail.com',
    'devals287@gmail.com'
  ];

  public isAuthenticated: BehaviorSubject<Boolean>;

  public getName(): String {
    return this.credentials ? this.credentials.name : 'Guest';
  }

  public getImage(): String {
    return this.credentials
      ? this.credentials.image
      : 'https://static.thenounproject.com/png/630728-200.png';
  }

  public constructor(authService: AuthService) {
    this.authService = authService;

    if (sessionStorage.getItem('loginData')) {
      let data = JSON.parse(sessionStorage.getItem('loginData'));
      this.credentials = new SocialUser();
      this.credentials.email = data.email;
      this.credentials.id = data.id;
      this.credentials.name = data.name;
      this.credentials.image = data.image;
      this.credentials.token = data.token;
      this.isAuthenticated = new BehaviorSubject(true);
      // this.isAuthenticated.next(true);
    } else {
      this.credentials = null;
      this.isAuthenticated = new BehaviorSubject(false);
    }
  }

  public async authenticate() {
    let userData = await this.authService.signIn(
      GoogleLoginProvider.PROVIDER_ID
    );

    this.credentials = this.validAccounts.includes(userData.email)
      ? userData
      : null;
    if (this.credentials) {
      sessionStorage.setItem('loginData', JSON.stringify(this.credentials));
      this.isAuthenticated.next(true);
    } else {
      sessionStorage.removeItem('loginData');
      this.isAuthenticated.next(false);
    }
  }

  public logout() {
    sessionStorage.removeItem('loginData');
    this.credentials = null;
    this.isAuthenticated.next(false);
  }
}

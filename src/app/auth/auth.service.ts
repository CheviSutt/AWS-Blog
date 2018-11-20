import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({providedIn: 'root'})
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private authStatusListener = new Subject<boolean>(); // user status for ui
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  fetchToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
   return this.userId;
  }

  getAuthStatusListener() { // user status for ui
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }; // response object is <{token: }> from
    this.http.post(BACKEND_URL + '/signUp', authData).subscribe(
      () => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  loginConfirm(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string, expiresIn: number, userId: string }>(
        BACKEND_URL + '/login', authData)
      .subscribe(response => {
        // console.log(response);
        const token = response.token; // getting the token from the response
        this.token = token; // token stored in service here
        if (token) {
          const expiresInTimer = response.expiresIn;
          // console.log(expiresInTimer);
          this.setAuthTimer(expiresInTimer);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true); // user status for ui
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInTimer * 1000);
          // console.log(expirationDate);
          this.saveAuthToken(token, expirationDate, this.userId);
          this.router.navigate(['/']); // navigate to home if authenticated
        }
      }, error => {
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logoutConfirm() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); // user status for ui
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']); // navigate to home if logged out
  }

  private setAuthTimer(duration: number) {
    console.log('Setting a timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutConfirm(); // calls logout method below
    }, duration * 1000); // node.js timer "setTimeout()" operates in milliseconds
  }

  private saveAuthToken(token: string, expirationDate: Date, userId: string) { // data
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }
}

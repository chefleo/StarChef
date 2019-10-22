import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IUser } from './user';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = 'http://localhost:8080';
  // private headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');

  constructor(private http: HttpClient) { }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url + '/api/register', user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    });
  }

  loginUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url + '/api/login', user, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    });
  }

  login(authCredentials) {
    return this.http.post(this.url + '/api/login', authCredentials);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    let token = localStorage.getItem('token');
    if (token) {
      console.log('1')
      let userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    let userPayload = this.getUserPayload();
    if (userPayload) {
      console.log('2');
      return userPayload.exp > Date.now() / 1000;
    } else {
      console.log('3');
      return false;
    }
    }
}

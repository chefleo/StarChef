import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { IUser } from './user';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { tap, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url: string = 'http://localhost:8080';

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True'}) };

  constructor(private http: HttpClient) { }

  createUser(user: IUser) {
    return this.http.post(this.url + '/api/register', user, this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(this.url + '/api/login', authCredentials, this.noAuthHeader);
  }

  getUser() {
    return this.http.get(this.url + '/api/user-edit');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    let token = this.getToken();
    if (token) {
      console.log('1');
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

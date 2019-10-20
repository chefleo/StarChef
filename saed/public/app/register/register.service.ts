import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../user';
import { Observable, throwError } from 'rxjs';
import { from } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url: string = 'http://localhost:8080';
  // private headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  /*createUser(user: IUser): Observable<IUser> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.post<IUser>(this.url + '/api/register', user, { headers })
                        .pipe(
                          tap(data => console.log('createUser: ' + JSON.stringify(data))),
                          catchError( err => this.handleError(err))
                          );
                          // .catch(this.errorHandler || "Server error");
  }*/

  createUser(user: IUser) {
    return this.http.post<IUser>(this.url + '/api/register', user);
  }

  private handleError(err) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

  /* errorHandler(error: HttpErrorResponse) {
    // tslint:disable-next-line: deprecation
    return Observable.throw(error.message);
  } */


}

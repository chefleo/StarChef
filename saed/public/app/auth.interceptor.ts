import { HttpInterceptor, HttpRequest, HttpHandler, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private userService: UserService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.headers.get('noauth')) {
      return next.handle(req.clone());
    } else {
      const clonedreq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + this.userService.getToken())
      });
      return next.handle(clonedreq).pipe(
        tap(
          event => { },
          err => {
            console.log('errore');
            this.router.navigateByUrl('/login');
            /*if (err.error.auth === false) {
              this.router.navigateByUrl('/login');
             }*/
          }
        )
      );
    }

  }

}

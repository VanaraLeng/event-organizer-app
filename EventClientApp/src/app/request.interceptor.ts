import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../environments/environment'
import { UserService } from './user.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  userService = inject(UserService);

  constructor() { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.userService.isLoggedIn() && request.url.includes(environment.SERVER_BASE_URL)) {
      const token = this.userService.state$.value.token;
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          let newError!: Error
          switch (error.status) {
            case 0:
              newError = new Error("No internet connection. Please connect internet and try again.");
              break;

            case 500:
              newError = new Error("There is technical problem. Please try again later");
              break;

            case 400:
              newError = new Error("Your request is incorrect.")
              break;

            case 401:
            case 403:
              newError = new Error("You don't have access to this URL.")
              break;

            case 404:
              newError = new Error("URL not found.")
              break;

            default:
              newError = new Error("Unknow error. Please try again later.");
          }
          return throwError(() => newError)
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}

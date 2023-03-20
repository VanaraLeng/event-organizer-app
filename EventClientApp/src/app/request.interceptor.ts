import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
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
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
    return next.handle(request);
  }
}

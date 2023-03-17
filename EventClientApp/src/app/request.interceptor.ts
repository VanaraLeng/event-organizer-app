import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  userService = inject(UserService);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // TODO: - Update session logic here
    const token = ''; 
    const authReq = request.clone(
      { headers: request.headers.set('Authorization ', `Bearer ${token}`) });

      return next.handle(authReq);
  }
}

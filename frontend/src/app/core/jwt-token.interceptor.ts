import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  constructor(private readonly localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.localStorageService.getToken();
    if (token) {
      const header = 'Bearer ' + token;

      let headers = request.headers.set('Authorization', header);
      request = request.clone({ headers });
    }

    return next.handle(request);
  }
}

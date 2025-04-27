// src/app/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthserviceService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class ErrorInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private authService: AuthserviceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          return this.authService.refreshAccessToken().pipe(
            switchMap(() => {
              this.isRefreshing = false;
              const newToken = this.authService.accessToken$;
              const clonedRequest = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next.handle(clonedRequest);
            }),
            catchError(err => {
              this.isRefreshing = false;
              this.authService.clearAuthData();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}

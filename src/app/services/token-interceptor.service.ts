import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthserviceService } from './auth.service';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<string | null>(null);

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const auth = inject(AuthserviceService);
  const token = auth.getAccessToken();

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401 && !isRefreshing) {
        isRefreshing = true;
        refreshSubject.next(null);

        return auth.refreshAccessToken().pipe(
          tap((newToken) => {
            isRefreshing = false;
            refreshSubject.next(newToken);
          }),
          switchMap((newToken) =>
            next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              })
            )
          ),
          catchError((error) => {
            auth.clearTokens();
            isRefreshing = false;
            return throwError(() => error);
          })
        );
      }

      return throwError(() => err);
    })
  );
};

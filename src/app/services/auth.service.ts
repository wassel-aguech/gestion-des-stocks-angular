

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthenticationResponse } from '../models/authentication-response';
import { User } from '../models/user';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

interface RefreshResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  accessToken$ = this.accessTokenSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredAuthData();
  }

  private loadStoredAuthData(): void {
    const storedUser = localStorage.getItem('currentUser');
    const storedAccessToken = localStorage.getItem('access_token'); // ✅ Correction
    const storedRefreshToken = localStorage.getItem('refresh_token'); // ✅ Correction

    if (storedUser) this.currentUserSubject.next(JSON.parse(storedUser));
    if (storedAccessToken) this.accessTokenSubject.next(storedAccessToken);
    if (storedRefreshToken) this.refreshTokenSubject.next(storedRefreshToken);
  }

  login(email: string, password: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          console.log('Login response:', response);

          this.currentUserSubject.next(response.user);
          this.accessTokenSubject.next(response.access_token);
          this.refreshTokenSubject.next(response.refresh_token);

          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('access_token', response.access_token); // ✅ Correction
          localStorage.setItem('refresh_token', response.refresh_token); // ✅ Correction

          if (response.user?.role) {
            localStorage.setItem('userRole', response.user.role);
          }
        }),
        catchError(error => {
          console.error('Login failed', error);
          return throwError(() => 'Login failed. Please check your credentials and try again.');
        })
      );
  }

  logout(): Observable<any> {
    const accessToken = this.accessTokenSubject.getValue();
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    this.clearAuthData();

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers });
  }


  // refreshAccessToken(): Observable<any> {
  //   return this.http.post<any>('http://localhost:5000/api/auth/refresh', {}).pipe(
  //     tap(response => {
  //       const newAccessToken = response.access_token;
  //       localStorage.setItem('access_token', newAccessToken);
  //       this.accessTokenSubject.next(newAccessToken);
  //     })
  //   );
  // }

  setTokens(access: string, refresh: string) {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }
  setAccessToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return throwError(() => 'Missing refresh token');

    return this.http.post<{ access_token: string }>(
      'http://localhost:5000/auth/refresh',
      { refreshToken }
    ).pipe(
      tap(response => this.setAccessToken(response.access_token)),
      map(response => response.access_token)
    );
  }








  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }







  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap(response => {
          this.accessTokenSubject.next(response.access_token);
          localStorage.setItem('access_token', response.access_token);
        }),
        catchError(error => {
          this.logout();
          return throwError(() => error);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!this.accessTokenSubject.getValue();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token'); // ✅ Correction
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }


  getRole(): string {
    return localStorage.getItem('userRole')?.trim().toLowerCase() || '';
  }



  public clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token'); // ✅ Correction
    localStorage.removeItem('refresh_token'); // ✅ Correction
  }
}



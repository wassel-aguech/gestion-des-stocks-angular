

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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

    this.clearAuthData();

    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  refreshToken(): Observable<RefreshResponse> {
    const refreshToken = localStorage.getItem('refresh_token'); // ✅ Correction

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

  // getRole(): string {
  //   return localStorage.getItem('userRole') || 'Aucun rôle trouvé';
  // }


  getRole(): string {
    return localStorage.getItem('userRole')?.trim().toLowerCase() || '';
  }



  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token'); // ✅ Correction
    localStorage.removeItem('refresh_token'); // ✅ Correction
  }
}



/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationResponse } from '../models/authentication-response';
import { User } from '../models/user';
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
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedUser) this.currentUserSubject.next(JSON.parse(storedUser));
    if (storedAccessToken) this.accessTokenSubject.next(storedAccessToken);
    if (storedRefreshToken) this.refreshTokenSubject.next(storedRefreshToken);
  }


  login(email: string, password: string): Observable<AuthenticationResponse> {
    const loginData = { email, password };

    return this.http.post<AuthenticationResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          console.log('Login response:', response); // Add this to debug

          this.currentUserSubject.next(response.user);
          this.accessTokenSubject.next(response.access_token);
          this.refreshTokenSubject.next(response.refresh_token);

          // Store in localStorage using consistent property names
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);

          // Store role separately if needed
          if (response.user && response.user.role) {
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
    const refreshToken = this.refreshTokenSubject.getValue();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.http.post<RefreshResponse>(`${this.apiUrl}/refresh`, { refresh_token: refreshToken })
      .pipe(
        tap(response => {
          this.accessTokenSubject.next(response.access_token);
          localStorage.setItem('accessToken', response.access_token);
        })
      );
  }


  isLoggedIn(): boolean {
    return !!this.accessTokenSubject.getValue();
  }
  getAccessToken(): string | null {
    return this.accessTokenSubject.getValue();
  }
  getRole(){
    return localStorage.getItem('userRole') || 'Aucun rôle trouvé';

  }
  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
  private clearAuthData(): void {
    this.currentUserSubject.next(null);
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);

    localStorage.removeItem('currentUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }




  setUserToken (authenticationResponse: AuthenticationResponse){
    localStorage.setItem("accessToken",JSON.stringify(authenticationResponse))
  const token = authenticationResponse.access_token;
  if (token) {

  const decodedToken = jwtDecode(token) as any;
  const fullname = decodedToken.name;
  localStorage.setItem("fullName", fullname);

  const idUser = decodedToken.id;
  localStorage.setItem("userId", idUser);


  const authorities = decodedToken.authorities[0].authority;
  console.log(decodedToken.authorities[0].authority);
  localStorage.setItem("role",authorities)

  console.log("okk",decodedToken)
    }

}

private jwtHelper = new JwtHelperService();
getToken(): string | null {
  return localStorage.getItem('token'); // Assure-toi que le token est bien stocké
}

isAdmin(): boolean {
  const token = this.getToken();
  if (!token) return false;

  try {
    const decodedToken = this.jwtHelper.decodeToken(token);
    return decodedToken && decodedToken.role === 'admin';
  } catch (error) {
    console.error('Erreur de décodage du token:', error);
    return false;
  }
}


}*/

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

  getRole(): string {
    return localStorage.getItem('userRole') || 'Aucun rôle trouvé';
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



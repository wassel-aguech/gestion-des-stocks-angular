import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }



  private apiUrl = 'http://127.0.0.1:5000/api/user';

  private http = inject(HttpClient);


  getUsers(): Observable<any[]> {
 
    return this.http.get<any[]>(`${this.apiUrl}/users`)
      .pipe(
        tap(users => console.log('Users fetched successfully:', users)),
        catchError(error => {
          console.error('Error fetching users:', error);
          return throwError(() => 'Erreur lors de la récupération des utilisateurs. ' + (error.error?.message || error.message || ''));
        })
      );
  }




  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }



  createUser(userData: any): Observable<any> {
  
    
    return this.http.post<any>(`${this.apiUrl}/creatusers`, userData )
      .pipe(
        tap(response => console.log('Utilisateur ajouté avec succès')),
        catchError(error => {
          console.error("Erreur lors de l'ajout de l'utilisateur:", error);
          return throwError(() => error);
        })
      );
  }

  updateUser(userId: string, userData: any): Observable<any> {
  
    
    return this.http.put<any>(`${this.apiUrl}/users/${userId}`, userData)
      .pipe(
        tap(response => console.log('Utilisateur mis à jour avec succès')),
        catchError(error => {
          console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
          return throwError(() => error);
        })
      );
  }

  deleteUser(userId: string): Observable<any> {
    
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}`, { headers: this.getAuthHeaders() })
      .pipe(
        tap(response => console.log('Utilisateur supprimé avec succès')),
        catchError(error => {
          console.error("Erreur lors de la suppression de l'utilisateur:", error);
          return throwError(() => error);
        })
      );
  }





}

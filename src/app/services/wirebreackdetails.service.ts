import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Wirebreackdetails } from '../models/wirebreackdetails';

@Injectable({
  providedIn: 'root'
})
export class WirebreackdetailsService {

  constructor() { }


  private apiUrl = 'http://127.0.0.1:5000/api/upload';
  private apiUrl2 = 'http://127.0.0.1:5000/api';


  private http = inject(HttpClient);


// Saisir les donneés avec upload

  uploadFile(file: File): Observable<any> {

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/upload`, formData ,{headers});
  }

  getTemporaryData(): Observable<any[]> {

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any[]>(`${this.apiUrl}/get-temporary-data` ,{headers});
  }

  validateData(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/validate-data`, {}, { headers }); // ✅
  }



//  Saisir les donneés manuelle

   addWirebreackDetails(Wirebreackdetails: Wirebreackdetails): Observable<Wirebreackdetails> {

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'

    });

        return this.http.post<Wirebreackdetails>(`${this.apiUrl2}/Addwirebreak`, Wirebreackdetails,{headers});
      }




      getWireBreakDetails(): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'

    });
        return this.http.get<any>(`${this.apiUrl2}/wirebreakdetails`, { headers });
      }







}

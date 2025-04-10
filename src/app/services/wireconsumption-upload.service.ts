import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WireconsumptionUploadService {

  constructor() { }

  private apiUrl = 'http://localhost:5000/api/wire';


    private http = inject(HttpClient);


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

        return this.http.get<any[]>(`${this.apiUrl}/temporary-data` ,{headers});
      }

      validateData(): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.post(`${this.apiUrl}/validate`, {}, { headers });
      }





}

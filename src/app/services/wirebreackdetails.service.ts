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
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(`${this.apiUrl}/upload`, formData);
  }

  getTemporaryData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-temporary-data`);
  }

  validateData(): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate-data`, {});
  }


//  Saisir les donneés manuelle

   addWirebreackDetails(Wirebreackdetails: Wirebreackdetails): Observable<any> {
        return this.http.post(`${this.apiUrl2}/Addwirebreak`, Wirebreackdetails);
      }


      // addWirebreackDetails(Wirebreackdetails: any): Observable<any> {
      //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      //   return this.http.post(`${this.apiUrl2}/Addwirebreak`, Wirebreackdetails, { headers })
      //     .pipe(
      //       catchError((error: HttpErrorResponse) => {
      //         console.error("Error occurred:", error);
      //         return throwError(error);
      //       })
      //     );
      // }






}

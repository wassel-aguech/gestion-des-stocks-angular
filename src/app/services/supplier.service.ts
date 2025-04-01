import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Supplier } from '../models/supplier';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api/supplier';
  private apiUrl2 = 'http://127.0.0.1:5000/api';


  private http = inject(HttpClient);




  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl2}/suppliers`);
  }


   createSupplier(supplierData: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/supplier`, supplierData )
          .pipe(
            tap(response => console.log('supplier ajouté avec succès')),
            catchError(error => {
              console.error("Erreur lors de l'ajout de la supplier:", error);
              return throwError(() => error);
            })
          );
      }

      deleteSupplier(supplierid: string): Observable<any> {

        return this.http.delete<any>(`${this.apiUrl}/supplier/${supplierid}`)
          .pipe(
            tap(response => console.log('supplier supprimé avec succès')),
            catchError(error => {
              console.error("Erreur lors de la suppression de supplier:", error);
              return throwError(() => error);
            })
          );
      }




      getSupplierById(supplierid: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/supplier/${supplierid}`);
      }


      // updateSupplier(supplierid: any , supplierData : any): Observable<any> {
      //   return this.http.put(`${this.apiUrl}/supplier/${supplierid}`, supplierData);
      // }


      updateSupplier(supplierId: string, newSupplierId: string): Observable<any> {
        const body = {
          new_supplierid: newSupplierId,
        };
        return this.http.put(`${this.apiUrl}/supplier/${supplierId}`, body);
      }



}

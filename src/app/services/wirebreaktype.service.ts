import { inject, Injectable } from '@angular/core';
import { WirebreakType } from '../models/wirebreaktype';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WirebreaktypeService {

   constructor() { }

    private apiUrl = 'http://127.0.0.1:5000/api';
    private apiUrl2 = 'http://127.0.0.1:5000/api/wirebreaktype';


    private http = inject(HttpClient);


    getWireBreakTypes(): Observable<WirebreakType[]> {
      return this.http.get<WirebreakType[]>(`${this.apiUrl}/wirebreaktypes`);
    }


     createWireBreakType(wiretype: any): Observable<any> {
            return this.http.post<any>(`${this.apiUrl2}/wirebreaktype`, wiretype )
              .pipe(
                tap(response => console.log('wiretype ajouté avec succès')),
                catchError(error => {
                  console.error("Erreur lors de l'ajout de la wiretype:", error);
                  return throwError(() => error);
                })
              );
          }

          deleteWireBreakType(wirebreaktype: string): Observable<any> {

            return this.http.delete<any>(`${this.apiUrl2}/wirebreaktype/${wirebreaktype}`)
              .pipe(
                tap(response => console.log('wiretype supprimé avec succès')),
                catchError(error => {
                  console.error("Erreur lors de la suppression de wiretype:", error);
                  return throwError(() => error);
                })
              );
          }


          getWireBreakTypeById(id: string): Observable<any> {
            return this.http.get(`${this.apiUrl2}/wirebreaktype/${id}`);
          }



          updateWireBreakType(wirebreaktype: string, newWireBreakType: string, newTypeB: string): Observable<any> {
            const body = {
              new_wirebreaktype: newWireBreakType,
              new_typeB: newTypeB,
            };
            return this.http.put(`${this.apiUrl2}/wirebreaktype/${wirebreaktype}`, body);

          }



          deactivateWireBreakType(wirebreaktype: any) {
            return this.http.put(`${this.apiUrl2}/${wirebreaktype}/desactivate`, {});
          }

          activateWireBreakType(wirebreaktype: any) {
            return this.http.put(`${this.apiUrl2}/${wirebreaktype}/activate`, {});
          }


}

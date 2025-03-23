import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Machine } from '../models/machine';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

 constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api';
  private apiUrl2 = 'http://127.0.0.1:5000/api/machine';


  private http = inject(HttpClient);


  getMachines(): Observable<Machine[]> {
    return this.http.get<Machine[]>(`${this.apiUrl}/machines`);
  }


  createMachine(machineData: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl2}/machine`, machineData )
        .pipe(
          tap(response => console.log('machine ajouté avec succès')),
          catchError(error => {
            console.error("Erreur lors de l'ajout de la machine:", error);
            return throwError(() => error);
          })
        );
    }

    deleteMachine(codeMachine: string): Observable<any> {

      return this.http.delete<any>(`${this.apiUrl2}/machine/${codeMachine}`)
        .pipe(
          tap(response => console.log('machine supprimé avec succès')),
          catchError(error => {
            console.error("Erreur lors de la suppression de Machine:", error);
            return throwError(() => error);
          })
        );
    }




    getMachineById(codeMachine: string): Observable<any> {
      return this.http.get(`${this.apiUrl2}/machine/${codeMachine}`);
    }

    updateMachine(codeMachine: string, newCodeMachine: string, newTypeM: string): Observable<any> {
      const body = {
        new_codeMachine: newCodeMachine,
        new_typeM: newTypeM,
      };
      return this.http.put(`${this.apiUrl2}/machine/${codeMachine}`, body);
    }

}

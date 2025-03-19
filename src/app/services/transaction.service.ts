import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api/remplir_wire_transaction';

      private http = inject(HttpClient);


      remplirWireTransaction(): Observable<any> {
        return this.http.post(`${this.apiUrl}`, {});
      }
}

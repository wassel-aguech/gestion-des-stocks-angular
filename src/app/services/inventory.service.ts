import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inventory } from '../models/inventory';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api/inventory';

    private http = inject(HttpClient);



    addInventory(inventory: Inventory): Observable<any> {
      return this.http.post(`${this.apiUrl}/add`, inventory);
    }


    getAllInventory(): Observable<any> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      return this.http.get(`${this.apiUrl}`, { headers });
    }



    // getAllInventory() : Observable<Inventory[]>{
    //   return this.http.get<Inventory[]>(`${this.apiUrl}`)

    // }


    updateInventory( inventory: Inventory): Observable<Inventory> {
      return this.http.put<Inventory>(`${this.apiUrl}/inventory_update`, inventory);
    }

}

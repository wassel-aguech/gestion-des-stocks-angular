import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { Wireconsumption } from '../models/wireconsumption';



@Injectable({
  providedIn: 'root'
})
export class WireconsumptionService {

  constructor() { }

    private apiUrl = 'http://127.0.0.1:5000/api/wireconsumption';
    private apiUrl2 = 'http://127.0.0.1:5000/wire_consumption';
    private apiUrl3 = 'http://127.0.0.1:5000/api';




    private http = inject(HttpClient);


    getWireConsumption(): Observable<Wireconsumption[]> {
      const token = localStorage.getItem('access_token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      return this.http.get<Wireconsumption[]>(`${this.apiUrl}`, { headers });
    }


    updateWireConsumption(data: any): Observable<any> {
      return this.http.post(`${this.apiUrl2}/update_wire_consumption`, data);
    }





      getWireConsumptionbyId(Plant: string, Supplier: string, Week_Number: number, yearB: number): Observable<Wireconsumption> {
        const params = new HttpParams()
          .set('Plant', Plant)
          .set('Supplier', Supplier)
          .set('Week_Number', Week_Number)
          .set('yearB', yearB);

        return this.http.get<Wireconsumption>(`${this.apiUrl3}/getwireconsumptionbyid`, { params });

      }

}

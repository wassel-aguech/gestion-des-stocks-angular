import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Supplier } from '../models/supplier';


@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api'; 

  private http = inject(HttpClient);
  



  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(`${this.apiUrl}/suppliers`);
  }




}

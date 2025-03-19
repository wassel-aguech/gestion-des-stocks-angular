import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MachineType } from '../models/machinetype';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

 constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api';

  private http = inject(HttpClient);


  getMachines(): Observable<MachineType[]> {
    return this.http.get<MachineType[]>(`${this.apiUrl}/machinetypes`);
  }
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plant } from '../models/plant';


@Injectable({
  providedIn: 'root'
})
export class PlantService {

  constructor() { }

  private apiUrl = 'http://127.0.0.1:5000/api'; 

  private http = inject(HttpClient);


  getPlants(): Observable<Plant[]> {
    return this.http.get<Plant[]>(`${this.apiUrl}/plants`);
  }




  
}

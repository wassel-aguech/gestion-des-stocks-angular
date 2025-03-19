import { inject, Injectable } from '@angular/core';
import { WirebreakType } from '../models/wirebreaktype';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WirebreaktypeService {

   constructor() { }

    private apiUrl = 'http://127.0.0.1:5000/api';

    private http = inject(HttpClient);


    getWireBreakTypes(): Observable<WirebreakType[]> {
      return this.http.get<WirebreakType[]>(`${this.apiUrl}/wirebreaktypes`);
    }
}

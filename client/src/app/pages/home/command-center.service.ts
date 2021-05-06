import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class CommandCenterService {
    private baseUrl = `${environment.apiUrl}/command-center`;

    constructor(private http: HttpClient) { }  
    
    getTemp(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/get-temp`);
    }
  }
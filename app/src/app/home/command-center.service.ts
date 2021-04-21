import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
  export class CommandCenterService {
    private baseUrl = '/api/command-center';

    constructor(private http: HttpClient) { }  
    
    getTemp(): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/get-temp`);
    }
  }
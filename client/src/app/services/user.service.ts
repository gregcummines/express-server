import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`/users`);
    }

    getById(id: number) {
        return this.http.get<User>(`/users/${id}`);
    }

    deleteById(id: number) {
        return this.http.delete(`/users/${id}`);
    }

    setActive(id: number) {
        return this.http.post(`/users/activate/${id}`, null);
    }

    setInactive(id: number) {
        return this.http.post(`/users/deactivate/${id}`, null);
    }
}
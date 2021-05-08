import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators'
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient, private router: Router) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
    }

    public isLoggedIn(): boolean {
        return (this.currentUserValue != null);
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        const authUrl = `/users/authenticate`;
        return this.http.post<any>(`${authUrl}`, { username, password })
            .pipe(
                map(user => {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    return user;
                }),
                catchError(error => {
                    let errorMsg: string;
                    if (error.error instanceof ErrorEvent) {
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        errorMsg = this.getServerErrorMessage(error);
                    }

                    return throwError(errorMsg);
                })
            );
    }

    register(firstName: string, lastName: string, username: string, password: string) {
        const authUrl = `/users/register`;
        return this.http.post<any>(`${authUrl}`, { firstName, lastName, username, password })
            .pipe(
                map(user => {
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        this.currentUserSubject.next(user);
                    }
                    return user;
                }),
                catchError(error => {
                    let errorMsg: string;
                    if (error.error instanceof ErrorEvent) {
                        errorMsg = `Error: ${error.error.message}`;
                    } else {
                        errorMsg = this.getServerErrorMessage(error);
                    }

                    return throwError(errorMsg);
                })
            );
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    delete() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    private getServerErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case 404: {
                return `Not Found: ${error.message}`;
            }
            case 403: {
                return `Access Denied: ${error.message}`;
            }
            case 500: {
                return `Internal Server Error: ${error.message}`;
            }
            default: {
                return `Unknown Server Error: ${error.message}`;
            }

        }
    }
}
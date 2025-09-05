import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/v1/auth';
  private usersApiUrl = 'http://localhost:8000/api/v1/users';

  constructor(private http: HttpClient) {}

  signup(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    const body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);

    return this.http
      .post(`${this.apiUrl}/login`, body.toString(), { headers })
      .pipe(
        tap((response: any) => {
          if (response.access_token) {
            localStorage.setItem('access_token', response.access_token);
          }
        })
      );
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.usersApiUrl}/me`);
  }

  updateCurrentUser(userData: any): Observable<any> {
    return this.http.put(`${this.usersApiUrl}/me`, userData);
  }
}
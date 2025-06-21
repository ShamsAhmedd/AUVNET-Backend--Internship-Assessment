import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  private baseUrl ='http://localhost:5003/api/auth'

  constructor(private _HttpClient: HttpClient, private _Router: Router) {}

  decodeUserData() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userData = jwtDecode(token);
      console.log('Decoded user data:', this.userData);
    }
  }

  setRegister(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Register`, userData);
  }

  setLogin(userData: object): Observable<any> {
    return this._HttpClient.post(`${this.baseUrl}/Login`, userData);
  }

  logOut(): void {
    localStorage.removeItem('token');
    this._Router.navigate(['/login']);
  }
}

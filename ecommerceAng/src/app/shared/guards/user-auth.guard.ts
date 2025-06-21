import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class userAuthGuard implements CanActivate {

  userData: any;

  constructor() {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      this.userData = jwtDecode(token);
    }

    if (this.userData && this.userData.type === 'user') {
      return true;
    }

  const shouldLogin = confirm(
    '🚫 Access Denied: This page is for users only.\n\n🚫 Would you like to log in as a user?'
  );

  if (shouldLogin) {
    window.location.href = '/login';
  }
    return false;
  }
}

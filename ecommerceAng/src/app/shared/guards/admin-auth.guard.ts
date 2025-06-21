import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class adminAuthGuard implements CanActivate {
  userData: any;
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {

    const token = localStorage.getItem('token');

    if (token) {
      this.userData = jwtDecode(token);
    }

    if (this.userData && this.userData.type === 'admin') {
      return true;
    }

    const shouldLogin = confirm(
      '🚫 Access Denied: This page is for admins only.\n\n🚫 Would you like to log in as an admin?'
    );

    if (shouldLogin) {
      window.location.href = '/login'; // or use router.navigate(['/login']) if using Router
    }
    return false;
  }
}

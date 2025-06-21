import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-admin-navbar',
  standalone: false,
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {
  userData: any;
  private _authService: AuthService;

  constructor(_authService: AuthService) {
    this._authService = _authService;

    const token = localStorage.getItem('token');
    if (token) {
      this.userData = jwtDecode(token);
    }
    
  }
  logOut(): void {
    this._authService.logOut();
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageError: string | null = null;
  isLoading = false;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
  ) {}

  ngOnInit(): void {}

  handleForm(): void {
    this.messageError = null;

    if (this.loginForm.valid) {
      this.isLoading = true;

      this._AuthService.setLogin(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login response:', response);
          this.isLoading = false;

          if (response.message === 'success') {
            localStorage.setItem('token', response.token);
            this._AuthService.decodeUserData();

            if (response.type === 'admin') {
              this._Router.navigate(['/admin/home']);
            } else {
              this._Router.navigate(['/home']);
            }
          } else {
            this.messageError = 'Login failed. Please try again.';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Login error:', error);
          this.isLoading = false;
          this.messageError = error.error?.error || 'Username or Password not valid';
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}

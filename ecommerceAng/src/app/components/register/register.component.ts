import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit  {
  messageError: string | null = null;
  isLoading: boolean = false;

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
  });

  constructor(
    private _AuthService:AuthService,
    private _Router: Router,
  ) {}

  ngOnInit(): void {
  }

  handleForm(): void {
    this.messageError = null;

    if (this.registerForm.valid) {
      this.isLoading = true;

      this._AuthService.setRegister(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response?.message === 'success') {
            localStorage.setItem('token', response.token);
            this._Router.navigate(['/home']);
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.messageError = error.error?.error || 'An unknown error occurred';
        }
      });
    }
  }
}

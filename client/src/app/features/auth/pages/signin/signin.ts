import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { StorageService } from '../../../../core/services/storage.service';

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Cannot reach the server. Check your connection.';
    const body = error.error as Record<string, unknown> | string | null;
    if (typeof body === 'string') return body;
    if (body && typeof body === 'object') {
      if (typeof body['message'] === 'string') return body['message'];
      if (typeof body['error'] === 'string') return body['error'];
    }
    return `Request failed (${error.status}).`;
  }
  return 'Something went wrong. Please try again.';
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class Login {
  currentYear = new Date().getFullYear();

  loginForm: FormGroup;
  serverError: string | null = null;
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService, // ← inject storage
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email(): AbstractControl | null {
    return this.loginForm.get('email');
  }
  get password(): AbstractControl | null {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.serverError = null;
    this.isSubmitting = true;

    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        // ← save token + user to localStorage
        this.storageService.saveSession(res);

        // ← redirect based on role
        const role = res.tokenUser.role;
        //todo create the dashboards and navigate to them
        if (role === 'admin') this.router.navigate(['/admin']);
        else if (role === 'seller') this.router.navigate(['/seller']);
        else this.router.navigate(['/']);
      },
      error: (err: unknown) => {
        this.isSubmitting = false;
        this.serverError = extractApiErrorMessage(err);
        this.cdr.detectChanges();
      },
    });
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// import { finalize } from 'rxjs';
import { SignupPayload, SignupRole } from '../../models/auth.models';
import { AuthService } from '../../services/auth-service';

function extractApiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const body = error.error;
    if (error.status === 0) {
      return 'Cannot reach the server. Check that the API is running and the URL is correct.';
    }
    if (body == null) {
      return `Request failed (${error.status}).`;
    }
    if (typeof body === 'string') {
      return body;
    }
    if (typeof body === 'object') {
      const o = body as Record<string, unknown>;
      if (typeof o['message'] === 'string') {
        return o['message'];
      }
      if (Array.isArray(o['message'])) {
        return o['message'].map(String).join(' ');
      }
      if (typeof o['error'] === 'string') {
        return o['error'];
      }
      if (o['errors'] && typeof o['errors'] === 'object') {
        const parts = Object.values(o['errors'] as Record<string, { message?: string }>)
          .map((x) => x?.message)
          .filter((m): m is string => typeof m === 'string');
        if (parts.length) return parts.join(' ');
      }
    }
    return error.message || `Request failed (${error.status}).`;
  }
  return 'Something went wrong. Please try again.';
}

function notWhitespaceOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return null;
    if (typeof v === 'string' && v.length > 0 && v.trim() === '') {
      return { whitespace: true };
    }
    return null;
  };
}

function passwordsMatchValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value ?? '';
    const confirm = group.get('confirmPassword')?.value ?? '';
    if (!confirm.length) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  currentYear = new Date().getFullYear();

  userSignupForm: FormGroup;

  serverError: string | null = null;

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    // Check this component NOW and update the UI if anything changed.
    private cdr: ChangeDetectorRef,
  ) {
    this.userSignupForm = this.fb.group(
      {
        fullName: ['', [Validators.required, notWhitespaceOnlyValidator()]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['customer', Validators.required],
      },
      { validators: [passwordsMatchValidator()] },
    );
  }

  get fullName(): AbstractControl | null {
    return this.userSignupForm.get('fullName');
  }

  get email(): AbstractControl | null {
    return this.userSignupForm.get('email');
  }

  get password(): AbstractControl | null {
    return this.userSignupForm.get('password');
  }

  get confirmPassword(): AbstractControl | null {
    return this.userSignupForm.get('confirmPassword');
  }

  get role(): AbstractControl | null {
    return this.userSignupForm.get('role');
  }

  get passwordMismatchError(): boolean {
    return !!this.confirmPassword?.touched && this.userSignupForm.hasError('passwordMismatch');
  }

  get confirmPasswordHasError(): boolean {
    return (
      !!(this.confirmPassword?.invalid && this.confirmPassword.touched) ||
      this.passwordMismatchError
    );
  }

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.userSignupForm.invalid) {
      this.userSignupForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    this.serverError = null;
    this.isSubmitting = true;

    const v = this.userSignupForm.getRawValue();
    const payload: SignupPayload = {
      name: v.fullName.trim(),
      email: v.email.trim(),
      password: v.password,
      role: v.role as SignupRole,
    };

    try {
      this.authService
        .createUser(payload)
        // reset the loading state after the request finishes
        // .pipe(finalize(() => (this.isSubmitting = false)))
        .subscribe({
          next: () => {
            // Handle the Promise so rejections surface to the user
            // todo correct the forward as needed
            this.isSubmitting = false;
            this.router.navigate(['/auth/login']).catch((navErr: unknown) => {
              this.serverError = extractApiErrorMessage(navErr);
              this.cdr.detectChanges();
            });
          },
          error: (err: unknown) => {
            // console.log('touched');
            this.isSubmitting = false;
            this.serverError = extractApiErrorMessage(err);
            this.cdr.detectChanges();
          },
        });
    } catch (err: unknown) {
      // Catches synchronous throws before the stream starts
      this.isSubmitting = false;
      this.serverError = extractApiErrorMessage(err);
      this.cdr.detectChanges();
    }
  }
}

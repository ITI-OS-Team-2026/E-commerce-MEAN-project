import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { finalize } from 'rxjs';

import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';
import { CustomerUserService } from '../../services/customer-user.service';

interface UserProfile {
  name: string;
  phone?: string;
}

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (!newPassword || !confirmPassword) return null;
  return newPassword === confirmPassword ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomerSidebar, CustomerHeader],
  templateUrl: './profile-page.html',
  styles: [],
})
export class CustomerProfile implements OnInit {
  private fb = inject(FormBuilder);
  private storageService = inject(StorageService);
  private customerUserService = inject(CustomerUserService);

  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  isEditing = signal(false);
  isSaving = signal(false);
  isLoading = signal(false);
  isChangingPassword = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  passwordSuccessMessage = signal('');
  passwordErrorMessage = signal('');
  customerUser = signal<UserProfile | null>(null);

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.minLength(7), Validators.maxLength(15)]],
    });

    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator },
    );
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.customerUserService
      .getProfile()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response) => {
          const userProfile: UserProfile = {
            name: response.user?.name || '',
            phone: response.user?.phone || '',
          };

          this.customerUser.set(userProfile);
          this.profileForm.patchValue(userProfile);
          this.profileForm.disable();
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.errorMessage.set(error?.error?.message || 'Failed to load profile');
          this.profileForm.disable();
        },
      });
  }

  enableEdit(): void {
    this.isEditing.set(true);
    this.profileForm.enable();
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.profileForm.disable();
    this.loadProfile();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    this.errorMessage.set('');

    const formValue = this.profileForm.getRawValue();
    this.customerUserService
      .updateProfile({
        name: formValue.name,
        phone: formValue.phone,
      })
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (response) => {
          const currentUser = this.storageService.getUser() || {};
          const mergedUser = {
            ...currentUser,
            name: response.updatedUser.name,
            phone: response.updatedUser.phone,
          };

          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(mergedUser));

          this.customerUser.set({
            name: response.updatedUser.name,
            phone: response.updatedUser.phone,
          });
          this.isEditing.set(false);
          this.profileForm.disable();
          this.successMessage.set('Profile updated successfully!');
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (error) => {
          console.error('Error saving profile:', error);
          this.errorMessage.set(error?.error?.message || 'Failed to save profile');
        },
      });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isChangingPassword.set(true);
    this.passwordErrorMessage.set('');
    this.passwordSuccessMessage.set('');

    const formValue = this.passwordForm.getRawValue();
    this.customerUserService
      .changePassword({
        oldPassword: formValue.oldPassword,
        newPassword: formValue.newPassword,
        confirmPassword: formValue.confirmPassword,
      })
      .pipe(finalize(() => this.isChangingPassword.set(false)))
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.passwordSuccessMessage.set('Password changed successfully!');
          setTimeout(() => this.passwordSuccessMessage.set(''), 3000);
        },
        error: (error) => {
          console.error('Error changing password:', error);
          this.passwordErrorMessage.set(error?.error?.message || 'Failed to change password');
        },
      });
  }
}

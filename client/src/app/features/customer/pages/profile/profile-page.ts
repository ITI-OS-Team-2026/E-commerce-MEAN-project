import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
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

  profileForm!: FormGroup;
  isEditing = signal(false);
  isSaving = signal(false);
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  customerUser = signal<UserProfile | null>(null);

  constructor() {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      street: [''],
      city: [''],
      state: [''],
      zip: [''],
      country: [''],
    });
  }

  private loadProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Load profile from localStorage (mock data)
    setTimeout(() => {
      try {
        const user = this.storageService.getUser();
        if (user) {
          const userProfile: UserProfile = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || {},
          };
          this.customerUser.set(userProfile);
          this.profileForm.patchValue({
            name: userProfile.name || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            street: userProfile.address?.street || '',
            city: userProfile.address?.city || '',
            state: userProfile.address?.state || '',
            zip: userProfile.address?.zip || '',
            country: userProfile.address?.country || '',
          });
        }
        this.profileForm.disable();
        this.isLoading.set(false);
      } catch (error) {
        console.error('Error loading profile:', error);
        this.errorMessage.set('Failed to load profile');
        this.isLoading.set(false);
      }
    }, 300);
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
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      this.errorMessage.set('');

      setTimeout(() => {
        try {
          const formValue = this.profileForm.getRawValue();
          const updatedUser = {
            ...this.storageService.getUser(),
            name: formValue.name,
            phone: formValue.phone,
            address: {
              street: formValue.street,
              city: formValue.city,
              state: formValue.state,
              zip: formValue.zip,
              country: formValue.country,
            },
          };

          // Save to localStorage
          this.storageService.saveUser(updatedUser);
          this.customerUser.set(updatedUser);

          this.isSaving.set(false);
          this.isEditing.set(false);
          this.profileForm.disable();
          this.successMessage.set('Profile updated successfully!');
          setTimeout(() => this.successMessage.set(''), 3000);
        } catch (error) {
          console.error('Error saving profile:', error);
          this.errorMessage.set('Failed to save profile');
          this.isSaving.set(false);
        }
      }, 500);
    }
  }
}

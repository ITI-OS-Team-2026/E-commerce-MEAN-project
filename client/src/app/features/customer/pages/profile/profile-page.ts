import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CustomerSidebar, CustomerHeader],
  templateUrl: './profile-page.html',
  styles: [],
})
export class CustomerProfile implements OnInit {
  profileForm!: FormGroup;
  isEditing = signal(false);
  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  customerUser: any = null;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
  ) {
    this.customerUser = this.storageService.getUser();
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfileData();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: [''],
      city: [''],
      state: [''],
      zipCode: [''],
    });
  }

  private loadProfileData(): void {
    if (this.customerUser) {
      this.profileForm.patchValue({
        name: this.customerUser.name || '',
        email: this.customerUser.email || '',
        phone: this.customerUser.phone || '',
        address: this.customerUser.address || '',
        city: this.customerUser.city || '',
        state: this.customerUser.state || '',
        zipCode: this.customerUser.zipCode || '',
      });
    }
    this.profileForm.disable();
  }

  enableEdit(): void {
    this.isEditing.set(true);
    this.profileForm.enable();
  }

  cancelEdit(): void {
    this.isEditing.set(false);
    this.profileForm.disable();
    this.loadProfileData();
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      // Save profile logic - to be implemented
      setTimeout(() => {
        this.isSaving.set(false);
        this.isEditing.set(false);
        this.profileForm.disable();
        this.successMessage.set('Profile updated successfully!');
        setTimeout(() => this.successMessage.set(''), 3000);
      }, 1000);
    }
  }
}

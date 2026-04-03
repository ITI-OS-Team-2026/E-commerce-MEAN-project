import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
import { environment } from '../../../../environments/environment';

// Models
export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface CustomerUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  isVerified: boolean;
  address?: UserAddress;
  wishlist?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: UserAddress;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  data: CustomerUser;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerUserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  // ✅ Get auth headers with Bearer token
  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ✅ Get current user profile
  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(`${this.apiUrl}/users/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Update profile
  updateProfile(data: UpdateProfileRequest): Observable<ProfileResponse> {
    return this.http.patch<ProfileResponse>(`${this.apiUrl}/users/update`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Change password
  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/update-password`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Get wishlist
  getWishlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/wishlist`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Add to wishlist
  addToWishlist(productId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/users/wishlist`,
      { productId },
      {
        headers: this.getAuthHeaders(),
      },
    );
  }

  // ✅ Remove from wishlist
  removeFromWishlist(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/wishlist/${productId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

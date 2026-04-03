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

export interface WishlistProduct {
  _id: string;
  name: string;
  price: number;
  images?: string[];
  stock?: number;
  description?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  address?: UserAddress;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileResponse {
  user: CustomerUser;
}

export interface UpdateProfileResponse {
  updatedUser: {
    name: string;
    email?: string;
    phone?: string;
    userId: string;
    role: 'customer' | 'seller' | 'admin';
    isVerified: boolean;
    isActive?: boolean;
    isApproved?: boolean;
  };
  token: string;
}

export interface WishlistResponse {
  results: number;
  wishlist: WishlistProduct[];
}

@Injectable({
  providedIn: 'root',
})
export class CustomerUserService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) { }

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
  updateProfile(data: UpdateProfileRequest): Observable<UpdateProfileResponse> {
    return this.http.patch<UpdateProfileResponse>(`${this.apiUrl}/users/update`, data, {
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
  getWishlist(): Observable<WishlistResponse> {
    return this.http.get<WishlistResponse>(`${this.apiUrl}/users/wishlist`, {
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

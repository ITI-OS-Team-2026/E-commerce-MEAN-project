import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UsersResponse } from '../models/user.model';
import { StorageService } from '../../../core/services/storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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

  // ✅ Get all users
  getUsersList(): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Approve seller
  approveSeller(id: string): Observable<User> {
    return this.http.patch<User>(
      `${this.apiUrl}/users/${id}/approve`,
      {},
      {
        headers: this.getAuthHeaders(),
      },
    );
  }
}

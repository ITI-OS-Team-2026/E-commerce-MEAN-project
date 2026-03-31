import { Injectable } from '@angular/core';
import { LoginResponse } from '../../features/auth/models/auth.models';

@Injectable({ providedIn: 'root' })
export class StorageService {
  saveSession(data: LoginResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.tokenUser));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): LoginResponse['tokenUser'] | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
}

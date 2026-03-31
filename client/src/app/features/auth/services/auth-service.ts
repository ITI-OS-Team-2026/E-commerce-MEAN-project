import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  SignupPayload,
  RegisterResponse,
  VerifyEmailResponse,
  LoginResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ← return type changed from any to RegisterResponse
  createUser(payload: SignupPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.api}/auth/register`, payload);
  }

  // ← new: reads token from URL, sends it to backend
  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(`${this.api}/auth/verify-email?token=${token}`);
  }

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, credentials);
  }
}

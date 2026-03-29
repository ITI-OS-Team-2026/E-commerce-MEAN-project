import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SignupPayload } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createUser(user: SignupPayload): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}/auth/register`, user);
  }
}

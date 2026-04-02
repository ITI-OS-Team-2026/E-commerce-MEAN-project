import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../core/services/storage.service';
import { CheckoutPayload, CheckoutResponse } from '../models/checkout.models';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getToken()}`
      })
    };
  }

  checkout(payload: CheckoutPayload): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.api}/checkout`, payload, this.headers);
  }
}

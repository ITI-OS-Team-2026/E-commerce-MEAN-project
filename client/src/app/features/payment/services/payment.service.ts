import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl.replace('/v1', '')}/payments`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  private get headers() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.storage.getToken()}`
      })
    };
  }

  createPaymentIntent(amount: number, orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-intent`, { amount, orderId }, this.headers);
  }

  createCheckoutSession(
    amount: number,
    currency: string,
    successUrl: string,
    cancelUrl: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/create-checkout-session`,
      { amount, currency, successUrl, cancelUrl },
      this.headers
    );
  }

  verifyCheckoutSession(sessionId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-session`, { sessionId }, this.headers);
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, { paymentIntentId }, this.headers);
  }
}
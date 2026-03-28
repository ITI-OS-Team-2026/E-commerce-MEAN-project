import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, orderId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-intent`, { amount, orderId });
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm`, { paymentIntentId });
  }
}
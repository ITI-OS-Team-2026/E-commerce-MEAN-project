import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrdersResponse } from '../models/order.model';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private api = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
  ) {}

  // ✅ Helper method to get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // ✅ Get all orders
  getAllOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.api}/orders/admin-orders`, {
      headers: this.getAuthHeaders(),
    });
  }
}

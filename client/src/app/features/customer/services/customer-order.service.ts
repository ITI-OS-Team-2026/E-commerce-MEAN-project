import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';

// Models
export interface OrderItem {
  product?: { _id: string; name: string; price: number };
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod?: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  user?: { name: string; email: string };
  trackingHistory?: Array<{ status: string; comment: string; updatedAt: string }>;
  updatedAt?: string;
}

export interface OrdersResponse {
  results: number;
  orders: Order[];
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService {
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

  // ✅ Get customer's orders
  getMyOrders(): Observable<OrdersResponse> {
    return this.http.get<OrdersResponse>(`${this.api}/orders`, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Get order by ID
  getOrderById(orderId: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.api}/orders/${orderId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}

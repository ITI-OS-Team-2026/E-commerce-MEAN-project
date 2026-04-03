import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../core/services/storage.service';
import {
  Order,
  OrderListResponse,
  OrderDetailResponse,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
} from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class SellerOrdersService {
  private readonly baseUrl = `${environment.apiUrl}/orders`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  private get authHeaders(): { headers: HttpHeaders } {
    const token = this.storage.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
    };
  }

  /**
   * Get all orders (seller view)
   * Note: Backend needs a new endpoint GET /orders/seller
   * For now, this would need backend modification to return orders visible to sellers
   */
  getAllOrders(): Observable<OrderListResponse> {
    return this.http.get<OrderListResponse>(`${this.baseUrl}/seller`, this.authHeaders).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Get a specific order by ID
   * Sellers have access to view any order by ID
   */
  getOrderById(orderId: string): Observable<OrderDetailResponse> {
    return this.http.get<OrderDetailResponse>(`${this.baseUrl}/${orderId}`, this.authHeaders).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  /**
   * Update order status
   * Sellers can update order status
   */
  updateOrderStatus(
    orderId: string,
    payload: UpdateOrderStatusPayload
  ): Observable<UpdateOrderStatusResponse> {
    return this.http
      .patch<UpdateOrderStatusResponse>(`${this.baseUrl}/${orderId}`, payload, this.authHeaders)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }

  /**
   * Get orders filtered by status
   * This is a client-side filtering method that can work with getAllOrders
   */
  getOrdersByStatus(status: string): Observable<OrderListResponse> {
    return this.http
      .get<OrderListResponse>(`${this.baseUrl}?status=${status}`, this.authHeaders)
      .pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      );
  }
}

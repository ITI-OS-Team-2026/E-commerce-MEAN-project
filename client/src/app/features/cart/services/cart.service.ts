import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../core/services/storage.service';
import {
  CartResponse,
  AddToCartPayload,
  UpdateQuantityPayload,
} from '../models/cart.models';

@Injectable({ providedIn: 'root' })
export class CartService {
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

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.api}/cart`, this.headers);
  }

  addToCart(payload: AddToCartPayload): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.api}/cart`, payload, this.headers);
  }

  removeFromCart(productId: string): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.api}/cart/${productId}`, this.headers);
  }

  updateQuantity(productId: string, payload: UpdateQuantityPayload): Observable<CartResponse> {
    return this.http.patch<CartResponse>(`${this.api}/cart/${productId}`, payload, this.headers);
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.api}/cart`, this.headers);
  }
}

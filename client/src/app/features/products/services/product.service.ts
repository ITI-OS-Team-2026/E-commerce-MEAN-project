import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  ProductDetailsResponse,
  ProductQueryParams,
  ProductsResponse,
} from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(query: ProductQueryParams = {}): Observable<ProductsResponse> {
    let params = new HttpParams();

    if (query.search) {
      params = params.set('search', query.search);
    }

    if (query.category) {
      params = params.set('category', query.category);
    }

    if (query.sort) {
      params = params.set('sort', query.sort);
    }

    if (query.page) {
      params = params.set('page', query.page.toString());
    }

    if (query.limit) {
      params = params.set('limit', query.limit.toString());
    }

    if (query.minPrice !== undefined) {
      params = params.set('price[gte]', query.minPrice.toString());
    }

    if (query.maxPrice !== undefined) {
      params = params.set('price[lte]', query.maxPrice.toString());
    }

    if (query.inStock) {
      params = params.set('stock[gt]', '0');
    }

    return this.http.get<ProductsResponse>(`${this.api}/products`, { params });
  }

  getProductById(productId: string): Observable<ProductDetailsResponse> {
    return this.http.get<ProductDetailsResponse>(`${this.api}/products/${productId}`);
  }
}

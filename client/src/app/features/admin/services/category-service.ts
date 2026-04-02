import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { Category, CreateCategoryRequest } from '../models/category.model';
import { Product, ProductsResponse } from '../../products/models/product.models';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
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

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  getAllProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.api}/products`);
  }

  getCategoriesWithProductCount(): Observable<Category[]> {
    return forkJoin({
      categories: this.getAllCategories(),
      productsResponse: this.getAllProducts(),
    }).pipe(
      map(({ categories, productsResponse }) => {
        const products = productsResponse.data.products;

        return categories.map((category) => {
          const productCount = products.filter((product) => {
            if (!product.category) return false;

            if (typeof product.category === 'string') {
              return product.category === category._id;
            }

            return product.category._id === category._id;
          }).length;

          return {
            ...category,
            productCount,
          };
        });
      }),
    );
  }

  // ✅ Create category (name and slug only)
  createCategory(data: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.api}/categories`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Update category
  updateCategory(id: string, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.api}/categories/${id}`, data, {
      headers: this.getAuthHeaders(),
    });
  }

  // ✅ Delete category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.api}/categories/${id}`, { headers: this.getAuthHeaders() });
  }
}

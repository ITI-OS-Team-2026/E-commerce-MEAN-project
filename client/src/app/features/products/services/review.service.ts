import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Review {
  _id: string;
  product: string | any;
  user: { _id: string; name?: string; email?: string } | any;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getProductReviews(productId: string): Observable<{ status: string; data: Review[] }> {
    return this.http.get<{ status: string; data: Review[] }>(`${this.api}/products/${productId}/reviews`);
  }

  addReview(productId: string, rating: number, comment: string): Observable<any> {
    return this.http.post(`${this.api}/products/${productId}/reviews`, { rating, comment });
  }

  updateReview(reviewId: string, rating: number, comment: string): Observable<any> {
    return this.http.patch(`${this.api}/reviews/${reviewId}`, { rating, comment });
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.api}/reviews/${reviewId}`);
  }
}

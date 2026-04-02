import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, catchError, timeout } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { StorageService } from '../../../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient, private storageService: StorageService) { }

  getSellerProducts(): Observable<any> {
    console.log('DEBUG: InventoryService.getSellerProducts() called');
    try {
      const token = this.storageService.getToken();
      console.log('DEBUG: Token present:', !!token);
      if (!token) {
        return throwError(() => new Error('No authentication token found. Please log in.'));
      }

      // Decode JWT safely
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('DEBUG: Invalid token parts count', parts.length);
        return throwError(() => new Error('Invalid authentication token format.'));
      }

      const payload = JSON.parse(atob(parts[1]));
      console.log('DEBUG: Decoded payload:', payload);
      const userId = payload.userId || payload.sub || payload.id;

      if (!userId) {
        console.error('DEBUG: userId not found in payload');
        return throwError(() => new Error('Could not identify seller ID from token.'));
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const url = `${environment.apiUrl}/products?seller=${userId}`;
      console.log('DEBUG: Fetching from URL:', url);
      
      return this.http.get(url, { headers }).pipe(
        timeout(10000), // 10 second timeout
        catchError(err => {
          console.error('DEBUG: HTTP Request Error:', err);
          return throwError(() => err);
        })
      );
    } catch (err) {
      console.error('DEBUG: Setup Error:', err);
      return throwError(() => new Error('An error occurred during authentication setup: ' + (err as Error).message));
    }
  }
}

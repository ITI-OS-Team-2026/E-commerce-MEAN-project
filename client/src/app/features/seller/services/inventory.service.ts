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
    try {
      const token = this.storageService.getToken();
      if (!token) {
        return throwError(() => new Error('No authentication token found. Please log in.'));
      }

      // Decode JWT safely
      const parts = token.split('.');
      if (parts.length !== 3) {
        return throwError(() => new Error('Invalid authentication token format.'));
      }

      const payload = JSON.parse(atob(parts[1]));
      const userId = payload.userId || payload.sub || payload.id;

      if (!userId) {
        return throwError(() => new Error('Could not identify seller ID from token.'));
      }

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      const url = `${environment.apiUrl}/products?seller=${userId}`;
      
      return this.http.get(url, { headers }).pipe(
        timeout(10000), // 10 second timeout
        catchError(err => {
          return throwError(() => err);
        })
      );
    } catch (err) {
      return throwError(() => new Error('An error occurred during authentication setup: ' + (err as Error).message));
    }
  }
}

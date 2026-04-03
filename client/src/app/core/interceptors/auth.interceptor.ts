import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.getToken();
  const isApiRequest = req.url.includes('/api/v1/');

  // Temporary debug logs to verify interceptor behavior for protected API calls.
  if (isApiRequest) {
    console.log('[authInterceptor] request:', req.method, req.url);
    console.log('[authInterceptor] token found:', !!token);
  }

  if (!token || !isApiRequest) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (isApiRequest) {
    console.log('[authInterceptor] Authorization header attached for:', req.url);
  }

  return next(authReq);
};
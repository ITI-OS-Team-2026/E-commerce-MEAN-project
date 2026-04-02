import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  const user = storageService.getUser();
  const requiredRole = route.data['role'];

  if (user && user.role === requiredRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

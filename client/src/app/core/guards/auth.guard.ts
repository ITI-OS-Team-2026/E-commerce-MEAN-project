import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const storageService = inject(StorageService);

  if (storageService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};

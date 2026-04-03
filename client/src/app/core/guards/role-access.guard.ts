import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { StorageService } from '../services/storage.service';

export type AppRole = 'customer' | 'seller' | 'admin';

const DASHBOARD_BY_ROLE: Record<AppRole, string> = {
  customer: '/customer/dashboard',
  seller: '/seller/dashboard',
  admin: '/admin/dashboard',
};

const LOGIN_PATH = '/auth/login';

function isAppRole(role: string | undefined): role is AppRole {
  return role === 'customer' || role === 'seller' || role === 'admin';
}

function getUserRole(storage: StorageService): AppRole | null {
  const role = storage.getUser()?.role;
  return isAppRole(role) ? role : null;
}

function unauthorizedRedirect(router: Router, storage: StorageService): UrlTree {
  const role = getUserRole(storage);
  if (role) {
    return router.parseUrl(DASHBOARD_BY_ROLE[role]);
  }

  return router.parseUrl(LOGIN_PATH);
}

function evaluateRoleAccess(requiredRole: AppRole): true | UrlTree {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (!storage.isLoggedIn()) {
    return router.parseUrl(LOGIN_PATH);
  }

  const currentRole = getUserRole(storage);
  if (!currentRole) {
    storage.clearSession();
    return router.parseUrl(LOGIN_PATH);
  }

  if (currentRole !== requiredRole) {
    return unauthorizedRedirect(router, storage);
  }

  return true;
}

export const roleSectionCanActivate = (requiredRole: AppRole): CanActivateFn => {
  return () => evaluateRoleAccess(requiredRole);
};

export const roleSectionCanMatch = (requiredRole: AppRole): CanMatchFn => {
  return (_route: Route, _segments: UrlSegment[]) => evaluateRoleAccess(requiredRole);
};

export const guestOnlyCanActivate: CanActivateFn = () => {
  const storage = inject(StorageService);
  const router = inject(Router);

  if (!storage.isLoggedIn()) {
    return true;
  }

  return unauthorizedRedirect(router, storage);
};

import { Routes } from '@angular/router';
import { Login } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Profile } from './pages/profile/profile';
import { guestOnlyCanActivate } from '../../core/guards';

export const AUTH_ROUTES: Routes = [
  { path: 'login', canActivate: [guestOnlyCanActivate], component: Login },
  { path: 'register', canActivate: [guestOnlyCanActivate], component: Signup },
  { path: 'profile', component: Profile },
  {
    path: 'verify-email',
    loadComponent: () => import('./pages/verify-email/verify-email').then((m) => m.VerifyEmail),
  },
];

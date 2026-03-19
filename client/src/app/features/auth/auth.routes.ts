import { Routes } from '@angular/router';
import { Singin } from './pages/singin/singin';
import { Signup } from './pages/signup/signup';
import { Profile } from './pages/profile/profile';
import { Wishlist } from './pages/wishlist/wishlist';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Singin },
  { path: 'register', component: Signup },
  { path: 'profile', component: Profile },
  { path: 'wishlist', component: Wishlist },
];

import { Routes } from '@angular/router';
import { Login } from './pages/signin/signin';
import { Signup } from './pages/signup/signup';
import { Profile } from './pages/profile/profile';
import { Wishlist } from './pages/wishlist/wishlist';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Signup },
  { path: 'profile', component: Profile },
  { path: 'wishlist', component: Wishlist },
];

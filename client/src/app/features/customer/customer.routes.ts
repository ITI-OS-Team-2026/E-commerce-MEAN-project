import { Routes } from '@angular/router';
import { CustomerDashboard } from './pages/dashboard/dashboard-page';
import { CustomerOrders } from './pages/orders/orders-page';
import { CustomerProfile } from './pages/profile/profile-page';
import { CustomerWishlist } from './pages/wishlist/wishlist-page';

export const CUSTOMER_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: CustomerDashboard },
  { path: 'orders', component: CustomerOrders },
  { path: 'wishlist', component: CustomerWishlist },
  { path: 'profile', component: CustomerProfile },
];

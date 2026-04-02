import { Routes } from '@angular/router';
import { Onboarding } from './pages/onboarding/onboarding';
import { Inventory } from './pages/inventory/inventory';
import { SellerOrdersComponent } from './pages/orders/seller-orders.component';

export const SELLER_ROUTES: Routes = [
  { path: 'onboarding', component: Onboarding },
  { path: 'inventory', component: Inventory },
  { path: 'orders', component: SellerOrdersComponent }
];
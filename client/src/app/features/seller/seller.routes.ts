import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Inventory } from './pages/inventory/inventory';
import { ProductEntry } from './pages/product-entry/product-entry';
import { SellerOrdersComponent } from './pages/orders/seller-orders.component';

export const SELLER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'inventory', component: Inventory },
  { path: 'productEntry', component: ProductEntry },
  { path: 'orders', component: SellerOrdersComponent },
];
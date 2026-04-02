import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Inventory } from './pages/inventory/inventory';
import { ProductEntry } from './pages/product-entry/product-entry';

export const SELLER_ROUTES: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'inventory', component: Inventory },
  { path: 'productEntry', component: ProductEntry },

];
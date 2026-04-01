import { Routes } from '@angular/router';
import { Onboarding } from './pages/onboarding/onboarding';
import { Inventory } from './pages/inventory/inventory';
import { ProductEntry } from './pages/product-entry/product-entry';

export const SELLER_ROUTES: Routes = [
  { path: 'onboarding', component: Onboarding },
  { path: 'inventory', component: Inventory },
  { path: 'productEntry', component: ProductEntry },

];
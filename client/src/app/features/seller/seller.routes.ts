import { Routes } from '@angular/router';
import { Onboarding } from './pages/onboarding/onboarding';
import { Inventory } from './pages/inventory/inventory';

export const SELLER_ROUTES: Routes = [
  { path: 'onboarding', component: Onboarding },
  { path: 'inventory', component: Inventory }
];
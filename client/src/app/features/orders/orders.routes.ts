import { Routes } from '@angular/router';
import { Checkout } from './pages/checkout/checkout';
import { Success } from './pages/success/success';

export const ORDER_ROUTES: Routes = [
  { path: 'checkout', component: Checkout },
  { path: 'success', component: Success },
];

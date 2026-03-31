import { Routes } from '@angular/router';
import { Checkout } from './pages/checkout/checkout';
import { OrderHistory } from './pages/order-history/order-history';
import { OrderTrack } from './pages/order-track/order-track';
import { Placement } from './pages/placement/placement';

export const ORDER_ROUTES: Routes = [
  { path: 'checkout', component: Checkout },
  { path: 'history', component: OrderHistory },
  { path: 'track/:id', component: OrderTrack },
  { path: 'placement', component: Placement },
];

import { Routes } from '@angular/router';
import { Products } from './pages/products/products';
import { ProductDetails } from './pages/product-details/product-details';

export const PRODUCT_ROUTES: Routes = [
  { path: '', component: Products },
  { path: ':id', component: ProductDetails }
];
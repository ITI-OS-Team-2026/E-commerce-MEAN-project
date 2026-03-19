import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
      },
      {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./features/products/products.routes').then((m) => m.PRODUCT_ROUTES),
      },
      {
        path: 'cart',
        loadChildren: () => import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
      },
      {
        path: 'orders',
        loadChildren: () => import('./features/orders/orders.routes').then((m) => m.ORDER_ROUTES),
      },
    ],
  },
  {
    path: 'seller',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    loadChildren: () => import('./features/seller/seller.routes').then((m) => m.SELLER_ROUTES),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

import { Routes } from '@angular/router';
import { UsersManagement } from './pages/users-management/users-management';
import { CategoryManagement } from './pages/category-management/category-management';
import { OrderMonitor } from './pages/order-monitor/order-monitor';
import { ContentManagement } from './pages/content-management/content-management';

export const ADMIN_ROUTES: Routes = [
  { path: 'users', component: UsersManagement },
  { path: 'categories', component: CategoryManagement },
  { path: 'all-orders', component: OrderMonitor },
  { path: 'content', component: ContentManagement }
];
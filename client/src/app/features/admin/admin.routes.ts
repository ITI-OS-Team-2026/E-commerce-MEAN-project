import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard-page';
import { UsersManagement } from './pages/users-management/users-management';
import { CategoryManagement } from './pages/category-management/category-management';
import { OrderMonitor } from './pages/order-monitor/order-monitor';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardPage },
  { path: 'users', component: UsersManagement },
  { path: 'categories', component: CategoryManagement },
  { path: 'all-orders', component: OrderMonitor },
];

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { StatsCard } from '../../components/stats-card/stats-card';
import { DataTable } from '../../components/data-table/data-table';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader, StatsCard, DataTable],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css'
})
export class DashboardPage {
  stats = [
    { title: 'Total Users', value: '12,842', icon: '👥', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-600', change: 12, changeType: 'increase' as const },
    { title: 'Total Orders', value: '3,456', icon: '📦', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-600', change: 8, changeType: 'increase' as const },
    { title: 'Total Revenue', value: '$45,231', icon: '💰', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200', textColor: 'text-yellow-600', change: 15, changeType: 'increase' as const },
    { title: 'Active Sellers', value: '128', icon: '🏪', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-600', change: 5, changeType: 'decrease' as const }
  ];

  recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', amount: '$299.99', status: 'Delivered', date: '2026-03-28' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: '$159.99', status: 'Processing', date: '2026-03-27' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: '$450.50', status: 'Shipped', date: '2026-03-26' },
    { id: 'ORD-004', customer: 'Sarah Lee', amount: '$120.00', status: 'Pending', date: '2026-03-25' }
  ];
}

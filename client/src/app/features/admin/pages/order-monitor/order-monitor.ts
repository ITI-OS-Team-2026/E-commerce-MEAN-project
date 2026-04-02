import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';

@Component({
  selector: 'app-order-monitor',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader],
  templateUrl: './order-monitor.html',
  styleUrl: './order-monitor.css',
})
export class OrderMonitor {
  selectedStatus = signal('all');

  orders = [
    {
      id: 'ORD-10001',
      customer: 'John Doe',
      amount: '$299.99',
      status: 'Delivered',
      date: '2026-03-28',
      items: 3,
    },
    {
      id: 'ORD-10002',
      customer: 'Jane Smith',
      amount: '$159.99',
      status: 'Processing',
      date: '2026-03-27',
      items: 2,
    },
    {
      id: 'ORD-10003',
      customer: 'Mike Johnson',
      amount: '$450.50',
      status: 'Shipped',
      date: '2026-03-26',
      items: 5,
    },
    {
      id: 'ORD-10004',
      customer: 'Sarah Lee',
      amount: '$120.00',
      status: 'Pending',
      date: '2026-03-25',
      items: 1,
    },
    {
      id: 'ORD-10005',
      customer: 'David Wu',
      amount: '$780.25',
      status: 'Delivered',
      date: '2026-03-24',
      items: 4,
    },
    {
      id: 'ORD-10006',
      customer: 'Emily Brown',
      amount: '$220.75',
      status: 'Cancelled',
      date: '2026-03-23',
      items: 2,
    },
  ];

  get filteredOrders() {
    if (this.selectedStatus() === 'all') return this.orders;
    return this.orders.filter((o) => o.status.toLowerCase() === this.selectedStatus());
  }

  getStatusColor(status: string) {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  updateStatus(orderId: string, newStatus: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (order) {
      order.status = newStatus;
    }
  }
}

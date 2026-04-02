import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { Order, OrdersResponse } from '../../models/order.model';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-order-monitor',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader],
  templateUrl: './order-monitor.html',
  styleUrl: './order-monitor.css',
})
export class OrderMonitor implements OnInit {
  selectedStatus = signal('all');
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // ✅ Load orders from API
  loadOrders() {
    this.isLoading.set(true);
    this.orderService.getAllOrders().subscribe({
      next: (res: OrdersResponse) => {
        this.orders.set(res.orders);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load orders. Please try again.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  get filteredOrders() {
    if (this.selectedStatus() === 'all') return this.orders();
    return this.orders().filter((o) => o.status.toLowerCase() === this.selectedStatus());
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

  // ✅ Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // ✅ Get customer name
  getCustomerName(order: Order): string {
    return order.user.name;
  }

  // ✅ Get total items count
  getTotalItems(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

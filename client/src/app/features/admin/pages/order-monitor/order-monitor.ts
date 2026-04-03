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
  currentPage = signal(1);
  pageSize = signal(10);
  Math = Math;

  selectedOrder = signal<Order | null>(null);

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
        const errMsg = err?.error?.message || 'Failed to load orders. Please try again.';
        this.errorMessage.set(errMsg);
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  get filteredOrders() {
    if (this.selectedStatus() === 'all') return this.orders();
    return this.orders().filter((o) => o.status.toLowerCase() === this.selectedStatus());
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrders.length / this.pageSize());
  }

  get paginatedOrders() {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.filteredOrders.slice(start, start + this.pageSize());
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
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

  // ✅ View Order logic
  viewOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  closeOrderModal() {
    this.selectedOrder.set(null);
  }

  // ✅ Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // ✅ Get customer name
  getCustomerName(order: Order): string {
    return order.user?.name || 'Unknown';
  }

  // ✅ Get total items count
  getTotalItems(order: Order): number {
    return order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  }
}

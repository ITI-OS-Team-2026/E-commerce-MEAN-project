import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { CustomerOrderService, Order } from '../../services/customer-order.service';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [CommonModule, CustomerSidebar, CustomerHeader],
  templateUrl: './orders-page.html',
  styles: [],
})
export class CustomerOrders implements OnInit {
  private orderService = inject(CustomerOrderService);

  selectedStatus = signal('all');
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  Math = Math;

  selectedOrder = signal<Order | null>(null);

  statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
  ];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.orderService.getMyOrders().subscribe({
      next: (response) => {
        this.orders.set(response.orders || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.errorMessage.set(error?.error?.message || 'Failed to load orders');
        this.orders.set([]);
        this.isLoading.set(false);
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
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  filterByStatus(status: string) {
    this.selectedStatus.set(status);
    this.currentPage.set(1);
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

  viewOrder(order: Order) {
    this.selectedOrder.set(order);
  }

  closeOrderModal() {
    this.selectedOrder.set(null);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  getTotalItems(order: Order): number {
    return order.items ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  }
}

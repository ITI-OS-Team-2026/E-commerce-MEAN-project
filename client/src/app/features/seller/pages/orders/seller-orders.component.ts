import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SellerOrdersService } from '../../services/seller-orders.service';
import { Order, OrderStatus } from '../../models/order.models';
import { SellerOrderDetailComponent } from '../../components/order-detail/order-detail.component';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, SellerOrderDetailComponent],
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerOrdersComponent implements OnInit, OnDestroy {
  // Signals
  orders = signal<Order[]>([]);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  selectedOrder = signal<Order | null>(null);
  selectedStatusFilter = signal<OrderStatus | 'all'>('all');

  // Search and filter
  searchTerm$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  readonly orderStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // Computed signals
  filteredOrders = computed(() => {
    const allOrders = this.orders();
    const status = this.selectedStatusFilter();

    if (status === 'all') {
      return allOrders;
    }

    return allOrders.filter((order) => order.status === status);
  });

  totalOrders = computed(() => this.orders().length);
  filteredOrderCount = computed(() => this.filteredOrders().length);

  orderStatsComputed = computed(() => {
    const allOrders = this.orders();
    return {
      pending: allOrders.filter((o) => o.status === 'pending').length,
      confirmed: allOrders.filter((o) => o.status === 'confirmed').length,
      packed: allOrders.filter((o) => o.status === 'packed').length,
      shipped: allOrders.filter((o) => o.status === 'shipped').length,
      delivered: allOrders.filter((o) => o.status === 'delivered').length,
      cancelled: allOrders.filter((o) => o.status === 'cancelled').length,
    };
  });

  constructor(private sellerOrdersService: SellerOrdersService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all orders from the backend
   */
  private loadOrders(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sellerOrdersService
      .getAllOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.orders.set(response.orders);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load orders:', error);
          this.errorMessage.set(
            error.error?.message || 'Failed to load orders. Please try again.'
          );
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Setup search listener with debounce
   */
  private setupSearchListener(): void {
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((searchTerm) => {
        if (!searchTerm.trim()) {
          this.loadOrders();
          return;
        }

        // Client-side search implementation
        // You can also implement server-side search with a new endpoint
        const lowercaseSearch = searchTerm.toLowerCase();
        const filtered = this.orders().filter(
          (order) =>
            order._id.toLowerCase().includes(lowercaseSearch) ||
            order.user.name.toLowerCase().includes(lowercaseSearch) ||
            order.user.email.toLowerCase().includes(lowercaseSearch)
        );

        this.orders.set(filtered);
      });
  }

  /**
   * Handle search input
   */
  onSearchChange(term: string): void {
    this.searchTerm$.next(term);
  }

  /**
   * Handle status filter change
   */
  onStatusFilterChange(status: OrderStatus | 'all'): void {
    this.selectedStatusFilter.set(status);
  }

  /**
   * Handle order selection
   */
  selectOrder(order: Order): void {
    this.selectedOrder.set(order);
  }

  /**
   * Close order detail view
   */
  closeOrderDetail(): void {
    this.selectedOrder.set(null);
  }

  /**
   * Refresh the orders list
   */
  refreshOrders(): void {
    this.loadOrders();
  }

  /**
   * Handle successful status update from child component
   */
  onOrderStatusUpdated(updatedOrder: Order): void {
    const updatedOrders = this.orders().map((order) =>
      order._id === updatedOrder._id ? updatedOrder : order
    );
    this.orders.set(updatedOrders);
    this.selectedOrder.set(updatedOrder);
  }

  /**
   * Format date for display
   */
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'packed':
        return 'status-packed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }
}

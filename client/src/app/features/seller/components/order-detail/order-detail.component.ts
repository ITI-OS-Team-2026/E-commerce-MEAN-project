import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderStatus } from '../../models/order.models';
import { SellerOrdersService } from '../../services/seller-orders.service';

@Component({
  selector: 'app-seller-order-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerOrderDetailComponent implements OnInit {
  @Input() order!: Order;
  @Output() close = new EventEmitter<void>();
  @Output() statusUpdated = new EventEmitter<Order>();

  statusForm!: FormGroup;
  isUpdating = signal(false);
  updateError = signal<string | null>(null);
  updateSuccess = signal(false);

  readonly orderStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'packed',
    'shipped',
    'delivered',
    'cancelled',
  ];

  constructor(
    private fb: FormBuilder,
    private sellerOrdersService: SellerOrdersService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the status update form
   */
  private initializeForm(): void {
    this.statusForm = this.fb.group({
      status: [this.order.status, [Validators.required]],
    });
  }

  /**
   * Handle form submission
   */
  onSubmitStatusUpdate(): void {
    if (this.statusForm.invalid || this.isUpdating()) {
      return;
    }

    const newStatus = this.statusForm.get('status')?.value;

    this.isUpdating.set(true);
    this.updateError.set(null);
    this.updateSuccess.set(false);

    this.sellerOrdersService.updateOrderStatus(this.order._id, { status: newStatus }).subscribe({
      next: (response) => {
        this.isUpdating.set(false);
        this.updateSuccess.set(true);
        this.statusUpdated.emit(response.order);

        // Hide success message after 2 seconds
        setTimeout(() => {
          this.updateSuccess.set(false);
        }, 2000);
      },
      error: (error) => {
        this.isUpdating.set(false);
        this.updateError.set(
          error.error?.message || 'Failed to update order status. Please try again.'
        );
      },
    });
  }

  /**
   * Check if status can be changed to a specific status
   */
  canChangeToStatus(status: OrderStatus): boolean {
    // Prevent changing cancelled status
    if (this.order.status === 'cancelled' && status !== 'cancelled') {
      return false;
    }
    
    // Prevent changing delivered status (it's final)
    if (this.order.status === 'delivered' && status !== 'delivered') {
      return false;
    }

    // Prevent backwards progression
    const currentIdx = this.orderStatuses.indexOf(this.order.status);
    const targetIdx = this.orderStatuses.indexOf(status);

    return targetIdx >= currentIdx;
  }

  /**
   * Close the detail modal
   */
  closeModal(): void {
    this.close.emit();
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  /**
   * Format date
   */
  formatDate(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get status color
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

  /**
   * Get product image from populatedProducts array
   */
  getProductImage(productId: string | any): string {
    const id = typeof productId === 'string' ? productId : productId?._id;
    const product = (this.order as any).populatedProducts?.find((p: any) => p._id === id);
    return product?.images?.[0] || 'https://via.placeholder.com/50';
  }
}

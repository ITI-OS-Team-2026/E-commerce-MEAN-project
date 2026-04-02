import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from "../../../../../environments/environment.development";
import { Logo } from '../../../../shared/components/logo/logo';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Order, OrderHistoryResponse } from '../../models/order-history-models'

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule, Logo, RouterModule],
  templateUrl: './order-history.html',
  styleUrl: './order-history.css',
})
export class OrderHistory implements OnInit {
  orders: Order[] = [];
  token: string | null = '';
  paymentSuccessMessage: string | null = null;

  searchTerm: string = '';
  statusFilter: string = 'All Statuses';

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.token = this.storageService.getToken();
  }

  ngOnInit() {
    const paymentState = this.route.snapshot.queryParamMap.get('payment');
    if (paymentState === 'success') {
      this.paymentSuccessMessage = 'Payment is successful. Your order has been placed.';

      // Remove query parameter to avoid repeating the banner on refresh.
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { payment: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    if (!this.token) {
      console.error('No token found, cannot fetch orders');
      return;
    }

    const backendUrl = environment.apiUrl + "/orders";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<OrderHistoryResponse>(backendUrl, { headers }).subscribe({
      next: (response) => {
        this.orders = response.orders;
        this.cdr.detectChanges();
        console.log('UI updated with orders:', this.orders);
      },
      error: (error) => {
        console.error('Error fetching orders', error);
      }
    });
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order => {
      const matchesSearch = !this.searchTerm ||
        // order._id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.items.some(i => i.product.name.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesStatus = this.statusFilter === 'All Statuses' ||
        order.status.toLowerCase() === this.statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }

  getTotalSpent(): number {
    return this.filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }

  getActiveShipments(): number {
    return this.filteredOrders.filter(order => ['processing', 'pending', 'shipped'].includes(order.status)).length;
  }
}
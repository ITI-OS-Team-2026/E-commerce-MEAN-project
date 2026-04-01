import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../core/services/storage.service';
import { environment } from "../../../../../environments/environment.development";
import { Logo } from '../../../../shared/components/logo/logo';
import { RouterModule } from '@angular/router';

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
  
  searchTerm: string = '';
  statusFilter: string = 'All Statuses';

  constructor(
    private http: HttpClient, 
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {
    this.token = this.storageService.getToken();
  }

  ngOnInit() {
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

interface OrderHistoryResponse {
  results: number;
  orders: Order[];
}

interface Order {
  shippingAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      zip: string;
  };
  _id: string;
  user: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  trackingHistory: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrderItem {
  product: {
      _id: string;
      name: string;
      price: number;
      id: string;
  };
  quantity: number;
  price: number;
}

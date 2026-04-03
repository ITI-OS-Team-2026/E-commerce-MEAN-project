import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';
import { UserService } from '../../services/user-service';
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  adminUser: { name?: string; email?: string } | null = null;

  totalUsers = signal(0);
  totalOrders = signal(0);
  totalRevenue = signal(0);
  activeSellers = signal(0);

  constructor(
    private storageService: StorageService,
    private userService: UserService,
    private orderService: OrderService
  ) {
    this.adminUser = this.storageService.getUser();
  }

  ngOnInit(): void {
    // Load users
    this.userService.getUsersList().subscribe({
      next: (res) => {
        this.totalUsers.set(res.users?.length || 0);
        this.activeSellers.set(
          res.users?.filter((u: any) => u.role === 'seller' && u.isActive && u.isApproved).length || 0
        );
      },
      error: (err) => console.error('Failed to load users for dashboard', err)
    });

    // Load orders
    this.orderService.getAllOrders().subscribe({
      next: (res) => {
        const orders = res.orders || [];
        this.totalOrders.set(orders.length);
        this.totalRevenue.set(orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0));
      },
      error: (err) => console.error('Failed to load orders for dashboard', err)
    });
  }
}

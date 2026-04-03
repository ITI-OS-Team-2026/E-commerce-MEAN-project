import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerSidebar, CustomerHeader],
  templateUrl: './dashboard-page.html',
  styles: [],
})
export class CustomerDashboard implements OnInit {
  customerUser: { name?: string; email?: string } | null = null;

  recentOrders = signal<any[]>([]);
  totalOrders = signal(0);
  totalSpent = signal(0);
  wishlistCount = signal(0);

  constructor(private storageService: StorageService) {
    this.customerUser = this.storageService.getUser();
  }

  ngOnInit(): void {
    // Load customer dashboard data
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    // This will be populated with actual API calls
    // For now, showing empty state
    this.recentOrders.set([]);
    this.totalOrders.set(0);
    this.totalSpent.set(0);
    this.wishlistCount.set(0);
  }
}

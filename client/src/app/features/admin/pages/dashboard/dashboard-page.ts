import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage {
  adminUser: { name?: string; email?: string } | null = null;

  // simple important info
  importantInfo = [
    { label: 'Total Users', value: '12,842' },
    { label: 'Total Orders', value: '3,456' },
    { label: 'Total Revenue', value: '$45,231' },
    { label: 'Active Sellers', value: '128' },
  ];

  constructor(private storageService: StorageService) {
    this.adminUser = this.storageService.getUser();
  }
}

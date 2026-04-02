import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  isCollapsed = signal(false);
  mobileOpen = signal(false);

  menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/seller/dashboard' },
    { label: 'Inventory', icon: '🗃️', path: '/seller/inventory' },
    { label: 'Orders', icon: '📦', path: '/seller/orders' },
    { label: 'Add Product', icon: '➕', path: '/seller/productEntry' },
  ];

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) { }

  toggleSidebar(): void {
    this.isCollapsed.update((val) => !val);
  }

  toggleMobile(): void {
    this.mobileOpen.update((val) => !val);
  }

  logout(): void {
    this.storageService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

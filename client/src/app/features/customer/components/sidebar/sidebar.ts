import { Component, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styles: [],
})
export class CustomerSidebar {
  isCollapsed = signal(false);
  mobileOpen = signal(false);

  menuItems = [
    { label: 'Home', icon: '🏠', path: '/' },
    { label: 'Dashboard', icon: '📊', path: '/customer/dashboard' },
    { label: 'My Orders', icon: '📦', path: '/customer/orders' },
    { label: 'Wishlist', icon: '❤️', path: '/customer/wishlist' },
    { label: 'Profile', icon: '👤', path: '/customer/profile' },
  ];

  constructor(
    private storageService: StorageService,
    private router: Router,
  ) {}

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

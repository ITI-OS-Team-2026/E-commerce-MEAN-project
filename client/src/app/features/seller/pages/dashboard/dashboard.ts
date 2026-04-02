import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { StorageService } from '../../../../core/services/storage.service';
import { Logo } from '../../../../shared/components/logo/logo';
import { Router, RouterLink } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Logo, RouterLink, Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  sellerUser: any = {};
  products: any[] = [];
  totalProducts = 0;
  totalRevenue = 0; // Placeholder, calculate from products or orders
  activeOrders = 0; // Placeholder

  constructor(
    private inventoryService: InventoryService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit() {
    this.loadSellerInfo();
    this.loadProducts();
  }

  loadSellerInfo() {
    const token = this.storageService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.sellerUser = {
        name: payload.name,
        userId: payload.userId,
        role: payload.role,
        isApproved: payload.isApproved
      };
    }
  }

  loadProducts() {
    this.inventoryService.getSellerProducts().subscribe({
      next: (response) => {
        this.products = response.data.products;
        this.totalProducts = this.products.length;
        // Calculate total revenue if price is available
        this.totalRevenue = this.products.reduce((sum, product) => sum + (product.price || 0), 0);
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('Error loading products', error);
      }
    });
  }

  logout(): void {
    this.storageService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

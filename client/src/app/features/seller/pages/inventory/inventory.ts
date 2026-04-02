import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Logo } from '../../../../shared/components/logo/logo';
import { RouterLink } from "@angular/router";
import { InventoryService } from '../../services/inventory.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [Logo, RouterLink, CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  products: any[] = [];
  isLoading = true;

  totalProducts = 0;
  lowStockCount = 0;
  inventoryValue = 0;
  newThisMonthCount = 0;

  searchQuery = '';
  errorMessage = '';

  currentPage = 1;
  pageSize = 5;
  pageNumbersList: number[] = [];

  constructor(
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('DEBUG: Inventory.loadProducts() started');
    this.isLoading = true;
    this.errorMessage = '';

    this.inventoryService.getSellerProducts().subscribe({
      next: (response) => {
        this.products = response.data?.products || [];
        this.calculateStats();
        this.updatePageNumbers();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err.message || 'An unexpected error occurred while loading your inventory.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateStats(): void {
    this.totalProducts = this.products.length;
    this.lowStockCount = this.products.filter(p => p.stock < 10).length;
    this.inventoryValue = this.products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    this.newThisMonthCount = this.products.filter(p => {
      const createdDate = p.createdAt ? new Date(p.createdAt) : new Date();
      return createdDate >= firstDayOfMonth;
    }).length;
  }

  get filteredProducts(): any[] {
    let result = this.products;
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      result = this.products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.category?.name && p.category.name.toLowerCase().includes(query)) ||
        (p._id && p._id.toLowerCase().includes(query))
      );
    }
    return result;
  }

  updatePageNumbers(): void {
    const total = Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
    this.pageNumbersList = Array.from({ length: total }, (_, i) => i + 1);
  }

  get pagedProducts(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return this.pageNumbersList.length;
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.updatePageNumbers();
  }

  logout(): void {
    this.storageService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../products/services/product.service';
import { Product } from '../../../products/models/product.models';

@Component({
  selector: 'app-new-arrivals',
  imports: [CommonModule, RouterLink],
  templateUrl: './new-arrivals.html',
  styleUrl: './new-arrivals.css',
})
export class NewArrivals {
  private productService = inject(ProductService);

  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  private refetchTrigger = signal(0);

  constructor() {
    effect(() => {
      this.refetchTrigger();
      this.loadNewArrivals();
    });
  }

  private loadNewArrivals(): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService
      .getProducts({
        sort: '-createdAt', 
        limit: 4,
        page: 1,
      })
      .subscribe({
        next: (response) => {
          const activeProducts = response.data.products.filter((p) => p.isdeleted === null);
          this.products.set(activeProducts);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading new arrivals:', err);
          this.error.set('Failed to load new arrivals. Please try again later.');
          this.loading.set(false);
        },
      });
  }

  retry(): void {
    this.refetchTrigger.update((v) => v + 1);
  }
}

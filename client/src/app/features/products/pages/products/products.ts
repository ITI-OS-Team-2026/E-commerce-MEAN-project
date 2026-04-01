import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { ProductsPageAside } from '../../components/products-page-aside/products-page-aside';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.models';
import { Category } from '../../models/category.models';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink, Footer, Navbar, ProductsPageAside],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  sortBy = signal('newest');
  selectedCategory = signal('');
  priceRange = signal({ min: 0, max: 2500 });

  private refetchTrigger = signal(0);

  sortParam = computed(() => this.getSortParam(this.sortBy()));
  filteredProducts = computed(() => {
    return this.products().filter((p) => p.isdeleted === null);
  });

  constructor() {
    this.loadCategories();

    effect(() => {
      this.refetchTrigger(); // Create dependency
      this.performFetch();
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  private performFetch(): void {
    this.loading.set(true);
    this.error.set(null);

    const query = {
      sort: this.sortParam(),
      page: 1,
      limit: 12,
      category: this.selectedCategory() || undefined,
      minPrice: this.priceRange().min > 0 ? this.priceRange().min : undefined,
      maxPrice: this.priceRange().max < 2500 ? this.priceRange().max : undefined,
    };

    this.productService.getProducts(query).subscribe({
      next: (response) => {
        this.products.set(response.data.products);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.error.set('Failed to load products. Please try again.');
        this.loading.set(false);
      },
    });
  }

  onSortChange(sort: string): void {
    this.sortBy.set(sort);
    this.refetchTrigger.update((v) => v + 1);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.refetchTrigger.update((v) => v + 1);
  }

  onPriceChange(min: number, max: number): void {
    this.priceRange.set({ min, max });
    this.refetchTrigger.update((v) => v + 1);
  }

  fetchProducts(): void {
    this.refetchTrigger.update((v) => v + 1);
  }

  private getSortParam(sortBy: string): string {
    switch (sortBy) {
      case 'price-low':
        return 'price';
      case 'price-high':
        return '-price';
      case 'popular':
        return '-rating';
      default:
        return '-createdAt';
    }
  }
}

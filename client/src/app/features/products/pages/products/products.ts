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
  currentPage = signal(1);

  private itemsPerPage = 10;
  private refetchTrigger = signal(0);
  private lastFetchResultCount = signal(0);

  sortParam = computed(() => this.getSortParam(this.sortBy()));
  filteredProducts = computed(() => {
    return this.products().filter((p) => p.isdeleted === null);
  });
  hasNextPage = computed(() => {
    return this.lastFetchResultCount() === this.itemsPerPage;
  });
  canGoToPreviousPage = computed(() => this.currentPage() > 1);

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

    // Build query object with only defined properties
    const query: any = {
      sort: this.sortParam(),
      page: this.currentPage(),
      limit: this.itemsPerPage,
    };

    // Only add category if selected
    if (this.selectedCategory() && this.selectedCategory() !== '') {
      query.category = this.selectedCategory();
    }

    // Only add minPrice if greater than 0
    if (this.priceRange().min > 0) {
      query.minPrice = this.priceRange().min;
    }

    // Only add maxPrice if less than 2500
    if (this.priceRange().max < 2500) {
      query.maxPrice = this.priceRange().max;
    }

    console.log('Fetching products with query (Page: ' + this.currentPage() + '):', query);

    this.productService.getProducts(query).subscribe({
      next: (response) => {
        const fetchedProducts = response.data.products;
        console.log(
          'Products fetched successfully on page ' + this.currentPage() + ':',
          fetchedProducts.length,
        );
        this.lastFetchResultCount.set(fetchedProducts.length);
        this.products.set(fetchedProducts);
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
    this.currentPage.set(1);
    this.refetchTrigger.update((v) => v + 1);
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
    this.refetchTrigger.update((v) => v + 1);
  }

  onPriceChange(min: number, max: number): void {
    this.priceRange.set({ min, max });
    this.currentPage.set(1);
    this.refetchTrigger.update((v) => v + 1);
  }

  goToNextPage(): void {
    if (this.hasNextPage()) {
      this.currentPage.update((p) => p + 1);
      this.refetchTrigger.update((v) => v + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToPreviousPage(): void {
    if (this.canGoToPreviousPage()) {
      this.currentPage.update((p) => p - 1);
      this.refetchTrigger.update((v) => v + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  fetchProducts(): void {
    this.currentPage.set(1);
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

import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { ProductsPageAside } from '../../components/products-page-aside/products-page-aside';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CustomerUserService } from '../../../customer/services/customer-user.service';
import { StorageService } from '../../../../core/services/storage.service';
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
  private customerUserService = inject(CustomerUserService);
  private storageService = inject(StorageService);

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  sortBy = signal('newest');
  selectedCategory = signal('');
  priceRange = signal({ min: 0, max: 2500 });

  currentPage = signal(1);
  pageSize = signal(12);
  totalProducts = signal(0);
  wishlistLoading = signal<string[]>([]);
  wishlistIds = signal<string[]>([]);
  wishlistMessage = signal<string | null>(null);
  wishlistError = signal<string | null>(null);
  starIndexes = [1, 2, 3, 4, 5];
  totalPages = computed(() => Math.ceil(this.totalProducts() / this.pageSize()) || 1);

  sortParam = computed(() => this.getSortParam(this.sortBy()));

  constructor() {
    this.loadCategories();
    this.loadWishlistIds();

    // Effect reads all reactive params directly — Angular tracks exactly these
    // signals as dependencies and re-runs whenever any of them changes.
    effect(() => {
      const sort = this.sortParam();
      const category = this.selectedCategory();
      const priceMin = this.priceRange().min;
      const priceMax = this.priceRange().max;
      const page = this.currentPage();
      const limit = this.pageSize();

      this.fetchWithParams({ sort, category, priceMin, priceMax, page, limit });
    });
  }

  private loadWishlistIds(): void {
    const token = this.storageService.getToken();
    const currentUser = this.storageService.getUser();

    if (!token || currentUser?.role !== 'customer') {
      this.wishlistIds.set([]);
      return;
    }

    this.customerUserService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistIds.set((response.wishlist || []).map((item) => item._id));
      },
      error: () => {
        this.wishlistIds.set([]);
      },
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

  private fetchWithParams(params: {
    sort: string;
    category: string;
    priceMin: number;
    priceMax: number;
    page: number;
    limit: number;
  }): void {
    this.loading.set(true);
    this.error.set(null);

    const query: any = {
      sort: params.sort,
      page: params.page,
      limit: params.limit,
    };

    if (params.category) {
      query.category = params.category;
    }
    if (params.priceMin > 0) {
      query.minPrice = params.priceMin;
    }
    if (params.priceMax < 2500) {
      query.maxPrice = params.priceMax;
    }

    this.productService.getProducts(query).subscribe({
      next: (response) => {
        this.products.set(response.data.products);
        // Use total if present; fall back to results (page count) when absent
        this.totalProducts.set(response.total ?? response.results ?? 0);
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
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    this.currentPage.set(1);
  }

  onPriceChange(min: number, max: number): void {
    this.priceRange.set({ min, max });
    this.currentPage.set(1);
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
      // Effect re-runs automatically because currentPage is a tracked dependency
    }
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }

  retryFetch(): void {
    this.fetchWithParams({
      sort: this.sortParam(),
      category: this.selectedCategory(),
      priceMin: this.priceRange().min,
      priceMax: this.priceRange().max,
      page: this.currentPage(),
      limit: this.pageSize(),
    });
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

  addToWishlist(productId: string): void {
    const token = this.storageService.getToken();
    const currentUser = this.storageService.getUser();

    if (!token) {
      this.wishlistError.set('Please login first to add products to wishlist.');
      setTimeout(() => this.wishlistError.set(null), 3000);
      return;
    }

    if (currentUser?.role !== 'customer') {
      this.wishlistError.set('Only customers can use wishlist.');
      setTimeout(() => this.wishlistError.set(null), 3000);
      return;
    }

    this.wishlistError.set(null);
    this.wishlistMessage.set(null);
    this.wishlistLoading.update((ids) => [...ids, productId]);

    this.customerUserService.addToWishlist(productId).subscribe({
      next: () => {
        this.wishlistLoading.update((ids) => ids.filter((id) => id !== productId));
        this.wishlistIds.update((ids) => (ids.includes(productId) ? ids : [...ids, productId]));
        this.wishlistMessage.set('Product added to wishlist.');
        setTimeout(() => this.wishlistMessage.set(null), 3000);
      },
      error: (err) => {
        this.wishlistLoading.update((ids) => ids.filter((id) => id !== productId));
        this.wishlistError.set(err?.error?.message || 'Failed to add product to wishlist.');
        setTimeout(() => this.wishlistError.set(null), 3000);
      },
    });
  }

  removeFromWishlist(productId: string): void {
    const token = this.storageService.getToken();
    const currentUser = this.storageService.getUser();

    if (!token) {
      this.wishlistError.set('Please login first.');
      setTimeout(() => this.wishlistError.set(null), 3000);
      return;
    }

    if (currentUser?.role !== 'customer') {
      this.wishlistError.set('Only customers can use wishlist.');
      setTimeout(() => this.wishlistError.set(null), 3000);
      return;
    }

    this.wishlistError.set(null);
    this.wishlistMessage.set(null);
    this.wishlistLoading.update((ids) => [...ids, productId]);

    this.customerUserService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistLoading.update((ids) => ids.filter((id) => id !== productId));
        this.wishlistIds.update((ids) => ids.filter((id) => id !== productId));
        this.wishlistMessage.set('Product removed from wishlist.');
        setTimeout(() => this.wishlistMessage.set(null), 3000);
      },
      error: (err) => {
        this.wishlistLoading.update((ids) => ids.filter((id) => id !== productId));
        this.wishlistError.set(err?.error?.message || 'Failed to remove product from wishlist.');
        setTimeout(() => this.wishlistError.set(null), 3000);
      },
    });
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistIds().includes(productId);
  }

  isWishlistLoading(productId: string): boolean {
    return this.wishlistLoading().includes(productId);
  }

  getRatingValue(rating?: number): number {
    return Math.max(0, Math.min(5, rating ?? 0));
  }

  getStarType(rating: number | undefined, starIndex: number): 'full' | 'half' | 'empty' {
    const normalized = this.getRatingValue(rating);
    const fullStars = Math.floor(normalized);
    const hasHalfStar = normalized - fullStars >= 0.5;

    if (starIndex <= fullStars) {
      return 'full';
    }

    if (starIndex === fullStars + 1 && hasHalfStar) {
      return 'half';
    }

    return 'empty';
  }
}

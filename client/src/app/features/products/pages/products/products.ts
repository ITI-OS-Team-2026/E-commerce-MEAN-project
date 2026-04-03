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
      sort: this.sortParam(),
      page: this.currentPage(),
      limit: this.itemsPerPage,
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
}

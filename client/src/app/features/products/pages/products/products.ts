import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
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
export class Products implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  error: string | null = null;
  sortBy = 'newest';
  selectedCategory: string = '';
  priceRange = { min: 0, max: 2500 };

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.fetchProducts();
  }

  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          this.cdr.detectChanges();
        },
      });
  }

  fetchProducts(): void {
    this.loading = true;
    this.error = null;

    const query = {
      sort: this.getSortParam(this.sortBy),
      page: 1,
      limit: 12,
      category: this.selectedCategory || undefined,
      minPrice: this.priceRange.min > 0 ? this.priceRange.min : undefined,
      maxPrice: this.priceRange.max < 2500 ? this.priceRange.max : undefined,
    };

    this.productService
      .getProducts(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Filter out soft-deleted products
          this.products = response.data.products.filter((p) => p.isdeleted === null);
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching products:', err);
          this.error = 'Failed to load products. Please try again.';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSortChange(sort: string): void {
    this.sortBy = sort;
    this.fetchProducts();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.fetchProducts();
  }

  onPriceChange(min: number, max: number): void {
    this.priceRange = { min, max };
    this.fetchProducts();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

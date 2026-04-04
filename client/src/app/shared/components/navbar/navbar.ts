import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Logo } from '../logo/logo';
import { ProductService } from '../../../features/products/services/product.service';
import { Product } from '../../../features/products/models/product.models';
import { CartService } from '../../../features/cart/services/cart.service';
import { StorageService } from '../../../core/services/storage.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule, Logo, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  searchQuery: string = '';
  searchResults: Product[] = [];
  showResults: boolean = false;
  showSearchBar: boolean = false;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  cartItemsCount: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.initCartCount();
      this.loadCartCount();
    }

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query.trim().length > 0) {
          this.performSearch(query);
        } else {
          this.searchResults = [];
          this.showResults = false;
        }
      });
  }

  onSearchInput(query: string): void {
    this.searchQuery = query;
    this.searchSubject.next(query);
  }

  performSearch(query: string): void {
    this.productService
      .getProducts({ search: query, limit: 5 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.searchResults = response.data.products
            .filter((p) => p.isdeleted === null)
            .slice(0, 5);
          this.showResults = this.searchResults.length > 0;
        },
        error: (err) => {
          console.error('Search error:', err);
          this.searchResults = [];
          this.showResults = false;
        },
      });
  }

  selectProduct(product: Product): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showResults = false;
    this.router.navigate(['/products', product._id]);
  }

  onSearchBlur(): void {
    // Close dropdown after a small delay to allow click on results
    setTimeout(() => {
      this.showResults = false;
    }, 200);
  }

  toggleSearchBar(): void {
    this.showSearchBar = !this.showSearchBar;
    if (this.showSearchBar) {
      // Focus the search input when opened (small delay to ensure DOM is updated)
      setTimeout(() => {
        const searchInput = document.querySelector('.mobile-search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      this.searchQuery = '';
      this.searchResults = [];
      this.showResults = false;
    }
  }

  initCartCount(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cartService.updateCartCount(response.data.itemsCount);
        },
        error: (err) => { }
      });
  }

  loadCartCount(): void {
    this.cartService.cartCount
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.cartItemsCount = count;
        },
        error: (err) => { }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

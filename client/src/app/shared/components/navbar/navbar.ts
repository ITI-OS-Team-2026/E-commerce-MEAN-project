import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Logo } from '../logo/logo';
import { ProductService } from '../../../features/products/services/product.service';
import { Product } from '../../../features/products/models/product.models';
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
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

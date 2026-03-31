import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { CartService } from '../../services/cart.service';
import { Cart as CartModel } from '../../models/cart.models';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit, OnDestroy {
  cart: CartModel | null = null;
  isLoading = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getCart();
  }

  getCart(): void {
    this.isLoading = true;
    this.error = null;
    
    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cart = response.data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // If a 404 is returned for an empty cart, we can handle it safely
          if (err.status === 404) {
            this.cart = null;
            this.error = null;
          } else {
            this.error = 'Failed to load cart. Please try again.';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  removeItem(productId: string): void {
    this.isLoading = true;
    this.cartService
      .removeFromCart(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cart = response.data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to remove item.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  updateQty(productId: string, quantity: number): void {
    if (quantity < 1) return;
    
    this.isLoading = true;
    this.cartService
      .updateQuantity(productId, { quantity })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.cart = response.data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Failed to update quantity.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

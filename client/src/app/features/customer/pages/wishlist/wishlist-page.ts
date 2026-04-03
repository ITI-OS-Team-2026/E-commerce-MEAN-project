import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';
import { CustomerUserService } from '../../services/customer-user.service';
import { CartService } from '../../../cart/services/cart.service';
import { WishlistProduct } from '../../services/customer-user.service';

@Component({
  selector: 'app-customer-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerSidebar, CustomerHeader],
  templateUrl: './wishlist-page.html',
  styles: [],
})
export class CustomerWishlist implements OnInit {
  private userService = inject(CustomerUserService);
  private cartService = inject(CartService);

  wishlistItems = signal<WishlistProduct[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit(): void {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getWishlist().subscribe({
      next: (response) => {
        this.wishlistItems.set(response.wishlist || []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading wishlist:', error);
        this.errorMessage.set(error?.error?.message || 'Failed to load wishlist');
        this.wishlistItems.set([]);
        this.isLoading.set(false);
      },
    });
  }

  removeFromWishlist(productId: string): void {
    this.userService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.set(this.wishlistItems().filter((item) => item._id !== productId));
        this.successMessage.set('Removed from wishlist');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error removing from wishlist:', error);
        this.errorMessage.set('Failed to remove from wishlist');
      },
    });
  }

  addToCart(product: WishlistProduct): void {
    const productId = product._id;
    this.cartService.addToCart({ productId, quantity: 1 }).subscribe({
      next: () => {
        this.successMessage.set('Added to cart');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.errorMessage.set('Failed to add to cart');
      },
    });
  }
}

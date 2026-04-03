import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerSidebar } from '../../components/sidebar/sidebar';
import { CustomerHeader } from '../../components/header/header';

@Component({
  selector: 'app-customer-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, CustomerSidebar, CustomerHeader],
  templateUrl: './wishlist-page.html',
  styles: [],
})
export class CustomerWishlist implements OnInit {
  wishlistItems = signal<any[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    this.isLoading.set(true);
    // Load wishlist items from API - to be implemented
    this.wishlistItems.set([]);
    this.isLoading.set(false);
  }

  removeFromWishlist(itemId: string): void {
    this.wishlistItems.set(this.wishlistItems().filter((item) => item.id !== itemId));
  }

  addToCart(item: any): void {
    // Add to cart logic - to be implemented
    console.log('Adding to cart:', item);
  }
}

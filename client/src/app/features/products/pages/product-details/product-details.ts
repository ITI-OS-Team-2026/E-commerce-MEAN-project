import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';
import { CartService } from '../../../cart/services/cart.service';
import { StorageService } from '../../../../core/services/storage.service';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, Footer, Navbar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cartService = inject(CartService);
  private storageService = inject(StorageService);
  private reviewService = inject(ReviewService);

  // Signals for state management
  product = signal<Product | null>(null);
  relatedProducts = signal<Product[]>([]);
  loading = signal(true);
  relatedLoading = signal(false);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);
  quantity = signal(1);
  currentSlideIndex = signal(0);
  addingToCart = signal(false);
  addToCartError = signal<string | null>(null);
  itemInCartQty = signal(0);

  // Computed values
  currentImage = computed(() => this.product()?.images?.[this.selectedImageIndex()] || '');
  canNextSlide = computed(() => this.currentSlideIndex() < this.relatedProducts().length - 4);
  canPrevSlide = computed(() => this.currentSlideIndex() > 0);

  // Review Signals
  reviews = signal<Review[]>([]);
  reviewsLoading = signal(false);
  reviewsError = signal<string | null>(null);
  userReview = signal<Review | null>(null);
  showReviewForm = signal(false);
  editMode = signal(false);
  formRating = signal(5);
  formComment = signal('');
  formSubmitting = signal(false);
  formError = signal<string | null>(null);
  starIndexes = [1, 2, 3, 4, 5];

  // Review Computed
  averageRating = computed(() => {
    const revs = this.reviews();
    if (revs.length === 0) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return sum / revs.length;
  });
  totalReviews = computed(() => this.reviews().length);
  canReview = computed(() => {
    const isLoggedIn = this.storageService.isLoggedIn();
    return isLoggedIn && !this.userReview();
  });

  constructor() {
    // Watch for route param changes and load product
    effect(() => {
      const productId = this.route.snapshot.params['id'];
      if (productId) {
        this.loadProduct(productId);
        this.loadReviews(productId);
      } else {
        this.error.set('Product ID not found');
        this.loading.set(false);
      }
    });

    // Load related products when product changes
    effect(() => {
      if (this.product()) {
        this.loadRelatedProducts();
      }
    });
  }

  private loadProduct(productId: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.productService.getProductById(productId).subscribe({
      next: (response) => {
        const loadedProduct = response.data;

        // Filter if product is soft deleted
        if (loadedProduct?.isdeleted !== null) {
          this.error.set('Product not found or has been deleted');
          this.product.set(null);
        } else {
          this.product.set(loadedProduct);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.error.set(err?.error?.message || 'Failed to load product details');
        this.loading.set(false);
      },
    });
  }

  private loadRelatedProducts(): void {
    const currentProduct = this.product();
    if (!currentProduct) return;

    const categoryId =
      typeof currentProduct.category === 'string'
        ? currentProduct.category
        : currentProduct.category?._id;

    if (!categoryId) return;

    this.relatedLoading.set(true);

    this.productService.getProducts({ category: categoryId, limit: 10 }).subscribe({
      next: (response) => {
        // Filter soft-deleted products, exclude current product, take last 4-10 products
        const filtered = response.data.products
          .filter((p) => p.isdeleted === null && p._id !== currentProduct._id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10);

        this.relatedProducts.set(filtered);
        this.relatedLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
        this.relatedProducts.set([]);
        this.relatedLoading.set(false);
      },
    });
  }

  selectImage(index: number): void {
    const product = this.product();
    if (product?.images && index < product.images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  increaseQuantity(): void {
    const product = this.product();
    if (product && this.quantity() < product.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQuantity(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.addingToCart.set(true);
    this.addToCartError.set(null);

    this.cartService.addToCart({ productId: product._id, quantity: this.quantity() }).subscribe({
      next: () => {
        this.cartService.getCart().subscribe({
          next: (response) => {
            this.cartService.updateCartCount(response.data.itemsCount);
            const cartItem = response.data.items.find((item: any) =>
              typeof item.product === 'string'
                ? item.product === product._id
                : item.product?._id === product._id,
            );
            if (cartItem) {
              this.itemInCartQty.set(cartItem.quantity);
            }
            this.addingToCart.set(false);
          },
          error: (err) => {
            this.addToCartError.set('Failed to add to cart');
            this.addingToCart.set(false);
          },
        });
      },
      error: (err) => {
        this.addToCartError.set('Failed to add to cart');
        this.addingToCart.set(false);
      },
    });
  }

  buyNow(): void {
    const product = this.product();
    if (!product) return;

    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    // Navigate directly to checkout without adding to cart
    this.router.navigate(['/orders/checkout']);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  retry(): void {
    const productId = this.route.snapshot.params['id'];
    if (productId) {
      this.loadProduct(productId);
    }
  }

  nextSlide(): void {
    if (this.canNextSlide()) {
      this.currentSlideIndex.update((i) => i + 1);
    }
  }

  prevSlide(): void {
    if (this.canPrevSlide()) {
      this.currentSlideIndex.update((i) => i - 1);
    }
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  private loadReviews(productId: string): void {
    this.reviewsLoading.set(true);
    this.reviewsError.set(null);
    this.userReview.set(null);
    
    this.reviewService.getProductReviews(productId).subscribe({
      next: (response) => {
        this.reviews.set(response.data);
        this.reviewsLoading.set(false);
        
        if (this.storageService.isLoggedIn()) {
          const user = this.storageService.getUser() as any;
          if (user) {
            const userId = user.userId || user._id || user.id;
            const currentUserReview = response.data.find((r) => 
              r.user && (r.user._id === userId || r.user === userId)
            );
            if (currentUserReview) {
              this.userReview.set(currentUserReview);
            }
          }
        }
      },
      error: (err) => {
        console.error('Error loading reviews:', err);
        this.reviewsError.set('Failed to load reviews');
        this.reviewsLoading.set(false);
      }
    });
  }

  openReviewForm(): void {
    const existing = this.userReview();
    if (existing) {
      this.editMode.set(true);
      this.formRating.set(existing.rating);
      this.formComment.set(existing.comment);
    } else {
      this.editMode.set(false);
      this.formRating.set(5);
      this.formComment.set('');
    }
    this.showReviewForm.set(true);
    this.formError.set(null);
  }

  cancelForm(): void {
    this.showReviewForm.set(false);
    this.formError.set(null);
  }

  setRating(rating: number): void {
    this.formRating.set(rating);
  }

  getStarType(rating: number | undefined, starIndex: number): 'full' | 'half' | 'empty' {
    const normalized = Math.max(0, Math.min(5, rating ?? 0));
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

  handleAddOrUpdateReview(): void {
    const product = this.product();
    if (!product) return;

    this.formSubmitting.set(true);
    this.formError.set(null);

    const productId = product._id;
    const rating = this.formRating();
    const comment = this.formComment();

    if (this.editMode() && this.userReview()) {
      const reviewId = this.userReview()!._id;
      this.reviewService.updateReview(reviewId, rating, comment).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.showReviewForm.set(false);
          this.loadReviews(productId);
        },
        error: (err) => {
          this.formError.set(err?.error?.message || 'Failed to update review');
          this.formSubmitting.set(false);
        }
      });
    } else {
      this.reviewService.addReview(productId, rating, comment).subscribe({
        next: () => {
          this.formSubmitting.set(false);
          this.showReviewForm.set(false);
          this.loadReviews(productId);
        },
        error: (err) => {
          this.formError.set(err?.error?.message || 'Failed to submit review');
          this.formSubmitting.set(false);
        }
      });
    }
  }

  deleteExistingReview(): void {
    const existing = this.userReview();
    const product = this.product();
    if (!existing || !product) return;

    if (confirm('Are you sure you want to delete your review?')) {
      this.reviewService.deleteReview(existing._id).subscribe({
        next: () => {
          this.userReview.set(null);
          this.loadReviews(product._id);
        },
        error: (err) => {
          console.error('Failed to delete review', err);
          alert('Failed to delete review');
        }
      });
    }
  }
}

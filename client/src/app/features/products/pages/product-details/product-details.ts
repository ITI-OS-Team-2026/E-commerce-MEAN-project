import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.models';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, FormsModule, Footer, Navbar],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit, OnDestroy {
  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading: boolean = true;
  relatedLoading: boolean = false;
  error: string | null = null;
  selectedImageIndex: number = 0;
  quantity: number = 1;
  currentSlideIndex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const productId = params['id'];
      if (productId) {
        this.loadProduct(productId);
      } else {
        this.error = 'Product ID not found';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadProduct(productId: string): void {
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.productService
      .getProductById(productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.product = response.data;
          // Filter if product is soft deleted
          if (this.product?.isdeleted !== null) {
            this.error = 'Product not found or has been deleted';
            this.product = null;
          } else {
            // Load related products after main product is loaded
            this.loadRelatedProducts();
          }
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading product:', err);
          this.error = err?.error?.message || 'Failed to load product details';
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadRelatedProducts(): void {
    if (!this.product) return;

    const categoryId =
      typeof this.product.category === 'string'
        ? this.product.category
        : this.product.category?._id;

    if (!categoryId) return;

    this.relatedLoading = true;
    this.cdr.detectChanges();

    this.productService
      .getProducts({ category: categoryId, limit: 10 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Filter soft-deleted products, exclude current product, take last 4-10 products
          this.relatedProducts = response.data.products
            .filter((p) => p.isdeleted === null && p._id !== this.product?._id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10);
          this.relatedLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading related products:', err);
          this.relatedProducts = [];
          this.relatedLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  selectImage(index: number): void {
    if (this.product?.images && index < this.product.images.length) {
      this.selectedImageIndex = index;
    }
  }

  getCurrentImage(): string {
    return this.product?.images?.[this.selectedImageIndex] || '';
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) return;
    // TODO: Implement add to cart logic
    console.log(`Added ${this.quantity} of ${this.product.name} to cart`);
  }

  buyNow(): void {
    if (!this.product) return;
    // TODO: Implement buy now logic - redirect to checkout
    console.log(`Buying ${this.quantity} of ${this.product.name}`);
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
    if (this.currentSlideIndex < this.relatedProducts.length - 4) {
      this.currentSlideIndex++;
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  navigateToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

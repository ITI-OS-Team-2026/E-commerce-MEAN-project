import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { CartService } from '../../../cart/services/cart.service';
import { Cart as CartModel } from '../../../cart/models/cart.models';
import { CheckoutService } from '../../services/checkout.service';
import { ShippingAddress, CheckoutPayload } from '../../models/checkout.models';
import { PaymentService } from '../../../payment/services/payment.service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit, OnDestroy {
  cart: CartModel | null = null;
  isLoading = true;
  error: string | null = null;
  
  shippingAddress: ShippingAddress = {
    street: '',
    city: '',
    country: ''
  };

  selectedPaymentMethod: 'cash_on_delivery' | 'credit_card' = 'cash_on_delivery';

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private paymentService: PaymentService,
    private router: Router,
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
          this.error = 'Failed to load order summary. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  selectPaymentMethod(method: 'cash_on_delivery' | 'credit_card'): void {
    this.selectedPaymentMethod = method;
  }

  placeOrder(): void {
    if (!this.shippingAddress.street || !this.shippingAddress.city || !this.shippingAddress.country) {
      this.error = 'Please fill out all shipping address fields.';
      return;
    }
    
    if (!this.cart) return;

    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges();

    if (this.selectedPaymentMethod === 'credit_card') {
      this.paymentService.createPaymentIntent(this.cart.totalPrice, '')
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const paymentIntentId = res.paymentIntentId || res.data?.paymentIntentId || res.id || res.data?.clientSecret;
            const payload: CheckoutPayload = {
              shippingAddress: this.shippingAddress,
              paymentMethod: this.selectedPaymentMethod,
              paymentIntentId
            };
            this.executeCheckout(payload);
          },
          error: (err) => {
            this.error = 'Failed to initialize payment. Please try again.';
            this.isLoading = false;
            this.cdr.detectChanges();
          }
        });
    } else {
      const payload: CheckoutPayload = {
        shippingAddress: this.shippingAddress,
        paymentMethod: this.selectedPaymentMethod
      };
      this.executeCheckout(payload);
    }
  }

  private executeCheckout(payload: CheckoutPayload): void {
    this.checkoutService
      .checkout(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Clear cart globally on success
          this.cartService.updateCartCount(0);
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to place order. Please try again.';
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

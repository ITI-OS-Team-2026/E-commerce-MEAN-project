import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly SHIPPING_STORAGE_KEY = 'checkout_shipping_address';

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
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const paymentStatus = this.route.snapshot.queryParamMap.get('payment');

    if (paymentStatus === 'cancel') {
      this.error = 'Payment was canceled. Please try again.';
    }

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
      sessionStorage.setItem(this.SHIPPING_STORAGE_KEY, JSON.stringify(this.shippingAddress));

      const successUrl = `${window.location.origin}/orders/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/orders/checkout?payment=cancel`;

      this.paymentService.createCheckoutSession(this.cart.totalPrice, 'usd', successUrl, cancelUrl)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const checkoutUrl = res?.data?.url;

            if (!checkoutUrl) {
              this.error = 'Stripe checkout URL is missing. Please try again.';
              this.isLoading = false;
              this.cdr.detectChanges();
              return;
            }

            window.location.href = checkoutUrl;
          },
          error: () => {
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

  private executeCheckout(payload: CheckoutPayload, isStripeFlow: boolean = false): void {
    this.checkoutService
      .checkout(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (isStripeFlow) {
            sessionStorage.removeItem(this.SHIPPING_STORAGE_KEY);
            this.cartService.updateCartCount(0);
            this.router.navigate(['/orders/success']);
            return;
          }

          // Clear cart globally on success
          this.cartService.updateCartCount(0);
          this.router.navigate(['/orders/history']);
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

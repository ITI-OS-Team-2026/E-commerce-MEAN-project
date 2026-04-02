import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Footer } from '../../../../shared/components/footer/footer';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { PaymentService } from '../../../payment/services/payment.service';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../../cart/services/cart.service';
import { ShippingAddress, CheckoutPayload } from '../../models/checkout.models';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './success.html',
  styleUrl: './success.css',
})
export class Success implements OnInit, OnDestroy {
  private readonly SHIPPING_STORAGE_KEY = 'checkout_shipping_address';
  isVerifying = true;
  verificationError: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!sessionId) {
      this.verificationError = 'Payment session not found. Please try again.';
      this.isVerifying = false;
      this.cdr.detectChanges();
      return;
    }

    this.verifyAndFinalizePayment(sessionId);
  }

  private verifyAndFinalizePayment(sessionId: string): void {
    const storedShippingAddress = sessionStorage.getItem(this.SHIPPING_STORAGE_KEY);
    let shippingAddress: ShippingAddress;

    if (!storedShippingAddress) {
      this.verificationError = 'Shipping details not found. Your payment may not be completed.';
      this.isVerifying = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      shippingAddress = JSON.parse(storedShippingAddress) as ShippingAddress;
    } catch {
      this.verificationError = 'Invalid shipping details. Please contact support.';
      this.isVerifying = false;
      this.cdr.detectChanges();
      return;
    }

    this.paymentService
      .verifyCheckoutSession(sessionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const paid = res?.data?.paid;
          const paymentIntentId = res?.data?.paymentIntentId;

          if (!paid || !paymentIntentId) {
            this.verificationError = 'Payment verification failed. Please contact support.';
            this.isVerifying = false;
            this.cdr.detectChanges();
            return;
          }

          const payload: CheckoutPayload = {
            shippingAddress,
            paymentMethod: 'credit_card',
            paymentIntentId,
          };

          this.finalizeCheckout(payload);
        },
        error: () => {
          this.verificationError = 'Failed to verify payment. Please contact support.';
          this.isVerifying = false;
          this.cdr.detectChanges();
        },
      });
  }

  private finalizeCheckout(payload: CheckoutPayload): void {
    this.checkoutService
      .checkout(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          sessionStorage.removeItem(this.SHIPPING_STORAGE_KEY);
          this.cartService.updateCartCount(0);
          this.isVerifying = false;

          // Clean up URL
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { session_id: null },
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });

          this.cdr.detectChanges();
        },
        error: () => {
          this.verificationError = 'Failed to finalize your order. Please contact support.';
          this.isVerifying = false;
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

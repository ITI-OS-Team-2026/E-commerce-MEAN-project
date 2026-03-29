// import { Component, OnInit } from '@angular/core';
// import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
// import { PaymentService } from '../../services/payment.service';

// @Component({
//   selector: 'app-checkout',
//   templateUrl: './checkout.html',
//   styleUrls: ['./checkout.css']
// })
// export class CheckoutComponent implements OnInit {
//   stripe!: Stripe | null;
//   elements!: StripeElements;
//   isLoading = false;

//   constructor(private paymentService: PaymentService) { }

//   async ngOnInit() {
//     this.stripe = await loadStripe('pk_test_your_publishable_key');
//   }

//   async pay(amount: number, orderId: string) {
//     this.isLoading = true;
//     this.paymentService.createPaymentIntent(amount, orderId).subscribe(async (res) => {
//       const { clientSecret } = res.data;
//       this.elements = this.stripe!.elements({ clientSecret });

//       const paymentElement = this.elements.create('payment');
//       paymentElement.mount('#payment-element');
//       this.isLoading = false;
//     });
//   }

//   async submitPayment() {
//     const { error } = await this.stripe!.confirmPayment({
//       elements: this.elements,
//       confirmParams: { return_url: 'http://localhost:4200/order-history' },
//     });
//     if (error) console.error(error.message);
//   }
// }
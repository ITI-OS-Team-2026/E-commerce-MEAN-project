import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders ,HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service'
import { environment } from "../../../../../environments/environment.development"

@Component({
  selector: 'app-placement',
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule ],
  templateUrl: './placement.html',
  styleUrl: './placement.css',
})
export class Placement implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: string; quantity: number; price: number }[] = [];
  token : string | null = '';
  

  constructor(private fb: FormBuilder, private http: HttpClient , private storageService : StorageService) {
    this.orderForm = this.fb.group({
      shippingAddress: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        zip: ['', Validators.required],
      }),
    });
    // this.token  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQWhtZWQgQWxpIiwidXNlcklkIjoiNjljYzAyMmI0OTBlZmNlZWI0ODljYTY1Iiwicm9sZSI6ImN1c3RvbWVyIiwiaXNWZXJpZmllZCI6dHJ1ZSwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTc3NDk3NzcwOSwiZXhwIjoxNzc1MDY0MTA5fQ.1aenE4TifviOWogXMjRZZGDU2NcDpO0cuomCeT0eyng"
    this.token = this.storageService.getToken();
  }
  
  ngOnInit() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      this.cartItems = JSON.parse(cart);
    }
  }

  submit() {
    if (this.orderForm.valid && this.cartItems.length > 0) {
      const order: Order = {
        items: this.cartItems,
        shippingAddress: this.orderForm.value.shippingAddress,
      };
       
      const backendUrl = environment.apiUrl + "/orders"; 
      
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });

      this.http.post(backendUrl, order, { headers }).subscribe({
        next: (response) => {
          console.log('Order placed successfully', response);
          localStorage.removeItem('cart');
          this.cartItems = [];
        },
        error: (error) => {
          console.error('Error placing order', error);
        },
      });
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // calculateTax(): number {
  //   return Math.round(this.calculateSubtotal() * 0.08 * 100) / 100; // 8% tax
  // }

  calculateTotal(): number {
    return this.calculateSubtotal() + 24 ; // shipping 24
  }
}

interface Order {
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip: string;
  };
}

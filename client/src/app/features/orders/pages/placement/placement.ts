import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpHeaders ,HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../core/services/storage.service'
import { environment } from "../../../../../environments/environment.development"
import { Logo } from '../../../../shared/components/logo/logo';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-placement',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, Logo, RouterModule],
  templateUrl: './placement.html',
  styleUrl: './placement.css',
})
export class Placement implements OnInit {
  orderForm: FormGroup;
  cartItems: { product: string; quantity: number; price: number; name?: string }[] = [];
  token : string | null = '';
  

  constructor(private fb: FormBuilder, private http: HttpClient , private storageService : StorageService , private cdr: ChangeDetectorRef, private router: Router) {
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
    if (!this.token) {
      console.error('No token found, cannot fetch cart');
      return;
    }
    const backendUrl = environment.apiUrl + "/cart";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    this.http.get<{
      status: string;
      data: {
        items: {
        product: {
        _id: string;
        name: string;
        price: number;
        images: string[];
      };
      quantity: number;
      price: number;
    }[];
  };
}>(backendUrl, { headers }).subscribe({
  next: (response) => {
    this.cartItems = response.data.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.price,
      name: item.product.name
    }));
    this.cdr.detectChanges();
  },
  error: (error) => {
    console.error('Error fetching cart', error);
  }
});
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
    const subtotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log('Subtotal:', subtotal, 'Items:', this.cartItems);
    return subtotal;
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

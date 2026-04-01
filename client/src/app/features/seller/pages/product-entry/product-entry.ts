import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { Router } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-product-entry',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './product-entry.html',
  styleUrl: './product-entry.css',
})
export class ProductEntry implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.min(0)]],
      images: this.fb.array([]) // FormArray for images
    });
  }

  get imagesFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  private getHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  fetchCategories(): void {
    const url = `${environment.apiUrl}/categories`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      }
    });
  }

  addImage(url: string): void {
    if (url && url.startsWith('http')) {
      this.imagesFormArray.push(this.fb.control(url));
    } else {
      alert('Please enter a valid Image URL');
    }
  }

  removeImage(index: number): void {
    this.imagesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      alert('Please fill all required fields correctly.');
      return;
    }

    const token = this.storageService.getToken();
    if (!token) {
      alert('Authentication required. Please log in.');
      return;
    }

    this.isSubmitting = true;
    const backendUrl = environment.apiUrl + '/products';
    
    const formData = {
      ...this.productForm.value,
      price: Number(this.productForm.value.price),
      stock: Number(this.productForm.value.stock) || 0
    };

    this.http.post(backendUrl, formData, { headers: this.getHeaders() }).subscribe({
      next: (response) => {
        console.log('Product created successfully', response);
        alert('Product saved successfully!');
        this.isSubmitting = false;
        this.router.navigate(['/seller/inventory']); // Navigating back to inventory
      },
      error: (error) => {
        console.error('Error creating product', error);
        alert('Error saving product: ' + (error.error?.message || error.message));
        this.isSubmitting = false;
      }
    });
  }
}

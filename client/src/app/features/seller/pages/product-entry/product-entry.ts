import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment.development';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';
import { Sidebar } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-product-entry',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule, RouterLink, Sidebar],
  templateUrl: './product-entry.html',
  styleUrl: './product-entry.css',
})
export class ProductEntry implements OnInit {
  productForm: FormGroup;
  categories: any[] = [];
  isSubmitting = false;

  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  // Image management
  selectedImages: { file: File; previewUrl: string }[] = [];
  imagesSubmitAttempted = false; // track if submit was clicked so we show image error

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private storageService: StorageService,
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [null, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.fetchCategories();
  }

  // Only Authorization — do NOT set Content-Type; Angular auto-sets multipart/form-data with boundary
  private getAuthHeader(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.storageService.getToken()}` });
  }

  fetchCategories(): void {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (data) => (this.categories = data),
      error: (_err) => {},
    });
  }

  // ── Image handling ───────────────────────────────────────────
  onFileSelected(event: Event): void {
    this.errorMessage.set(null);
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        this.errorMessage.set(`"${file.name}" is not a valid image file.`);
        setTimeout(() => this.errorMessage.set(null), 4000);
        continue;
      }
      this.selectedImages.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    // Reset input so the same file can be selected again
    input.value = '';
  }

  removeImage(index: number): void {
    const removed = this.selectedImages.splice(index, 1)[0];
    if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
  }

  get hasImages(): boolean {
    return this.selectedImages.length > 0;
  }

  // ── Submit ───────────────────────────────────────────────────
  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.imagesSubmitAttempted = true;
    this.productForm.markAllAsTouched();

    // 1. Frontend form validation
    if (this.productForm.invalid) {
      this.errorMessage.set('Please fix the highlighted errors below before saving.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    // 2. Images required
    if (!this.hasImages) {
      this.errorMessage.set('At least one product image is required.');
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }

    // 3. Auth check
    const token = this.storageService.getToken();
    if (!token) {
      this.errorMessage.set('Authentication required. Please log in.');
      return;
    }

    this.isSubmitting = true;

    // 4. Build FormData — backend receives multipart, attachImageUrls uploads to Cloudinary
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('description', this.productForm.value.description);
    formData.append('price', String(this.productForm.value.price));
    formData.append('category', this.productForm.value.category);
    formData.append('stock', String(this.productForm.value.stock ?? 0));
    for (const img of this.selectedImages) {
      formData.append('images', img.file);
    }

    this.http
      .post(`${environment.apiUrl}/products`, formData, { headers: this.getAuthHeader() })
      .subscribe({
        next: () => {
          this.successMessage.set('Product saved successfully! Redirecting...');
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/seller/inventory']), 1500);
        },
        error: (err) => {
          this.isSubmitting = false;
          // Backend always returns { status: 'fail', message: string } via APIError + errorHandler
          const msg: string =
            err?.error?.message || err?.message || 'Something went wrong. Please try again.';
          this.errorMessage.set(msg);
          setTimeout(() => this.errorMessage.set(null), 7000);
        },
      });
  }

  logout(): void {
    this.storageService.clearSession();
    this.router.navigate(['/auth/login']);
  }
}

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { DataTable } from '../../components/data-table/data-table';
import { ProductService } from '../../services/product-service';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Sidebar, AdminHeader, DataTable],
  templateUrl: './product-management.html'
})
export class ProductManagement implements OnInit {
  products = signal<any[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  
  showDeleteModal = signal(false);
  deleteId = signal('');
  
  showEditModal = signal(false);
  editingProductId = signal('');
  isSubmitting = signal(false);
  productForm: FormGroup;
  categories = signal<any[]>([]);

  currentPage = signal(1);
  pageSize = signal(10);
  totalProducts = signal(0);

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      stock: [0, [Validators.min(0)]],
    });
  }

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategoriesWithProductCount().subscribe({
      next: (res) => this.categories.set(res),
      error: () => {}
    });
  }

  loadProducts() {
    this.isLoading.set(true);
    this.productService.getAllProducts(this.currentPage(), this.pageSize()).subscribe({
      next: (res) => {
        this.products.set(res.data?.products || []);
        this.totalProducts.set(res.total || 0);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Failed to load products. Please try again.';
        this.errorMessage.set(errMsg);
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.loadProducts();
  }

  mapProductsForTable() {
    return this.products().map(p => ({
      _id: p._id,
      image: p.images?.[0]?.url || p.images?.[0],
      name: p.name,
      category: p.category?.name || 'Uncategorized',
      price: `$${p.price}`,
      stock: p.stock,
      sales: p.sales || 0
    }));
  }

  openEditModal(row: any) {
    const product = this.products().find(p => p._id === row._id);
    if (!product) return;

    this.editingProductId.set(product._id);
    this.productForm.patchValue({
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: typeof product.category === 'object' ? product.category?._id : product.category,
      stock: product.stock || 0
    });
    this.errorMessage.set('');
    this.showEditModal.set(true);
  }

  closeEditModal() {
    this.showEditModal.set(false);
    this.editingProductId.set('');
    this.productForm.reset();
  }

  submitEdit() {
    if (this.productForm.invalid) {
      this.errorMessage.set('Please fill out all required fields correctly.');
      setTimeout(() => this.errorMessage.set(''), 5000);
      return;
    }

    this.isSubmitting.set(true);
    const formData = new FormData();
    const vals = this.productForm.value;
    formData.append('name', vals.name);
    formData.append('description', vals.description);
    formData.append('price', String(vals.price));
    formData.append('category', vals.category);
    formData.append('stock', String(vals.stock));

    this.productService.updateProduct(this.editingProductId(), formData).subscribe({
      next: (res: any) => {
        this.loadProducts();
        this.successMessage.set('Product updated successfully!');
        this.closeEditModal();
        this.isSubmitting.set(false);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Failed to update product. Please try again.';
        this.errorMessage.set(errMsg);
        this.isSubmitting.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }

  openDeleteModal(id: string) {
    this.deleteId.set(id);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteId.set('');
  }

  confirmDelete() {
    const id = this.deleteId();
    if (!id) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update(prods => prods.filter(p => p._id !== id));
        this.successMessage.set('Product deleted successfully');
        this.closeDeleteModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err: any) => {
        const errMsg = err?.error?.message || 'Failed to delete product. Please try again.';
        this.errorMessage.set(errMsg);
        this.closeDeleteModal();
        setTimeout(() => this.errorMessage.set(''), 5000);
      }
    });
  }
}

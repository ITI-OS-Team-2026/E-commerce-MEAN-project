import { Component, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { DataTable } from '../../components/data-table/data-table';

import { Category, CreateCategoryRequest } from '../../models/category.model';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AdminHeader, DataTable],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagement implements OnInit {
  showModal = signal(false);
  isEditing = signal(false);
  isOpen = signal(false);
  deleteId = signal('');
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  categories = signal<Category[]>([]);

  formData = signal<CreateCategoryRequest>({
    name: '',
    slug: '',
  });

  editingId = signal<string>('');

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // ✅ Load categories from API
  loadCategories() {
    this.isLoading.set(true);
    this.categoryService.getCategoriesWithProductCount().subscribe({
      next: (res: Category[]) => {
        this.categories.set(res);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.errorMessage.set('Failed to load categories. Please try again.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  openModal(category?: Category) {
    if (category) {
      this.formData.set({
        name: category.name,
        slug: category.slug,
      });
      this.editingId.set(category._id);
      this.isEditing.set(true);
    } else {
      this.formData.set({
        name: '',
        slug: '',
      });
      this.editingId.set('');
      this.isEditing.set(false);
    }
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitForm() {
    if (!this.formData().name.trim() || !this.formData().slug.trim()) {
      this.errorMessage.set('Name and slug are required.');
      return;
    }

    if (this.isEditing()) {
      this.categoryService.updateCategory(this.editingId(), this.formData()).subscribe({
        next: (updatedCategory) => {
          this.categories.update((cats) =>
            cats.map((c) => (c._id === updatedCategory._id ? updatedCategory : c)),
          );
          this.successMessage.set('Category updated successfully!');
          setTimeout(() => this.closeModal(), 500);
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          const errMsg = err?.error?.message || 'Failed to update category. Please try again.';
          this.errorMessage.set(errMsg);
          setTimeout(() => this.errorMessage.set(''), 5000);
        },
      });
    } else {
      this.categoryService.createCategory(this.formData()).subscribe({
        next: (newCategory) => {
          this.categories.update((cats) => [...cats, newCategory]);
          this.successMessage.set('Category created successfully!');
          setTimeout(() => this.closeModal(), 500);
          setTimeout(() => this.successMessage.set(''), 3000);
        },
        error: (err) => {
          const errMsg = err?.error?.message || 'Failed to create category. Please try again.';
          this.errorMessage.set(errMsg);
          setTimeout(() => this.errorMessage.set(''), 5000);
        },
      });
    }
  }

  openDeleteModal(id: string) {
    this.isOpen.set(true);
    this.deleteId.set(id);
  }

  closeDeleteModal() {
    this.isOpen.set(false);
    this.deleteId.set('');
  }

  confirmDelete(id: string) {
    this.deleteCategory(id);
    this.isOpen.set(false);
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.categories.update((cats) => cats.filter((c) => c._id !== id));
        this.successMessage.set('Category deleted successfully!');
        this.closeDeleteModal();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        const errMsg = err?.error?.message || 'Failed to delete category. Please try again.';
        this.errorMessage.set(errMsg);
        this.closeDeleteModal();
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  editCategory(category: Category) {
    this.openModal(category);
  }

  // ✅ Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // ✅ Map categories to table format
  mapCategoriesForTable() {
    return this.categories().map((cat) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      Created: this.formatDate(cat.createdAt),
      Updated: this.formatDate(cat.updatedAt),
    }));
  }
}

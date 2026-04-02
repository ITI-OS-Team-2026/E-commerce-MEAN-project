import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { DataTable } from '../../components/data-table/data-table';
import { CommonModule } from '@angular/common';

interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'Active' | 'Inactive';
}

interface CategoryFormData {
  id: string;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AdminHeader, DataTable],
  templateUrl: './category-management.html',
  styleUrl: './category-management.css',
})
export class CategoryManagement {
  showModal = signal(false);
  isEditing = signal(false);
  isOpen = signal(false);
  deleteId = signal('');

  formData = signal<CategoryFormData>({
    id: '',
    name: '',
    description: '',
    productCount: 0,
    status: 'active',
  });

  categories = signal<Category[]>([
    {
      id: 'CAT-001',
      name: 'Electronics',
      description: 'Digital devices and gadgets',
      productCount: 234,
      status: 'Active',
    },
    {
      id: 'CAT-002',
      name: 'Fashion',
      description: 'Clothing and accessories',
      productCount: 567,
      status: 'Active',
    },
    {
      id: 'CAT-003',
      name: 'Home & Garden',
      description: 'Home furniture and garden tools',
      productCount: 345,
      status: 'Active',
    },
    {
      id: 'CAT-004',
      name: 'Sports',
      description: 'Sports equipment and gear',
      productCount: 212,
      status: 'Active',
    },
    {
      id: 'CAT-005',
      name: 'Books',
      description: 'Physical and digital books',
      productCount: 1234,
      status: 'Inactive',
    },
  ]);

  openModal(category?: Category) {
    if (category) {
      this.formData.set({
        id: category.id,
        name: category.name,
        description: category.description,
        productCount: category.productCount,
        status: category.status.toLowerCase() as 'active' | 'inactive',
      });
      this.isEditing.set(true);
    } else {
      this.formData.set({
        id: '',
        name: '',
        description: '',
        productCount: 0,
        status: 'active',
      });
      this.isEditing.set(false);
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitForm() {
    if (this.isEditing()) {
      this.categories.update((cats) =>
        cats.map((c) =>
          c.id === this.formData().id
            ? {
                ...c,
                name: this.formData().name,
                description: this.formData().description,
                status: (this.formData().status.charAt(0).toUpperCase() +
                  this.formData().status.slice(1)) as 'Active' | 'Inactive',
              }
            : c,
        ),
      );
    } else {
      const newCategory: Category = {
        id: `CAT-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
        name: this.formData().name,
        description: this.formData().description,
        productCount: 0,
        status: 'Active',
      };
      this.categories.update((cats) => [...cats, newCategory]);
    }
    this.closeModal();
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
    this.categories.update((cats) => cats.filter((c) => c.id !== id));
  }

  editCategory(category: Category) {
    this.openModal(category);
  }
}

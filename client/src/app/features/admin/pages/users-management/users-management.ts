import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { DataTable } from '../../components/data-table/data-table';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, AdminHeader, DataTable],
  templateUrl: './users-management.html',
  styleUrl: './users-management.css',
})
export class UsersManagement {
  showModal = signal(false);
  isEditing = signal(false);

  formData = signal({
    id: '',
    name: '',
    email: '',
    role: 'customer',
    status: 'active',
    phone: '',
    joinDate: '',
  });

  users = [
    {
      id: 'USR-001',
      name: 'Marcus Sterling',
      email: 'marcus@email.com',
      role: 'Seller',
      status: 'Active',
      phone: '+1-555-0001',
      joindate: 'Oct 15, 2023',
    },
    {
      id: 'USR-002',
      name: 'Elena Rodriguez',
      email: 'elena@email.com',
      role: 'Customer',
      status: 'Restricted',
      phone: '+1-555-0002',
      joindate: 'Oct 14, 2023',
    },
    {
      id: 'USR-003',
      name: 'Julian Draxler',
      email: 'julian@email.com',
      role: 'Admin',
      status: 'Active',
      phone: '+1-555-0003',
      joindate: 'Sep 28, 2023',
    },
    {
      id: 'USR-004',
      name: 'Sarah Loft',
      email: 'sarah@email.com',
      role: 'Seller',
      status: 'Active',
      phone: '+1-555-0004',
      joindate: 'Oct 01, 2023',
    },
    {
      id: 'USR-005',
      name: 'David Wu',
      email: 'david@email.com',
      role: 'Customer',
      status: 'Active',
      phone: '+1-555-0005',
      joindate: 'Sep 19, 2023',
    },
  ];

  openModal() {
    this.showModal.set(true);
    this.formData.set({
      id: '',
      name: '',
      email: '',
      role: 'customer',
      status: 'active',
      phone: '',
      joinDate: '',
    });
    this.isEditing.set(false);
  }

  closeModal() {
    this.showModal.set(false);
  }

  submitForm() {
    if (this.isEditing()) {
      const index = this.users.findIndex((u) => u.id === this.formData().id);
      if (index > -1) {
        this.users[index] = { ...this.users[index], ...this.formData() };
      }
    } else {
      const newUser = { ...this.formData(), joindate: new Date().toLocaleDateString() };
      this.users.push(newUser as any);
    }
    this.closeModal();
  }

  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}

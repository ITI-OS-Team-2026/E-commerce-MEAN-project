import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/sidebar/sidebar';
import { AdminHeader } from '../../components/header/header';
import { DataTable } from '../../components/data-table/data-table';
import { User, UsersResponse } from '../../models/user.model';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, Sidebar, AdminHeader, DataTable],
  templateUrl: './users-management.html',
  styleUrl: './users-management.css',
})
export class UsersManagement implements OnInit {
  showDeleteModal = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  deleteId = signal('');

  users = signal<User[]>([]);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // ✅ Load users from API
  loadUsers() {
    this.isLoading.set(true);
    this.userService.getUsersList().subscribe({
      next: (res: UsersResponse) => {
        // console.log(res.users.filter((u) => u.name !== 'Admin'));
        this.users.set(res.users);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage.set('Failed to load users. Please try again.');
        this.isLoading.set(false);
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  // ✅ Open delete confirmation modal
  openDeleteModal(id: string) {
    this.showDeleteModal.set(true);
    this.deleteId.set(id);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.deleteId.set('');
  }

  // ✅ Confirm and delete user
  confirmDelete() {
    this.deleteUser(this.deleteId());
    this.closeDeleteModal();
  }

  // ✅ Delete user
  deleteUser(id: string) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users.update((users) => users.filter((u) => u._id !== id));
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        const errMsg = err?.error?.message || 'Failed to delete user. Please try again.';
        this.errorMessage.set(errMsg);
        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  // ✅ Approve seller
  approveSeller(id: string) {
    // 🔴 set loading state for THIS user only
    this.users.update((users) =>
      users.map((u) => (u._id === id ? { ...u, isApproving: true } : u)),
    );

    this.userService.approveSeller(id).subscribe({
      next: () => {
        this.users.update((users) =>
          users.map((u) => (u._id === id ? { ...u, isApproved: true, isApproving: false } : u)),
        );

        this.successMessage.set('Seller approved successfully!');
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (err) => {
        const errMsg = err?.error?.message || 'Failed to approve seller. Please try again.';

        this.errorMessage.set(errMsg);

        // 🔴 remove loading on error
        this.users.update((users) =>
          users.map((u) => (u._id === id ? { ...u, isApproving: false } : u)),
        );

        setTimeout(() => this.errorMessage.set(''), 5000);
      },
    });
  }

  // ✅ Format date for display
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  // ✅ Map users to table format
  mapUsersForTable() {
    return this.users().map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '-',
      role: user.role,
      Created: this.formatDate(user.createdAt),
      Updated: this.formatDate(user.updatedAt),
    }));
  }
}

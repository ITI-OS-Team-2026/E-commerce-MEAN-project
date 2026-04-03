import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar],
  templateUrl: './profile.html',
})
export class AdminProfile implements OnInit {
  adminUser = signal<{name: string, email: string, role: string} | null>(null);

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const user = this.storageService.getUser();
    if (user) {
      this.adminUser.set({
        name: user.name || 'Admin User',
        email: user.email || 'admin@example.com',
        role: user.role || 'Admin'
      });
    } else {
      this.adminUser.set({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'Admin'
      });
    }
  }
}

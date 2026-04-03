import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Sidebar } from '../../components/sidebar/sidebar';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar],
  templateUrl: './profile.html',
})
export class SellerProfile implements OnInit {
  sellerUser = signal<{name: string, email: string, role: string} | null>(null);

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const user = this.storageService.getUser();
    if (user) {
      this.sellerUser.set({
        name: user.name || 'Seller User',
        email: user.email || 'seller@example.com',
        role: user.role || 'Seller'
      });
    } else {
      // Fallback if no user in storage
      this.sellerUser.set({
        name: 'Seller User',
        email: 'seller@example.com',
        role: 'Seller'
      });
    }
  }
}

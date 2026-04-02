import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Logo } from '../../../../shared/components/logo/logo';
import { Button } from '../../../../shared/components/button/button';
import { StorageService } from '../../../../core/services/storage.service';
import { LoginResponse } from '../../../auth/models/auth.models';

@Component({
  selector: 'app-home-navbar',
  imports: [CommonModule, Logo, Button],
  templateUrl: './home-navbar.html',
  styleUrl: './home-navbar.css',
})
export class HomeNavbar {
  constructor(
    private router: Router,
    private storage: StorageService,
  ) {}

  get user(): LoginResponse['tokenUser'] | null {
    return this.storage.getUser();
  }

  get isLoggedIn(): boolean {
    return this.storage.isLoggedIn();
  }

  get profileRoute(): string {
    if (!this.user) {
      return '/';
    }

    const role = this.user.role?.toLowerCase();

    if (role === 'admin') return '/admin';
    if (role === 'seller') return '/seller';

    return '/orders';
  }

  logout(): void {
    this.storage.clearSession();
    this.router.navigate(['/']);
  }
}

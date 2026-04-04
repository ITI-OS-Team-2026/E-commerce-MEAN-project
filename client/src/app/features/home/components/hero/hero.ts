import { Component } from '@angular/core';
import { Button } from '../../../../shared/components/button/button';
import { StorageService } from '../../../../core/services/storage.service';
import { LoginResponse } from '../../../auth/models/auth.models';

@Component({
  selector: 'app-hero',
  imports: [Button],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  constructor(private storage: StorageService) { }

  get user(): LoginResponse['tokenUser'] | null {
    return this.storage.getUser();
  }

  get portalRoute(): string {
    const role = this.user?.role?.toLowerCase();

    if (role === 'admin') return '/admin';
    if (role === 'seller') return '/seller/dashboard';
    if (role === 'customer') return '/customer/dashboard';

    return '/seller/dashboard';
  }

  get portalLabel(): string {
    const role = this.user?.role?.toLowerCase();

    if (role === 'admin') return 'admin portal';
    if (role === 'seller') return 'seller portal';
    if (role === 'customer') return 'customer portal';

    return 'seller portal';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styles: [],
})
export class AdminHeader implements OnInit {
  currentUser = 'Admin User';
  currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const user = this.storageService.getUser();
    if (user && user.name) {
      this.currentUser = user.name;
    }
  }
}

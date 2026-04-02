import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: ` <!-- Mobile hamburger (small screen) -->
    <button
      class="lg:hidden fixed z-50 top-4 left-4 p-2 rounded-md bg-blue-600 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
      (click)="toggleMobile()"
      aria-label="Toggle sidebar"
    >
      <span *ngIf="!mobileOpen()">☰</span>
      <span *ngIf="mobileOpen()">✕</span>
    </button>

    <div
      *ngIf="mobileOpen()"
      class="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
      (click)="toggleMobile()"
    ></div>

    <aside
      [class.w-64]="!isCollapsed()"
      [class.w-20]="isCollapsed()"
      [class.-translate-x-full]="!mobileOpen()"
      class="bg-gray-900 text-white transition-all duration-300 h-screen fixed left-0 top-0 overflow-y-auto shadow-lg transform lg:translate-x-0 z-40"
    >
      <!-- Sidebar Header -->
      <div class="p-4 flex items-center justify-between border-b border-gray-700">
        <div [class.hidden]="isCollapsed()" class="text-xl font-bold text-blue-400">Admin</div>
        <button (click)="toggleSidebar()" class="text-gray-400 hover:text-white transition">
          {{ isCollapsed() ? '→' : '←' }}
        </button>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4">
        <ul class="space-y-2">
          <li *ngFor="let item of menuItems">
            <a
              [routerLink]="item.path"
              (click)="mobileOpen.set(false)"
              routerLinkActive="bg-blue-600"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 p-3 rounded-lg text-gray-300 hover:bg-gray-800 transition duration-200"
            >
              <span class="text-xl">{{ item.icon }}</span>
              <span [class.hidden]="isCollapsed()" class="whitespace-nowrap">{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-4 left-0 right-0 px-4">
        <button
          class="w-full py-2 px-3 bg-red-600 hover:bg-red-700 rounded-lg text-white transition flex items-center gap-3 justify-center"
        >
          <span>🚪</span>
          <span [class.hidden]="isCollapsed()">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Spacer -->
    <div
      class="transition-all duration-300"
      [ngClass]="{ 'lg:ml-64': !isCollapsed(), 'lg:ml-20': isCollapsed(), 'ml-0': true }"
    ></div>`,
  styles: [
    `
      /* Sidebar custom styles */
    `,
  ],
})
export class Sidebar {
  isCollapsed = signal(false);
  mobileOpen = signal(false);

  toggleSidebar() {
    this.isCollapsed.update((val) => !val);
  }

  toggleMobile() {
    this.mobileOpen.update((val) => !val);
  }

  menuItems = [
    { label: 'Dashboard', icon: '📊', path: '/admin/dashboard' },
    { label: 'Users', icon: '👥', path: '/admin/users' },
    { label: 'Categories', icon: '📂', path: '/admin/categories' },
    { label: 'Orders', icon: '📦', path: '/admin/all-orders' },
  ];
}

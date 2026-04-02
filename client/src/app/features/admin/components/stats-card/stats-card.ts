import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    [ngClass]="[bgColor, borderColor]"
    class="bg-white rounded-lg border p-6 shadow-sm hover:shadow-md transition"
  >
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p [ngClass]="textColor" class="text-3xl font-bold mt-2">{{ value }}</p>
        <div class="flex items-center gap-1 mt-2">
          <span
            [ngClass]="changeType === 'increase' ? 'text-green-600' : 'text-red-600'"
            class="text-sm font-medium"
          >
            {{ changeType === 'increase' ? '↑' : '↓' }} {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-500">vs last month</span>
        </div>
      </div>
      <div [ngClass]="textColor" class="text-4xl opacity-20">
        {{ icon }}
      </div>
    </div>
  </div>`,
  styles: [
    `
      /* Stats card custom styles */
    `,
  ],
})
export class StatsCard {
  Math = Math;
  @Input() title: string = '';
  @Input() value: number | string = 0;
  @Input() icon: string = '';
  @Input() bgColor: string = 'bg-blue-50';
  @Input() borderColor: string = 'border-blue-200';
  @Input() textColor: string = 'text-blue-600';
  @Input() change: number = 0;
  @Input() changeType: 'increase' | 'decrease' = 'increase';
}

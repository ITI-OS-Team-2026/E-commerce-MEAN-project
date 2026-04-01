import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.models';

@Component({
  selector: 'app-products-page-aside',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-page-aside.html',
  styleUrl: './products-page-aside.css',
})
export class ProductsPageAside {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string = '';
  @Input() priceRange: { min: number; max: number } = { min: 0, max: 2500 };
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<{ min: number; max: number }>();

  priceMin = signal(0);
  priceMax = signal(2500);

  constructor() {
    effect(() => {
      if (this.priceMin() === this.priceRange.min && this.priceMax() === this.priceRange.max) {
        return;
      }
      this.priceMin.set(this.priceRange.min);
      this.priceMax.set(this.priceRange.max);
    });
  }

  onCategorySelect(categoryId: string): void {
    this.categoryChange.emit(categoryId);
  }

  onPriceChange(): void {
    const min = this.priceMin();
    const max = this.priceMax();
    if (min < 0 || max > 2500 || min > max) {
      console.warn('Invalid price range:', { min, max });
      return;
    }
    this.priceChange.emit({ min, max });
  }
}

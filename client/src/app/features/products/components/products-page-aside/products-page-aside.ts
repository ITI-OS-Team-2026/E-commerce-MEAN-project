import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() categoryChange = new EventEmitter<string>();
  @Output() priceChange = new EventEmitter<{ min: number; max: number }>();

  priceMin = 0;
  priceMax = 2500;

  onCategorySelect(categoryId: string): void {
    this.categoryChange.emit(categoryId);
  }

  onPriceChange(): void {
    this.priceChange.emit({ min: this.priceMin, max: this.priceMax });
  }
}

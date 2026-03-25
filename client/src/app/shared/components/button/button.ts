import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.html',
})
export class Button {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' | 'inverted' | 'outlined' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() route: string | any[] | null = null;
  @Input() disabled: boolean = false;
  @Input() fullWidthOnMobile: boolean = true;

  get variantClasses(): string {
    const base =
      'inline-flex items-center justify-center rounded-md font-label font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 no-underline';

    const sizes = {
      sm: 'px-3 py-2 text-xs sm:text-sm',
      md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3',
      lg: 'px-6 py-3 text-sm sm:px-8 sm:py-3.5 sm:text-base',
    };

    const responsive = this.fullWidthOnMobile ? 'w-full sm:w-auto' : 'w-auto';

    const styles = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
      secondary: 'bg-surface-container text-on-secondary-container hover:bg-surface-container-high',
      inverted: 'bg-inverse-surface text-inverse-on-surface hover:bg-slate-900',
      outlined:
        'bg-transparent border border-outline-variant text-primary hover:bg-surface-container-low',
    };

    return `${base} ${sizes[this.size]} ${responsive} ${styles[this.variant]}`;
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './button.html'
})
export class Button {
  @Input() label: string = '';
  @Input() variant: 'primary' | 'secondary' | 'inverted' | 'outlined' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() route: string | any[] | null = null;
  @Input() disabled: boolean = false;

  get variantClasses(): string {
    const base = 'inline-flex items-center justify-center px-8 py-3 rounded-md font-label font-semibold text-sm transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer no-underline';
    
    const styles = {
      primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-sm',
      secondary: 'bg-surface-container text-on-secondary-container hover:bg-surface-container-high',
      inverted: 'bg-inverse-surface text-inverse-on-surface hover:bg-slate-900',
      outlined: 'bg-transparent border border-outline-variant text-primary hover:bg-surface-container-low'
    };

    return `${base} ${styles[this.variant]}`;
  }
}
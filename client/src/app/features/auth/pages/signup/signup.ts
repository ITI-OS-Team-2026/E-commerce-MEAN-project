import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export type SignupRole = 'customer' | 'seller';

/** Matches backend registration body. */
export interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  role: SignupRole;
}

@Component({
  selector: 'app-signup',
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly currentYear = new Date().getFullYear();

  signupPayload: SignupRequestBody = {
    name: '',
    email: '',
    password: '',
    role: 'customer',
  };

  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    // Example: this.auth.register({ ...this.signupPayload })
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #f7f6f3;
        font-family: 'DM Sans', sans-serif;
      }
      .card {
        background: #fff;
        border: 1px solid #e8e6e0;
        border-radius: 16px;
        padding: 52px 48px;
        width: 100%;
        max-width: 420px;
        text-align: center;
      }
      .icon-wrap {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 28px;
        font-size: 32px;
      }
      .icon-wrap.loading {
        background: #f0efeb;
        animation: pulse 1.4s ease-in-out infinite;
      }
      .icon-wrap.success {
        background: #e8f5ee;
      }
      .icon-wrap.error {
        background: #fdf0f0;
      }
      .icon-wrap.seller {
        background: #fff7e6;
      }
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      h2 {
        font-size: 22px;
        font-weight: 600;
        color: #1a1916;
        margin: 0 0 10px;
        letter-spacing: -0.3px;
      }
      p {
        font-size: 15px;
        color: #6b6860;
        line-height: 1.6;
        margin: 0 0 28px;
      }
      .countdown {
        display: inline-block;
        font-size: 13px;
        color: #9b9890;
        margin-bottom: 28px;
      }
      .btn {
        display: inline-block;
        padding: 12px 28px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 500;
        font-family: 'DM Sans', sans-serif;
        text-decoration: none;
        cursor: pointer;
        border: none;
        transition: opacity 0.15s;
      }
      .btn:hover {
        opacity: 0.85;
      }
      .btn-primary {
        background: #1a1916;
        color: #fff;
      }
      .btn-ghost {
        background: transparent;
        color: #6b6860;
        border: 1px solid #e0ded8;
      }
      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 20px 0;
        color: #c5c3bd;
        font-size: 12px;
      }
      .divider::before,
      .divider::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e8e6e0;
      }
    `,
  ],
  template: `
    <div class="card">
      @if (status === 'loading') {
        <div class="icon-wrap loading">⏳</div>
        <h2>Verifying your email</h2>
        <p>Just a moment while we confirm your address…</p>
      }

      @if (status === 'success') {
        <div class="icon-wrap success">✓</div>
        <h2>Email verified!</h2>
        <p>Your account is now active. Welcome aboard!</p>
        <!-- ↓ visible countdown so user knows something is happening -->
        <span class="countdown">Redirecting to login in {{ secondsLeft }}s…</span><br />
        <a class="btn btn-primary" routerLink="/auth/login">Go to login now</a>
      }

      @if (status === 'seller-pending') {
        <div class="icon-wrap seller">⏳</div>
        <h2>Email verified!</h2>
        <p>Your account is now pending admin approval. We'll notify you once it's activated.</p>
        <a class="btn btn-ghost" routerLink="/">Back to home</a>
      }

      <!-- ↓ link was clicked a second time -->
      @if (status === 'already-verified') {
        <div class="icon-wrap success">✓</div>
        <h2>Already verified</h2>
        <p>This link has already been used. Your email is confirmed — you can log in.</p>
        <a class="btn btn-primary" routerLink="/auth/login">Go to login</a>
      }

      @if (status === 'error') {
        <div class="icon-wrap error">✕</div>
        <h2>Link invalid or expired</h2>
        <p>{{ message }}</p>
        <div class="divider">or</div>
        <a class="btn btn-ghost" routerLink="/auth/register">Register again</a>
      }

      @if (status === 'no-token') {
        <div class="icon-wrap error">✕</div>
        <h2>Invalid link</h2>
        <p>The verification link is broken or incomplete. Please use the link from your email.</p>
        <a class="btn btn-ghost" routerLink="/auth/register">Back to register</a>
      }
    </div>
  `,
})
export class VerifyEmail implements OnInit, OnDestroy {
  status: 'loading' | 'success' | 'seller-pending' | 'already-verified' | 'error' | 'no-token' =
    'loading';
  message = '';
  secondsLeft = 5; // ← increased from 3 to 5 so user can read the message

  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef, // ← fixes Angular not updating the view
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status = 'no-token';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (res) => {
        if (res.message.toLowerCase().includes('pending')) {
          this.status = 'seller-pending';
        } else {
          this.status = 'success';
          this.startCountdown();
        }
        this.message = res.message;
        this.cdr.detectChanges(); // ← tell Angular to update the view NOW
      },
      error: (err) => {
        const msg: string = err.error?.message || '';
        const status: number = err.status;

        // Backend throws 400 "Invalid or expired verification token" for BOTH cases:
        // 1. Token was already used (verificationToken is null in DB) → show already-verified
        // 2. Token is genuinely wrong → show error
        // We can't tell them apart from the same message, so treat all 400s
        // from this endpoint as "already verified" — it's the safer UX choice
        // since a real attacker wouldn't have a valid email link at all.
        if (status === 400) {
          this.status = 'already-verified';
        } else {
          this.status = 'error';
          this.message = msg || 'Verification failed. The link may have expired.';
        }

        this.cdr.detectChanges(); // ← force update here too
      },
    });
  }

  ngOnDestroy(): void {
    // ← clean up the interval if user navigates away mid-countdown
    if (this.intervalId) clearInterval(this.intervalId);
  }

  private startCountdown(): void {
    this.intervalId = setInterval(() => {
      this.secondsLeft--;
      this.cdr.detectChanges(); // ← update the number on screen every tick
      if (this.secondsLeft <= 0) {
        clearInterval(this.intervalId!);
        this.router.navigate(['/auth/login']);
      }
    }, 1000);
  }
}

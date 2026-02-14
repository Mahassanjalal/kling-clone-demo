import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      
      <div class="auth-container" @fadeIn>
        <div class="auth-card">
          <div class="auth-header">
            <a routerLink="/" class="logo">
              <div class="logo-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" stroke="url(#logoGradient)" stroke-width="2" fill="none"/>
                  <path d="M16 8l-6 3.5v7l6 3.5 6-3.5v-7L16 8z" fill="url(#logoGradient)"/>
                </svg>
              </div>
              <span class="logo-text">Kling<span class="gradient">AI</span></span>
            </a>
            <div class="icon-container">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h1>Verify Your Email</h1>
            <p>We've sent a verification link to your email address</p>
          </div>

          <div class="verify-content">
            <div class="email-display" *ngIf="email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{{ email }}</span>
            </div>

            <p class="instructions">
              Please check your inbox and click the verification link to complete your registration. 
              If you don't see the email, check your spam folder.
            </p>

            <div class="success-message" *ngIf="resendSuccess">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Verification email resent successfully!
            </div>

            <button 
              class="btn btn-primary btn-block" 
              (click)="resendEmail()"
              [disabled]="isResending || countdown > 0"
            >
              <span *ngIf="!isResending && countdown === 0">Resend Email</span>
              <span *ngIf="isResending" class="spinner"></span>
              <span *ngIf="countdown > 0">Resend in {{ countdown }}s</span>
            </button>
          </div>

          <div class="auth-footer">
            <p>Wrong email? <a routerLink="/register">Sign up again</a></p>
            <p class="mt-2">Already verified? <a routerLink="/login">Sign in</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    .auth-background {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
      animation: float 10s ease-in-out infinite;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -2s;
    }

    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }

    .auth-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .gradient {
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .icon-container {
      width: 80px;
      height: 80px;
      background: rgba(99, 102, 241, 0.1);
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--primary-400);
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .verify-content {
      margin-bottom: 1.5rem;
    }

    .email-display {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      font-weight: 500;
    }

    .instructions {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .success-message {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.875rem 1rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: var(--radius-lg);
      color: var(--accent-emerald);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .btn-block {
      width: 100%;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    .auth-footer {
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .auth-footer a {
      color: var(--primary-400);
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .mt-2 {
      margin-top: 0.5rem;
    }

    @media (max-width: 480px) {
      .auth-page {
        padding: 1rem;
      }

      .auth-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class VerifyEmailComponent {
  email: string = '';
  isResending = false;
  resendSuccess = false;
  countdown = 0;
  countdownInterval: any;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'your email address';
    });
  }

  resendEmail() {
    if (this.isResending || this.countdown > 0) return;

    this.isResending = true;
    this.resendSuccess = false;

    // Simulate API call
    setTimeout(() => {
      this.isResending = false;
      this.resendSuccess = true;
      this.startCountdown();
    }, 1500);
  }

  startCountdown() {
    this.countdown = 60;
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }
}

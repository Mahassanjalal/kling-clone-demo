import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ],
  template: `
    <div class="success-page" @fadeIn>
      <div class="success-container">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l2.5 2.5L16 9"/>
          </svg>
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your purchase. Your credits have been added to your account.</p>
        <div class="success-actions">
          <a routerLink="/dashboard" class="btn btn-primary btn-lg">Go to Dashboard</a>
          <a routerLink="/create" class="btn btn-secondary btn-lg">Create Video</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .success-container {
      text-align: center;
      max-width: 480px;
    }

    .success-icon {
      width: 100px;
      height: 100px;
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid var(--accent-emerald);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      color: var(--accent-emerald);
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      line-height: 1.6;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
  `]
})
export class PaymentSuccessComponent {}

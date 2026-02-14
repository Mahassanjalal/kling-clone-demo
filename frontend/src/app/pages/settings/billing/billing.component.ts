import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div class="billing-page" @fadeIn>
      <div class="container">
        <div class="settings-layout">
          <aside class="settings-sidebar">
            <h2>Settings</h2>
            <nav class="settings-nav">
              <a routerLink="/settings">Profile</a>
              <a routerLink="/settings/billing" routerLinkActive="active">Billing</a>
              <a href="#">Notifications</a>
              <a href="#">Security</a>
              <a href="#">API Keys</a>
            </nav>
          </aside>

          <main class="settings-content">
            <div class="billing-section">
              <h3>Current Plan</h3>
              <div class="plan-card">
                <div class="plan-info">
                  <span class="plan-name">Pro Plan</span>
                  <span class="plan-price">$29/month</span>
                </div>
                <span class="plan-status active">Active</span>
              </div>
              <p class="plan-description">Your next billing date is January 15, 2026</p>
              <div class="plan-actions">
                <button class="btn btn-secondary">Change Plan</button>
                <button class="btn btn-ghost">Cancel Subscription</button>
              </div>
            </div>

            <div class="billing-section">
              <h3>Payment Method</h3>
              <div class="payment-card">
                <div class="card-info">
                  <span class="card-brand">Visa</span>
                  <span class="card-number">**** **** **** 4242</span>
                  <span class="card-expiry">Expires 12/26</span>
                </div>
                <button class="btn btn-ghost btn-sm">Update</button>
              </div>
            </div>

            <div class="billing-section">
              <h3>Billing History</h3>
              <div class="invoices-list">
                <div class="invoice-item">
                  <div class="invoice-info">
                    <span class="invoice-date">Dec 15, 2025</span>
                    <span class="invoice-amount">$29.00</span>
                  </div>
                  <span class="invoice-status paid">Paid</span>
                </div>
                <div class="invoice-item">
                  <div class="invoice-info">
                    <span class="invoice-date">Nov 15, 2025</span>
                    <span class="invoice-amount">$29.00</span>
                  </div>
                  <span class="invoice-status paid">Paid</span>
                </div>
                <div class="invoice-item">
                  <div class="invoice-info">
                    <span class="invoice-date">Oct 15, 2025</span>
                    <span class="invoice-amount">$29.00</span>
                  </div>
                  <span class="invoice-status paid">Paid</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .billing-page {
      padding: 2rem 0;
    }

    .settings-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    .settings-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .settings-sidebar h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .settings-nav a {
      padding: 0.625rem 1rem;
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
    }

    .settings-nav a:hover,
    .settings-nav a.active {
      background: var(--bg-glass);
      color: var(--text-primary);
    }

    .settings-content {
      max-width: 600px;
    }

    .billing-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .billing-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .plan-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-glass);
      border-radius: var(--radius-lg);
      margin-bottom: 0.75rem;
    }

    .plan-info {
      display: flex;
      flex-direction: column;
    }

    .plan-name {
      font-weight: 600;
    }

    .plan-price {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .plan-status {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .plan-status.active {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    .plan-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .plan-actions {
      display: flex;
      gap: 1rem;
    }

    .payment-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-glass);
      border-radius: var(--radius-lg);
    }

    .card-info {
      display: flex;
      flex-direction: column;
    }

    .card-brand {
      font-weight: 600;
    }

    .card-number {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .card-expiry {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .invoices-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .invoice-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--bg-glass);
      border-radius: var(--radius-lg);
    }

    .invoice-info {
      display: flex;
      gap: 1rem;
    }

    .invoice-amount {
      font-weight: 600;
    }

    .invoice-status {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .invoice-status.paid {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    @media (max-width: 768px) {
      .settings-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BillingComponent {}

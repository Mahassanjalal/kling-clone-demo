import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        query('.credit-package', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="credits-page" @fadeIn>
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Purchase Credits</h1>
            <p class="subtitle">Buy credits to generate more videos</p>
          </div>
          <div class="current-credits">
            <span class="label">Current Balance</span>
            <span class="amount">{{ currentCredits }}</span>
          </div>
        </div>

        <div class="credit-packages" @stagger>
          <div class="credit-package" *ngFor="let pkg of packages" (click)="selectPackage(pkg)">
            <div class="package-header">
              <span class="credits-amount">{{ pkg.amount }}</span>
              <span class="credits-label">credits</span>
            </div>
            <div class="package-price">
              <span class="currency">$</span>
              <span class="price">{{ pkg.price }}</span>
            </div>
            <div class="package-savings" *ngIf="pkg.savings">
              Save {{ pkg.savings }}%
            </div>
            <button class="btn btn-primary btn-block">Buy Now</button>
          </div>
        </div>

        <div class="info-section">
          <h3>How Credits Work</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-icon">🎬</div>
              <h4>Video Generation</h4>
              <p>Credits are used when you generate videos. Longer videos and higher resolutions cost more credits.</p>
            </div>
            <div class="info-item">
              <div class="info-icon">💾</div>
              <h4>No Expiration</h4>
              <p>Credits never expire. Use them whenever you need to create content.</p>
            </div>
            <div class="info-item">
              <div class="info-icon">📊</div>
              <h4>Usage Tracking</h4>
              <p>Track your credit usage in real-time from your dashboard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .credits-page {
      padding: 2rem 0;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: var(--text-secondary);
    }

    .current-credits {
      text-align: right;
    }

    .current-credits .label {
      display: block;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .current-credits .amount {
      font-size: 2rem;
      font-weight: 700;
      color: #f59e0b;
    }

    .credit-packages {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .credit-package {
      background: var(--bg-card);
      border: 2px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
    }

    .credit-package:hover {
      border-color: var(--primary-500);
      transform: translateY(-4px);
    }

    .package-header {
      margin-bottom: 1rem;
    }

    .credits-amount {
      display: block;
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary-400);
    }

    .credits-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .package-price {
      margin-bottom: 1rem;
    }

    .currency {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .price {
      font-size: 2rem;
      font-weight: 700;
    }

    .package-savings {
      position: absolute;
      top: -10px;
      right: -10px;
      background: var(--accent-emerald);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .info-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
    }

    .info-section h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .info-item {
      text-align: center;
    }

    .info-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .info-item h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .info-item p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.6;
    }
  `]
})
export class CreditsComponent {
  currentCredits = 150;
  
  packages = [
    { amount: 100, price: 10, savings: 0 },
    { amount: 500, price: 45, savings: 10 },
    { amount: 1000, price: 80, savings: 20 },
    { amount: 5000, price: 350, savings: 30 }
  ];

  selectPackage(pkg: any) {
    console.log('Selected package:', pkg);
  }
}

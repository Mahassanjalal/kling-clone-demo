import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        query('.pricing-card', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger(150, [
            animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="pricing-page">
      <!-- Hero -->
      <section class="hero" @fadeInUp>
        <div class="container">
          <span class="section-badge">Pricing</span>
          <h1>Simple, Transparent Pricing</h1>
          <p class="hero-description">
            Start free and scale as you grow. No hidden fees, cancel anytime.
          </p>
          <div class="billing-toggle">
            <button [class.active]="billingCycle === 'monthly'" (click)="setBillingCycle('monthly')">Monthly</button>
            <button [class.active]="billingCycle === 'yearly'" (click)="setBillingCycle('yearly')">
              Yearly
              <span class="save-badge">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Pricing Cards -->
      <section class="pricing-cards-section">
        <div class="container">
          <div class="pricing-grid" @stagger>
            <!-- Free Plan -->
            <div class="pricing-card">
              <div class="pricing-header">
                <h3>Free</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">0</span>
                  <span class="period">/month</span>
                </div>
                <p class="description">Perfect for getting started</p>
              </div>
              <div class="pricing-features">
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>5 videos per month</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>720p resolution</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>15 seconds max length</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Basic templates</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>1 team seat</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Community support</span>
                </div>
              </div>
              <a routerLink="/register" class="btn btn-secondary btn-block">Get Started</a>
            </div>

            <!-- Pro Plan -->
            <div class="pricing-card featured">
              <div class="popular-badge">Most Popular</div>
              <div class="pricing-header">
                <h3>Pro</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">{{ billingCycle === 'yearly' ? '23' : '29' }}</span>
                  <span class="period">/month</span>
                </div>
                <p class="description">For serious creators</p>
              </div>
              <div class="pricing-features">
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>50 videos per month</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>1080p resolution</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>60 seconds max length</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>All templates</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>3 team seats</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>API access</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Priority support</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>No watermark</span>
                </div>
              </div>
              <button class="btn btn-primary btn-block" (click)="subscribe('pro')">Start Free Trial</button>
            </div>

            <!-- Business Plan -->
            <div class="pricing-card">
              <div class="pricing-header">
                <h3>Business</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">{{ billingCycle === 'yearly' ? '79' : '99' }}</span>
                  <span class="period">/month</span>
                </div>
                <p class="description">For teams & agencies</p>
              </div>
              <div class="pricing-features">
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>200 videos per month</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>4K resolution</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>120 seconds max length</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Custom templates</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>10 team seats</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>A/B testing</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Advanced analytics</span>
                </div>
                <div class="feature">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>White-label exports</span>
                </div>
              </div>
              <button class="btn btn-secondary btn-block" (click)="subscribe('business')">Start Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Enterprise -->
      <section class="enterprise" @fadeInUp>
        <div class="container">
          <div class="enterprise-card">
            <div class="enterprise-content">
              <h3>Enterprise</h3>
              <p>For large organizations with custom needs</p>
              <ul>
                <li>Unlimited videos</li>
                <li>Unlimited team seats</li>
                <li>Custom AI training</li>
                <li>SLA guarantees</li>
                <li>Dedicated support</li>
              </ul>
            </div>
            <div class="enterprise-action">
              <span class="price">Custom</span>
              <button class="btn btn-primary btn-lg">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="faq" @fadeInUp>
        <div class="container">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-grid">
            <div class="faq-item">
              <h4>Can I change my plan later?</h4>
              <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div class="faq-item">
              <h4>What happens if I exceed my video limit?</h4>
              <p>You can purchase additional credits or upgrade to a higher plan. Unused credits roll over.</p>
            </div>
            <div class="faq-item">
              <h4>Is there a free trial?</h4>
              <p>Yes, Pro and Business plans come with a 14-day free trial. No credit card required.</p>
            </div>
            <div class="faq-item">
              <h4>Can I cancel anytime?</h4>
              <p>Absolutely. You can cancel your subscription at any time with no penalties.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .pricing-page {
      padding-top: 80px;
    }

    .hero {
      padding: 4rem 0 2rem;
      text-align: center;
    }

    .section-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      color: var(--primary-400);
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero h1 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .hero-description {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    .billing-toggle {
      display: inline-flex;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 0.375rem;
    }

    .billing-toggle button {
      padding: 0.625rem 1.5rem;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .billing-toggle button.active {
      background: var(--gradient-primary);
      color: white;
    }

    .save-badge {
      display: inline-block;
      padding: 0.125rem 0.5rem;
      background: var(--accent-emerald);
      color: white;
      font-size: 0.75rem;
      border-radius: var(--radius-full);
      margin-left: 0.5rem;
    }

    .pricing-cards-section {
      padding: 2rem 0 4rem;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .pricing-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 2rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .pricing-card.featured {
      border-color: var(--primary-500);
      transform: scale(1.05);
      box-shadow: var(--shadow-glow);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      padding: 0.375rem 1rem;
      background: var(--gradient-primary);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .pricing-header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .pricing-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
      margin: 1rem 0;
    }

    .currency {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .amount {
      font-size: 3.5rem;
      font-weight: 800;
    }

    .period {
      color: var(--text-muted);
    }

    .description {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .pricing-features {
      margin-bottom: 1.5rem;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 0;
      color: var(--text-secondary);
    }

    .feature svg {
      color: var(--accent-emerald);
      flex-shrink: 0;
    }

    .btn-block {
      width: 100%;
    }

    .enterprise {
      padding: 2rem 0 4rem;
    }

    .enterprise-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, var(--bg-card) 0%, var(--bg-tertiary) 100%);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 2.5rem;
    }

    .enterprise-content h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .enterprise-content > p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .enterprise-content ul {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .enterprise-content li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
    }

    .enterprise-content li::before {
      content: '✓';
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .enterprise-action {
      text-align: center;
    }

    .enterprise-action .price {
      display: block;
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .faq {
      padding: 4rem 0;
      background: var(--bg-secondary);
    }

    .faq h2 {
      text-align: center;
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 2rem;
    }

    .faq-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
    }

    .faq-item {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .faq-item h4 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .faq-item p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .pricing-card.featured {
        transform: none;
      }

      .enterprise-card {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }

      .enterprise-content ul {
        justify-content: center;
      }
    }
  `]
})
export class PricingComponent implements OnInit {
  billingCycle: 'monthly' | 'yearly' = 'monthly';

  constructor(private paymentService: PaymentService) {}

  ngOnInit() {}

  setBillingCycle(cycle: 'monthly' | 'yearly') {
    this.billingCycle = cycle;
  }

  subscribe(plan: string) {
    this.paymentService.createCheckoutSession(plan, this.billingCycle);
  }
}

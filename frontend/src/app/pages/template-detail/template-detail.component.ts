import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-template-detail',
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
    <div class="template-detail-page" @fadeIn>
      <div class="container">
        <div class="back-link">
          <a routerLink="/templates">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Templates
          </a>
        </div>

        <div class="template-content">
          <div class="template-preview-section">
            <div class="preview-card">
              <div class="preview-placeholder"></div>
              <button class="btn btn-primary btn-lg btn-block">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                Use This Template
              </button>
            </div>
          </div>

          <div class="template-info-section">
            <div class="template-header">
              <span class="platform-badge">TikTok</span>
              <h1>Product Showcase</h1>
              <p class="description">Perfect for e-commerce product launches with smooth transitions and eye-catching animations.</p>
            </div>

            <div class="info-card">
              <h3>Template Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="label">Duration</span>
                  <span class="value">15 seconds</span>
                </div>
                <div class="detail-item">
                  <span class="label">Aspect Ratio</span>
                  <span class="value">9:16 (Vertical)</span>
                </div>
                <div class="detail-item">
                  <span class="label">Resolution</span>
                  <span class="value">1080p</span>
                </div>
                <div class="detail-item">
                  <span class="label">Scenes</span>
                  <span class="value">3 scenes</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3>What's Included</h3>
              <ul class="feature-list">
                <li>Opening hook animation</li>
                <li>Product showcase scene</li>
                <li>Call-to-action finale</li>
                <li>Background music suggestions</li>
                <li>Text overlay placeholders</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .template-detail-page {
      padding: 2rem 0;
    }

    .back-link {
      margin-bottom: 1.5rem;
    }

    .back-link a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
    }

    .template-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .preview-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .preview-placeholder {
      aspect-ratio: 9/16;
      background: linear-gradient(135deg, #ff0050 0%, #00f2ea 100%);
      border-radius: var(--radius-lg);
      margin-bottom: 1rem;
    }

    .template-header {
      margin-bottom: 1.5rem;
    }

    .platform-badge {
      display: inline-block;
      padding: 0.375rem 0.875rem;
      background: var(--primary-500);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .template-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .description {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.6;
    }

    .info-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .info-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    .details-grid {
      display: grid;
      gap: 0.75rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-light);
    }

    .label {
      color: var(--text-secondary);
    }

    .value {
      font-weight: 500;
    }

    .feature-list {
      list-style: none;
    }

    .feature-list li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
    }

    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-emerald);
      font-weight: 600;
    }

    @media (max-width: 968px) {
      .template-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TemplateDetailComponent {
  constructor(private route: ActivatedRoute) {}
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-features',
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
        query('.feature-item, .comparison-row', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="features-page">
      <!-- Hero -->
      <section class="hero" @fadeInUp>
        <div class="container">
          <span class="section-badge">Features</span>
          <h1>Everything You Need to Create<br><span class="gradient-text">Professional Videos</span></h1>
          <p class="hero-description">
            From text-to-video generation to team collaboration, our platform provides all the tools 
            you need to create stunning content at scale.
          </p>
        </div>
      </section>

      <!-- Main Features -->
      <section class="main-features">
        <div class="container">
          <div class="features-list" @stagger>
            <div class="feature-item">
              <div class="feature-visual">
                <div class="visual-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <div class="feature-content">
                <h3>Text to Video</h3>
                <p>Transform your ideas into stunning videos with just a text description. Our AI understands context, style, and mood to create exactly what you envision.</p>
                <ul class="feature-list">
                  <li>Natural language processing</li>
                  <li>Multiple style options</li>
                  <li>Up to 5-minute videos</li>
                  <li>4K resolution support</li>
                </ul>
              </div>
            </div>

            <div class="feature-item reverse">
              <div class="feature-visual">
                <div class="visual-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
              </div>
              <div class="feature-content">
                <h3>Image to Video</h3>
                <p>Upload your product photos, logos, or any image and watch them come to life. Perfect for e-commerce and brand content.</p>
                <ul class="feature-list">
                  <li>Product photo animation</li>
                  <li>Logo motion graphics</li>
                  <li>Background replacement</li>
                  <li>Smart object tracking</li>
                </ul>
              </div>
            </div>

            <div class="feature-item">
              <div class="feature-visual">
                <div class="visual-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
              </div>
              <div class="feature-content">
                <h3>Ad Templates</h3>
                <p>Choose from 50+ professionally designed templates for every platform. TikTok, Instagram, YouTube - we've got you covered.</p>
                <ul class="feature-list">
                  <li>Platform-optimized formats</li>
                  <li>Industry-specific designs</li>
                  <li>Customizable placeholders</li>
                  <li>One-click apply</li>
                </ul>
              </div>
            </div>

            <div class="feature-item reverse">
              <div class="feature-visual">
                <div class="visual-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
              </div>
              <div class="feature-content">
                <h3>Team Collaboration</h3>
                <p>Work together with your team seamlessly. Share projects, brand kits, and templates with role-based permissions.</p>
                <ul class="feature-list">
                  <li>Role-based access control</li>
                  <li>Real-time collaboration</li>
                  <li>Shared asset library</li>
                  <li>Activity tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Feature Comparison -->
      <section class="comparison">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <h2>Why Choose Kling AI?</h2>
            <p>See how we compare to traditional video creation methods</p>
          </div>
          <div class="comparison-table" @stagger>
            <div class="comparison-header">
              <span>Feature</span>
              <span>Traditional</span>
              <span>Kling AI</span>
            </div>
            <div class="comparison-row">
              <span>Time to create</span>
              <span class="negative">Days/Weeks</span>
              <span class="positive">Minutes</span>
            </div>
            <div class="comparison-row">
              <span>Cost per video</span>
              <span class="negative">$500 - $5000</span>
              <span class="positive">$0.50 - $5</span>
            </div>
            <div class="comparison-row">
              <span>Technical skills</span>
              <span class="negative">Required</span>
              <span class="positive">None needed</span>
            </div>
            <div class="comparison-row">
              <span>Revisions</span>
              <span class="negative">Expensive</span>
              <span class="positive">Unlimited</span>
            </div>
            <div class="comparison-row">
              <span>Scalability</span>
              <span class="negative">Limited</span>
              <span class="positive">Unlimited</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content" @fadeInUp>
            <h2>Ready to Transform Your Video Creation?</h2>
            <p>Join 50,000+ creators already using Kling AI</p>
            <a routerLink="/register" class="btn btn-primary btn-lg">Get Started Free</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .features-page {
      padding-top: 80px;
    }

    .hero {
      padding: 6rem 0 4rem;
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
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.1;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 640px;
      margin: 0 auto;
      line-height: 1.7;
    }

    .main-features {
      padding: 4rem 0;
      background: var(--bg-secondary);
    }

    .feature-item {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
      margin-bottom: 6rem;
    }

    .feature-item:last-child {
      margin-bottom: 0;
    }

    .feature-item.reverse {
      direction: rtl;
    }

    .feature-item.reverse > * {
      direction: ltr;
    }

    .feature-visual {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .visual-placeholder {
      width: 100%;
      aspect-ratio: 4/3;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-400);
    }

    .feature-content h3 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .feature-content > p {
      color: var(--text-secondary);
      font-size: 1.0625rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .feature-list {
      list-style: none;
    }

    .feature-list li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      color: var(--text-secondary);
    }

    .feature-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .comparison {
      padding: 4rem 0;
    }

    .section-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .section-header h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .section-header p {
      color: var(--text-secondary);
    }

    .comparison-table {
      max-width: 800px;
      margin: 0 auto;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    .comparison-header,
    .comparison-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .comparison-header {
      background: var(--bg-glass);
      font-weight: 600;
    }

    .comparison-row:last-child {
      border-bottom: none;
    }

    .comparison-row span:first-child {
      color: var(--text-secondary);
    }

    .negative {
      color: var(--accent-rose);
    }

    .positive {
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .cta-section {
      padding: 4rem 0;
      background: var(--bg-secondary);
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .cta-content h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-content p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .feature-item {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .feature-item.reverse {
        direction: ltr;
      }

      .comparison-header,
      .comparison-row {
        grid-template-columns: 1.5fr 1fr 1fr;
        padding: 1rem;
        font-size: 0.875rem;
      }
    }
  `]
})
export class FeaturesComponent {}

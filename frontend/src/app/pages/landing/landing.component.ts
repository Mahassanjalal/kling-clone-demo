import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease', style({ opacity: 1 }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('stagger', [
      transition(':enter', [
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="landing-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-glow"></div>
        <div class="container">
          <div class="hero-content" @fadeInUp>
            <div class="badge badge-primary animate-pulse">
              <span class="pulse-dot"></span>
              Now with 4K resolution support
            </div>
            <h1 class="hero-title">
              Create Stunning<br>
              <span class="gradient-text-animate">AI Videos</span> in Minutes
            </h1>
            <p class="hero-description">
              Transform your ideas into professional videos with our AI-powered platform. 
              Perfect for ads, social media, and business content. No editing skills required.
            </p>
            <div class="hero-actions">
              <a routerLink="/register" class="btn btn-primary btn-lg">
                Start Creating Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <button class="btn btn-secondary btn-lg" (click)="scrollToDemo()">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7l5 3-5 3V7z" stroke="currentColor" stroke-width="2"/>
                </svg>
                Watch Demo
              </button>
            </div>
            <div class="hero-stats">
              <div class="stat">
                <span class="stat-value">10M+</span>
                <span class="stat-label">Videos Created</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">50K+</span>
                <span class="stat-label">Active Users</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat">
                <span class="stat-value">4.9</span>
                <span class="stat-label">User Rating</span>
              </div>
            </div>
          </div>
          <div class="hero-visual" @scaleIn>
            <div class="video-preview">
              <div class="video-container">
                <div class="video-placeholder">
                  <div class="play-button">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
                <div class="video-ui">
                  <div class="timeline">
                    <div class="progress-bar">
                      <div class="progress" style="width: 45%"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="floating-card card-1">
                <div class="card-icon">✨</div>
                <span>AI Generated</span>
              </div>
              <div class="floating-card card-2">
                <div class="card-icon">⚡</div>
                <span>10x Faster</span>
              </div>
              <div class="floating-card card-3">
                <div class="card-icon">🎨</div>
                <span>4K Quality</span>
              </div>
            </div>
          </div>
        </div>
        <div class="scroll-indicator" (click)="scrollToFeatures()">
          <div class="mouse">
            <div class="wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      <!-- Logo Cloud -->
      <section class="logo-cloud" @fadeIn>
        <div class="container">
          <p class="logo-cloud-title">Trusted by teams at</p>
          <div class="logos">
            <div class="logo-item">Google</div>
            <div class="logo-item">Microsoft</div>
            <div class="logo-item">Amazon</div>
            <div class="logo-item">Meta</div>
            <div class="logo-item">Netflix</div>
            <div class="logo-item">Spotify</div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features" id="features">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">Features</span>
            <h2 class="section-title">Everything You Need to<br>Create Professional Videos</h2>
            <p class="section-description">
              From text-to-video generation to multi-scene editing, our platform provides all the tools you need.
            </p>
          </div>
          <div class="features-grid" @stagger>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Text to Video</h3>
              <p>Describe your vision in words and watch AI bring it to life with stunning visuals.</p>
            </div>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <h3>Image to Video</h3>
              <p>Upload your product photos and transform them into dynamic video content.</p>
            </div>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <h3>Ad Templates</h3>
              <p>Choose from 50+ professionally designed templates for every platform.</p>
            </div>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Team Collaboration</h3>
              <p>Work together with your team. Share projects, brand kits, and templates.</p>
            </div>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <h3>Brand Kit</h3>
              <p>Maintain brand consistency with custom colors, fonts, and logos.</p>
            </div>
            <div class="feature-card stagger-item">
              <div class="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <h3>Analytics</h3>
              <p>Track video performance with detailed analytics and A/B testing.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works -->
      <section class="how-it-works">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">How It Works</span>
            <h2 class="section-title">Create Videos in 3 Simple Steps</h2>
          </div>
          <div class="steps">
            <div class="step" @fadeInUp>
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>Describe Your Vision</h3>
                <p>Enter a text description of the video you want to create. Be as detailed or as simple as you like.</p>
              </div>
              <div class="step-visual">
                <div class="mock-input">
                  <span class="typing-text">A cinematic shot of...</span>
                  <span class="cursor">|</span>
                </div>
              </div>
            </div>
            <div class="step" @fadeInUp>
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>Customize Settings</h3>
                <p>Choose resolution, duration, style, and aspect ratio. Perfect for any platform.</p>
              </div>
              <div class="step-visual">
                <div class="mock-settings">
                  <div class="setting-item">
                    <span>Resolution</span>
                    <span class="tag">1080p</span>
                  </div>
                  <div class="setting-item">
                    <span>Duration</span>
                    <span class="tag">15s</span>
                  </div>
                  <div class="setting-item">
                    <span>Style</span>
                    <span class="tag">Cinematic</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="step" @fadeInUp>
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>Generate & Download</h3>
                <p>Our AI creates your video in minutes. Download in high quality and share anywhere.</p>
              </div>
              <div class="step-visual">
                <div class="mock-video">
                  <div class="video-frame"></div>
                  <div class="download-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Templates Preview -->
      <section class="templates-preview">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">Templates</span>
            <h2 class="section-title">Ready-to-Use Templates</h2>
            <p class="section-description">
              Start with professionally designed templates for every use case
            </p>
          </div>
          <div class="templates-grid" @stagger>
            <div class="template-card stagger-item">
              <div class="template-preview tiktok">
                <span class="template-badge">TikTok</span>
              </div>
              <h4>Product Showcase</h4>
              <p>Perfect for e-commerce product launches</p>
            </div>
            <div class="template-card stagger-item">
              <div class="template-preview instagram">
                <span class="template-badge">Instagram</span>
              </div>
              <h4>Story Ad</h4>
              <p>Vertical format for Instagram Stories</p>
            </div>
            <div class="template-card stagger-item">
              <div class="template-preview youtube">
                <span class="template-badge">YouTube</span>
              </div>
              <h4>Pre-Roll Ad</h4>
              <p>Landscape format for YouTube ads</p>
            </div>
            <div class="template-card stagger-item">
              <div class="template-preview testimonial">
                <span class="template-badge">Universal</span>
              </div>
              <h4>Customer Story</h4>
              <p>Build trust with testimonials</p>
            </div>
          </div>
          <div class="templates-cta">
            <a routerLink="/templates" class="btn btn-secondary">
              Browse All Templates
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <!-- Pricing Preview -->
      <section class="pricing-preview">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">Pricing</span>
            <h2 class="section-title">Simple, Transparent Pricing</h2>
            <p class="section-description">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>
          <div class="pricing-cards" @stagger>
            <div class="pricing-card stagger-item">
              <div class="pricing-header">
                <h3>Free</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">0</span>
                  <span class="period">/month</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>5 videos per month</li>
                <li>720p resolution</li>
                <li>Basic templates</li>
                <li>Email support</li>
              </ul>
              <a routerLink="/register" class="btn btn-secondary">Get Started</a>
            </div>
            <div class="pricing-card featured stagger-item">
              <div class="popular-badge">Most Popular</div>
              <div class="pricing-header">
                <h3>Pro</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">29</span>
                  <span class="period">/month</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>50 videos per month</li>
                <li>1080p resolution</li>
                <li>All templates</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
              <a routerLink="/register" class="btn btn-primary">Start Free Trial</a>
            </div>
            <div class="pricing-card stagger-item">
              <div class="pricing-header">
                <h3>Business</h3>
                <div class="price">
                  <span class="currency">$</span>
                  <span class="amount">99</span>
                  <span class="period">/month</span>
                </div>
              </div>
              <ul class="pricing-features">
                <li>200 videos per month</li>
                <li>4K resolution</li>
                <li>Team collaboration</li>
                <li>A/B testing</li>
                <li>Analytics dashboard</li>
              </ul>
              <a routerLink="/register" class="btn btn-secondary">Start Free Trial</a>
            </div>
          </div>
          <div class="pricing-cta">
            <p>Need more? <a routerLink="/pricing">View all plans</a> including Enterprise options.</p>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="testimonials">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">Testimonials</span>
            <h2 class="section-title">Loved by Creators Worldwide</h2>
          </div>
          <div class="testimonials-grid" @stagger>
            <div class="testimonial-card stagger-item">
              <div class="stars">★★★★★</div>
              <p>"Kling AI has completely transformed our video production workflow. What used to take days now takes minutes."</p>
              <div class="author">
                <div class="avatar">SM</div>
                <div class="info">
                  <span class="name">Sarah Mitchell</span>
                  <span class="role">Marketing Director</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card stagger-item">
              <div class="stars">★★★★★</div>
              <p>"The quality of AI-generated videos is incredible. Our social media engagement has increased by 300%."</p>
              <div class="author">
                <div class="avatar">JC</div>
                <div class="info">
                  <span class="name">James Chen</span>
                  <span class="role">Content Creator</span>
                </div>
              </div>
            </div>
            <div class="testimonial-card stagger-item">
              <div class="stars">★★★★★</div>
              <p>"Best investment for our e-commerce store. Product videos that used to cost thousands now cost pennies."</p>
              <div class="author">
                <div class="avatar">ER</div>
                <div class="info">
                  <span class="name">Emma Rodriguez</span>
                  <span class="role">E-commerce Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content" @fadeInUp>
            <h2>Ready to Create Amazing Videos?</h2>
            <p>Join 50,000+ creators and businesses already using Kling AI</p>
            <div class="cta-actions">
              <a routerLink="/register" class="btn btn-primary btn-lg">
                Start Creating Free
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-5-5m5 5l-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <a routerLink="/pricing" class="btn btn-secondary btn-lg">
                View Pricing
              </a>
            </div>
            <p class="cta-note">No credit card required. Free plan available forever.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .landing-page {
      overflow-x: hidden;
    }

    /* Hero Section */
    .hero {
      position: relative;
      padding: 8rem 0 6rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
    }

    .hero-glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero .container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }

    .hero-content {
      position: relative;
      z-index: 1;
    }

    .badge-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-full);
      color: var(--primary-400);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--accent-emerald);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      letter-spacing: -0.03em;
    }

    .hero-description {
      font-size: 1.125rem;
      color: var(--text-secondary);
      max-width: 540px;
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .hero-stats {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border-light);
    }

    /* Hero Visual */
    .hero-visual {
      position: relative;
    }

    .video-preview {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 1rem;
      box-shadow: var(--shadow-xl);
    }

    .video-container {
      background: var(--bg-tertiary);
      border-radius: var(--radius-xl);
      aspect-ratio: 16/10;
      overflow: hidden;
      position: relative;
    }

    .video-placeholder {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .play-button {
      width: 64px;
      height: 64px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-glow);
      cursor: pointer;
      transition: transform 0.3s ease;
    }

    .play-button:hover {
      transform: scale(1.1);
    }

    .video-ui {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(transparent, rgba(0,0,0,0.5));
    }

    .timeline {
      background: rgba(255,255,255,0.2);
      height: 4px;
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-bar {
      height: 100%;
      background: var(--primary-500);
      border-radius: 2px;
    }

    .floating-card {
      position: absolute;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      box-shadow: var(--shadow-lg);
      animation: float 3s ease-in-out infinite;
    }

    .card-1 {
      top: -20px;
      right: -20px;
      animation-delay: 0s;
    }

    .card-2 {
      bottom: 40px;
      left: -30px;
      animation-delay: 1s;
    }

    .card-3 {
      bottom: -10px;
      right: 20px;
      animation-delay: 2s;
    }

    .card-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-glass);
      border-radius: var(--radius-md);
      font-size: 1rem;
    }

    /* Scroll Indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.75rem;
      cursor: pointer;
      animation: bounce 2s infinite;
    }

    .mouse {
      width: 24px;
      height: 36px;
      border: 2px solid var(--border-medium);
      border-radius: 12px;
      position: relative;
    }

    .wheel {
      width: 4px;
      height: 8px;
      background: var(--text-muted);
      border-radius: 2px;
      position: absolute;
      top: 6px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll 1.5s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-10px); }
    }

    @keyframes scroll {
      0% { opacity: 1; transform: translateX(-50%) translateY(0); }
      100% { opacity: 0; transform: translateX(-50%) translateY(12px); }
    }

    /* Logo Cloud */
    .logo-cloud {
      padding: 3rem 0;
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
    }

    .logo-cloud-title {
      text-align: center;
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-bottom: 2rem;
    }

    .logos {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4rem;
      flex-wrap: wrap;
    }

    .logo-item {
      color: var(--text-muted);
      font-size: 1.25rem;
      font-weight: 600;
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }

    .logo-item:hover {
      opacity: 1;
    }

    /* Section Styles */
    section {
      padding: 6rem 0;
    }

    .section-header {
      text-align: center;
      max-width: 640px;
      margin: 0 auto 4rem;
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
      margin-bottom: 1rem;
    }

    .section-title {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }

    .section-description {
      color: var(--text-secondary);
      font-size: 1.125rem;
    }

    /* Features Grid */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      transition: all 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.3);
      box-shadow: var(--shadow-lg);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin-bottom: 1.25rem;
    }

    .feature-icon svg {
      width: 24px;
      height: 24px;
    }

    .feature-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .feature-card p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    /* How It Works */
    .how-it-works {
      background: var(--bg-secondary);
    }

    .steps {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .step {
      display: grid;
      grid-template-columns: auto 1fr 1fr;
      gap: 2rem;
      align-items: center;
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
    }

    .step-number {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: white;
    }

    .step-content h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .step-content p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .step-visual {
      background: var(--bg-tertiary);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }

    /* Templates Preview */
    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .template-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .template-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.3);
    }

    .template-preview {
      aspect-ratio: 9/16;
      position: relative;
      background: var(--bg-tertiary);
    }

    .template-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.375rem 0.75rem;
      background: rgba(0,0,0,0.6);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .template-card h4 {
      padding: 1rem 1rem 0.5rem;
      font-weight: 600;
    }

    .template-card p {
      padding: 0 1rem 1rem;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .templates-cta {
      text-align: center;
    }

    /* Pricing */
    .pricing-preview {
      background: var(--bg-secondary);
    }

    .pricing-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      max-width: 1000px;
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
    }

    .pricing-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .price {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.25rem;
    }

    .currency {
      font-size: 1.5rem;
      font-weight: 600;
    }

    .amount {
      font-size: 3rem;
      font-weight: 800;
    }

    .period {
      color: var(--text-muted);
    }

    .pricing-features {
      list-style: none;
      margin-bottom: 2rem;
    }

    .pricing-features li {
      padding: 0.625rem 0;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      border-bottom: 1px solid var(--border-light);
    }

    .pricing-features li::before {
      content: '✓';
      margin-right: 0.5rem;
      color: var(--accent-emerald);
      font-weight: 600;
    }

    .pricing-card .btn {
      width: 100%;
    }

    .pricing-cta {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-secondary);
    }

    .pricing-cta a {
      color: var(--primary-400);
      text-decoration: none;
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .testimonial-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
    }

    .stars {
      color: #f59e0b;
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .testimonial-card > p {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .author {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .author .avatar {
      width: 44px;
      height: 44px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
    }

    .author .info {
      display: flex;
      flex-direction: column;
    }

    .author .name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .author .role {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    /* CTA Section */
    .cta-section {
      background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
      text-align: center;
    }

    .cta-content h2 {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 700;
      margin-bottom: 1rem;
    }

    .cta-content > p {
      color: var(--text-secondary);
      font-size: 1.125rem;
      margin-bottom: 2rem;
    }

    .cta-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .cta-note {
      color: var(--text-muted);
      font-size: 0.875rem;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .hero .container {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .hero-content {
        order: 1;
      }

      .hero-visual {
        order: 2;
      }

      .hero-description {
        margin-left: auto;
        margin-right: auto;
      }

      .hero-actions {
        justify-content: center;
      }

      .hero-stats {
        justify-content: center;
      }

      .step {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .pricing-card.featured {
        transform: none;
      }
    }

    @media (max-width: 640px) {
      section {
        padding: 4rem 0;
      }

      .hero {
        padding: 6rem 0 4rem;
      }

      .hero-stats {
        flex-direction: column;
        gap: 1rem;
      }

      .stat-divider {
        display: none;
      }

      .floating-card {
        display: none;
      }
    }
  `]
})
export class LandingComponent implements OnInit {
  ngOnInit() {
    // Initialize any scroll animations or observers
  }

  scrollToDemo() {
    // Implement smooth scroll to demo section
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToFeatures() {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-about',
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
        query('.stagger-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="about-page">
      <!-- Hero Section -->
      <section class="hero" @fadeInUp>
        <div class="container">
          <span class="section-badge">About Us</span>
          <h1>We're Building the Future of<br><span class="gradient-text">Video Creation</span></h1>
          <p class="hero-description">
            Kling AI was founded with a simple mission: make professional video creation accessible to everyone. 
            Using cutting-edge AI technology, we've helped over 50,000 creators and businesses bring their visions to life.
          </p>
        </div>
      </section>

      <!-- Mission Section -->
      <section class="mission" @stagger>
        <div class="container">
          <div class="mission-grid">
            <div class="mission-card stagger-item">
              <div class="mission-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>To democratize video creation by making AI-powered tools accessible, affordable, and easy to use for creators worldwide.</p>
            </div>
            <div class="mission-card stagger-item">
              <div class="mission-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>A world where anyone can create stunning, professional-quality videos in minutes, regardless of technical expertise or budget.</p>
            </div>
            <div class="mission-card stagger-item">
              <div class="mission-icon">💡</div>
              <h3>Our Values</h3>
              <p>Innovation, accessibility, and user empowerment. We believe technology should enhance creativity, not replace it.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="container">
          <div class="stats-grid" @stagger>
            <div class="stat-item stagger-item">
              <span class="stat-number">50K+</span>
              <span class="stat-label">Active Users</span>
            </div>
            <div class="stat-item stagger-item">
              <span class="stat-number">10M+</span>
              <span class="stat-label">Videos Created</span>
            </div>
            <div class="stat-item stagger-item">
              <span class="stat-number">150+</span>
              <span class="stat-label">Countries</span>
            </div>
            <div class="stat-item stagger-item">
              <span class="stat-number">4.9</span>
              <span class="stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section -->
      <section class="team">
        <div class="container">
          <div class="section-header" @fadeInUp>
            <span class="section-badge">Our Team</span>
            <h2>Meet the People Behind Kling AI</h2>
            <p>A diverse team of engineers, designers, and creative professionals</p>
          </div>
          <div class="team-grid" @stagger>
            <div class="team-member stagger-item">
              <div class="member-avatar">AJ</div>
              <h4>Alex Johnson</h4>
              <span class="member-role">CEO & Co-founder</span>
              <p>Former Google AI researcher with 10+ years in machine learning.</p>
            </div>
            <div class="team-member stagger-item">
              <div class="member-avatar">SC</div>
              <h4>Sarah Chen</h4>
              <span class="member-role">CTO & Co-founder</span>
              <p>PhD in Computer Vision from MIT, ex-OpenAI engineer.</p>
            </div>
            <div class="team-member stagger-item">
              <div class="member-avatar">MR</div>
              <h4>Michael Rodriguez</h4>
              <span class="member-role">Head of Design</span>
              <p>Previously led design teams at Adobe and Figma.</p>
            </div>
            <div class="team-member stagger-item">
              <div class="member-avatar">EW</div>
              <h4>Emily Watson</h4>
              <span class="member-role">Head of Product</span>
              <p>Product leader with experience at Netflix and Spotify.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content" @fadeInUp>
            <h2>Join Our Growing Team</h2>
            <p>We're always looking for talented individuals who are passionate about AI and creativity.</p>
            <a href="#" class="btn btn-primary btn-lg">View Open Positions</a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-page {
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

    .mission {
      padding: 4rem 0;
      background: var(--bg-secondary);
    }

    .mission-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }

    .mission-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      text-align: center;
    }

    .mission-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .mission-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.75rem;
    }

    .mission-card p {
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .stats-section {
      padding: 4rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }

    .stat-item {
      text-align: center;
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .team {
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

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .team-member {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: center;
    }

    .member-avatar {
      width: 80px;
      height: 80px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 auto 1rem;
    }

    .team-member h4 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .member-role {
      display: block;
      color: var(--primary-400);
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }

    .team-member p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
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
  `]
})
export class AboutComponent {}

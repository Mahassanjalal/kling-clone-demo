import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-analytics',
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
        query('.stat-card, .chart-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="analytics-page" @fadeIn>
      <div class="container">
        <div class="page-header">
          <h1>Analytics Dashboard</h1>
          <p class="subtitle">Track your video performance and usage metrics</p>
        </div>

        <div class="stats-grid" @stagger>
          <div class="stat-card">
            <div class="stat-icon">👀</div>
            <div class="stat-info">
              <span class="stat-value">45.2K</span>
              <span class="stat-label">Total Views</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-info">
              <span class="stat-value">3:24</span>
              <span class="stat-label">Avg Watch Time</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-info">
              <span class="stat-value">12.5%</span>
              <span class="stat-label">Engagement Rate</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-info">
              <span class="stat-value">8.3%</span>
              <span class="stat-label">CTR</span>
            </div>
          </div>
        </div>

        <div class="charts-section" @stagger>
          <div class="chart-card">
            <h3>Video Views Over Time</h3>
            <div class="chart-placeholder">
              <div class="mock-chart">
                <div class="bar" style="height: 40%"></div>
                <div class="bar" style="height: 60%"></div>
                <div class="bar" style="height: 45%"></div>
                <div class="bar" style="height: 80%"></div>
                <div class="bar" style="height: 65%"></div>
                <div class="bar" style="height: 90%"></div>
                <div class="bar" style="height: 75%"></div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <h3>Usage by Platform</h3>
            <div class="platform-stats">
              <div class="platform-item">
                <span class="platform-name">TikTok</span>
                <div class="progress-bar">
                  <div class="progress" style="width: 45%"></div>
                </div>
                <span class="percentage">45%</span>
              </div>
              <div class="platform-item">
                <span class="platform-name">Instagram</span>
                <div class="progress-bar">
                  <div class="progress" style="width: 30%"></div>
                </div>
                <span class="percentage">30%</span>
              </div>
              <div class="platform-item">
                <span class="platform-name">YouTube</span>
                <div class="progress-bar">
                  <div class="progress" style="width: 25%"></div>
                </div>
                <span class="percentage">25%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-page {
      padding: 2rem 0;
    }

    .page-header {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      font-size: 2rem;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .chart-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .chart-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: var(--text-secondary);
    }

    .chart-placeholder {
      height: 200px;
      display: flex;
      align-items: flex-end;
      padding: 1rem 0;
    }

    .mock-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      width: 100%;
      height: 100%;
      gap: 1rem;
    }

    .bar {
      flex: 1;
      background: var(--gradient-primary);
      border-radius: var(--radius-sm) var(--radius-sm) 0 0;
      min-width: 30px;
    }

    .platform-stats {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .platform-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .platform-name {
      width: 100px;
      font-size: 0.875rem;
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: var(--bg-tertiary);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 4px;
    }

    .percentage {
      width: 50px;
      text-align: right;
      font-size: 0.875rem;
      font-weight: 600;
    }
  `]
})
export class AnalyticsComponent {}

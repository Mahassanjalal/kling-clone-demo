import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService, User, Subscription } from '../../services/auth.service';
import { DashboardData, UserService } from '../../services/user.service';
import { VideoJob } from '../../services/video.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('staggerCards', [
      transition(':enter', [
        query('.stat-card, .quick-action, .video-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="dashboard-page" @staggerCards>
      <div class="container">
        <!-- Welcome Section -->
        <div class="welcome-section">
          <div class="welcome-text">
            <h1>Welcome back, {{ currentUser?.name?.split(' ')[0] }}! 👋</h1>
            <p>Here's what's happening with your videos</p>
          </div>
          <div class="welcome-actions">
            <a routerLink="/create" class="btn btn-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Video
            </a>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboardData?.stats?.totalVideos || 0 }}</span>
              <span class="stat-label">Total Videos</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboardData?.stats?.completedVideos || 0 }}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon warning">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ dashboardData?.stats?.processingVideos || 0 }}</span>
              <span class="stat-label">Processing</span>
            </div>
          </div>

          <div class="stat-card credits-card">
            <div class="stat-icon accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value credits">{{ currentUser?.credits || 0 }}</span>
              <span class="stat-label">Credits</span>
            </div>
            <a routerLink="/credits" class="add-credits">+ Add</a>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="section">
          <h2 class="section-title">Quick Actions</h2>
          <div class="quick-actions">
            <a routerLink="/create" class="quick-action">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <span>Text to Video</span>
            </a>
            <a routerLink="/templates" class="quick-action">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span>Templates</span>
            </a>
            <a routerLink="/new-project" class="quick-action">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <span>New Project</span>
            </a>
            <a routerLink="/brand-kits" class="quick-action">
              <div class="action-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <span>Brand Kit</span>
            </a>
          </div>
        </div>

        <!-- Recent Videos -->
        <div class="section">
          <div class="section-header">
            <h2 class="section-title">Recent Videos</h2>
            <a routerLink="/videos" class="btn btn-ghost">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div class="videos-grid" *ngIf="recentVideos.length > 0">
            <div class="video-item" *ngFor="let video of recentVideos" [routerLink]="['/video', video.id]">
              <div class="video-thumbnail">
                <img *ngIf="video.thumbnailUrl" [src]="video.thumbnailUrl" [alt]="video.prompt">
                <div class="placeholder" *ngIf="!video.thumbnailUrl">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div class="status-badge" [class]="video.status">
                  {{ video.status }}
                </div>
                <div class="progress-overlay" *ngIf="video.status === 'processing'">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="video.progress"></div>
                  </div>
                  <span class="progress-text">{{ video.progress }}%</span>
                </div>
              </div>
              <div class="video-info">
                <p class="video-prompt">{{ video.prompt | slice:0:50 }}{{ video.prompt.length > 50 ? '...' : '' }}</p>
                <span class="video-date">{{ video.createdAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="recentVideos.length === 0">
            <div class="empty-icon">🎬</div>
            <h3>No videos yet</h3>
            <p>Create your first AI video to get started</p>
            <a routerLink="/create" class="btn btn-primary">Create Video</a>
          </div>
        </div>

        <!-- Subscription Status -->
        <div class="section" *ngIf="subscription">
          <div class="subscription-card">
            <div class="subscription-info">
              <div class="plan-badge" [class]="subscription.plan">
                {{ subscription.plan | uppercase }}
              </div>
              <div class="usage-info">
                <div class="usage-item">
                  <span class="usage-label">Videos This Month</span>
                  <div class="usage-bar">
                    <div class="usage-fill" [style.width.%]="getUsagePercentage()"></div>
                  </div>
                  <span class="usage-value">{{ subscription.usage?.videosThisMonth || 0 }} / {{ subscription.features?.maxVideosPerMonth || '∞' }}</span>
                </div>
              </div>
            </div>
            <a routerLink="/settings/billing" class="btn btn-secondary">Manage Plan</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem 0;
    }

    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .welcome-text h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .welcome-text p {
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
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.primary {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-400);
    }

    .stat-icon.success {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    .stat-icon.warning {
      background: rgba(245, 158, 11, 0.2);
      color: var(--accent-amber);
    }

    .stat-icon.accent {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
    }

    .stat-value.credits {
      color: #f59e0b;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .credits-card {
      position: relative;
    }

    .add-credits {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      padding: 0.25rem 0.75rem;
      background: rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-full);
      color: #f59e0b;
      font-size: 0.75rem;
      font-weight: 600;
      text-decoration: none;
    }

    .section {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 1rem;
    }

    .quick-action {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: center;
      text-decoration: none;
      color: var(--text-primary);
      transition: all 0.3s ease;
    }

    .quick-action:hover {
      transform: translateY(-2px);
      border-color: var(--border-medium);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      background: var(--bg-glass);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.75rem;
      color: var(--primary-400);
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }

    .video-item {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .video-item:hover {
      transform: translateY(-4px);
      border-color: var(--border-medium);
    }

    .video-thumbnail {
      position: relative;
      aspect-ratio: 16/9;
      background: var(--bg-tertiary);
      overflow: hidden;
    }

    .video-thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
    }

    .status-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.completed {
      background: rgba(16, 185, 129, 0.9);
      color: white;
    }

    .status-badge.processing {
      background: rgba(245, 158, 11, 0.9);
      color: white;
    }

    .status-badge.pending {
      background: rgba(156, 163, 175, 0.9);
      color: white;
    }

    .progress-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      padding: 0.75rem;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.25rem;
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-500);
      transition: width 0.3s ease;
    }

    .progress-text {
      color: white;
      font-size: 0.75rem;
      text-align: center;
    }

    .video-info {
      padding: 1rem;
    }

    .video-prompt {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .video-date {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      background: var(--bg-card);
      border: 1px dashed var(--border-light);
      border-radius: var(--radius-xl);
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .subscription-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .subscription-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .plan-badge {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      font-weight: 700;
    }

    .plan-badge.free {
      background: rgba(156, 163, 175, 0.2);
      color: #9ca3af;
    }

    .plan-badge.pro {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-400);
    }

    .plan-badge.business {
      background: rgba(139, 92, 246, 0.2);
      color: var(--accent-purple);
    }

    .usage-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: 200px;
    }

    .usage-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .usage-bar {
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 3px;
      overflow: hidden;
    }

    .usage-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .usage-value {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .subscription-card {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
      }

      .subscription-info {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  subscription: Subscription | null = null;
  dashboardData: DashboardData | null = null;
  recentVideos: VideoJob[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.authService.subscription$.subscribe(subscription => {
      this.subscription = subscription;
    });

    this.loadDashboard();
  }

  loadDashboard() {
    this.userService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.recentVideos = data.recentVideos || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getUsagePercentage(): number {
    if (!this.subscription) return 0;
    const max = this.subscription.features?.maxVideosPerMonth;
    if (max === -1 || !max) return 0;
    const current = this.subscription.usage?.videosThisMonth || 0;
    return Math.min((current / max) * 100, 100);
  }
}
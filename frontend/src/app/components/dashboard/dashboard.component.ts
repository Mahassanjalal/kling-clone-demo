import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardData, UserService } from '../../../services/user.service';
import { VideoJob } from '../../../services/video.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p class="welcome-text">Welcome back, {{ dashboardData?.user?.name }}</p>
        </div>
        <a routerLink="/generate" class="btn btn-primary">
          <span>+</span> Create New Video
        </a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🎬</div>
          <div class="stat-info">
            <h3>{{ dashboardData?.stats?.totalVideos || 0 }}</h3>
            <p>Total Videos</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon completed">✓</div>
          <div class="stat-info">
            <h3>{{ dashboardData?.stats?.completedVideos || 0 }}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon processing">⏳</div>
          <div class="stat-info">
            <h3>{{ dashboardData?.stats?.processingVideos || 0 }}</h3>
            <p>Processing</p>
          </div>
        </div>

        <div class="stat-card credits">
          <div class="stat-icon">⚡</div>
          <div class="stat-info">
            <h3>{{ dashboardData?.stats?.creditsRemaining || 0 }}</h3>
            <p>Credits Remaining</p>
          </div>
        </div>
      </div>

      <div class="recent-videos">
        <h2>Recent Videos</h2>
        
        <div *ngIf="!dashboardData?.recentVideos?.length" class="empty-state">
          <div class="empty-icon">🎥</div>
          <h3>No videos yet</h3>
          <p>Create your first AI-generated video now</p>
          <a routerLink="/generate" class="btn btn-primary">Create Video</a>
        </div>

        <div class="videos-grid" *ngIf="dashboardData?.recentVideos?.length">
          <div 
            class="video-card" 
            *ngFor="let video of dashboardData?.recentVideos"
            [routerLink]="['/video', video.id]"
          >
            <div class="video-thumbnail">
              <img 
                *ngIf="video.thumbnailUrl" 
                [src]="video.thumbnailUrl" 
                alt="Video thumbnail"
              >
              <div class="placeholder" *ngIf="!video.thumbnailUrl">
                <span>🎬</span>
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
              <p class="video-prompt" [title]="video.prompt">
                {{ video.prompt | slice:0:60 }}{{ video.prompt.length > 60 ? '...' : '' }}
              </p>
              <span class="video-date">{{ video.createdAt | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <div class="view-all" *ngIf="dashboardData?.recentVideos?.length">
          <a routerLink="/gallery" class="btn btn-outline">View All Videos</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #fff;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .welcome-text {
      color: #a0a0a0;
      font-size: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.3s;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #fff;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: transform 0.3s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
    }

    .stat-card.credits {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 215, 0, 0.05) 100%);
      border-color: rgba(255, 215, 0, 0.3);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: rgba(102, 126, 234, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .stat-icon.completed {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }

    .stat-icon.processing {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .stat-card.credits .stat-icon {
      background: rgba(255, 215, 0, 0.2);
    }

    .stat-info h3 {
      color: #fff;
      font-size: 1.75rem;
      margin: 0;
    }

    .stat-info p {
      color: #a0a0a0;
      margin: 0;
      font-size: 0.9rem;
    }

    .recent-videos {
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .recent-videos h2 {
      color: #fff;
      margin-bottom: 1.5rem;
      font-size: 1.5rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      color: #fff;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #a0a0a0;
      margin-bottom: 1.5rem;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .video-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .video-card:hover {
      transform: translateY(-4px);
      border-color: rgba(102, 126, 234, 0.5);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .video-thumbnail {
      position: relative;
      aspect-ratio: 16/9;
      background: rgba(0, 0, 0, 0.3);
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
      font-size: 3rem;
    }

    .status-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .status-badge.completed {
      background: rgba(76, 175, 80, 0.9);
      color: #fff;
    }

    .status-badge.processing {
      background: rgba(255, 193, 7, 0.9);
      color: #000;
    }

    .status-badge.pending {
      background: rgba(158, 158, 158, 0.9);
      color: #fff;
    }

    .status-badge.failed {
      background: rgba(244, 67, 54, 0.9);
      color: #fff;
    }

    .progress-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.8);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .progress-bar {
      height: 4px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s;
    }

    .progress-text {
      color: #fff;
      font-size: 0.75rem;
      text-align: center;
    }

    .video-info {
      padding: 1rem;
    }

    .video-prompt {
      color: #e0e0e0;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }

    .video-date {
      color: #666;
      font-size: 0.8rem;
    }

    .view-all {
      text-align: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  isLoading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.userService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }
}
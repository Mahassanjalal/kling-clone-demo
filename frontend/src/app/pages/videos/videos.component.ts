import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, VideoJob } from '../../services/video.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('stagger', [
      transition(':enter', [
        query('.video-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="videos-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>My Videos</h1>
            <p class="subtitle">Manage and view all your generated videos</p>
          </div>
          <a routerLink="/create" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Create New
          </a>
        </div>

        <div class="filters-bar">
          <div class="filter-tabs">
            <button [class.active]="activeFilter === 'all'" (click)="setFilter('all')">All Videos</button>
            <button [class.active]="activeFilter === 'completed'" (click)="setFilter('completed')">Completed</button>
            <button [class.active]="activeFilter === 'processing'" (click)="setFilter('processing')">Processing</button>
          </div>
        </div>

        <div class="videos-grid" @stagger *ngIf="!isLoading && filteredVideos.length > 0">
          <div class="video-card" *ngFor="let video of filteredVideos" [routerLink]="['/video', video.id]">
            <div class="video-thumbnail">
              <img *ngIf="video.thumbnailUrl" [src]="video.thumbnailUrl" [alt]="video.prompt">
              <div class="placeholder" *ngIf="!video.thumbnailUrl">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div class="status-badge" [class]="video.status">{{ video.status }}</div>
              <div class="progress-overlay" *ngIf="video.status === 'processing'">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="video.progress"></div>
                </div>
              </div>
            </div>
            <div class="video-info">
              <p class="video-prompt">{{ video.prompt | slice:0:70 }}{{ video.prompt.length > 70 ? '...' : '' }}</p>
              <div class="video-meta">
                <span class="date">{{ video.createdAt | date:'mediumDate' }}</span>
                <span class="credits">{{ video.creditsUsed }} credits</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!isLoading && filteredVideos.length === 0">
          <div class="empty-icon">🎬</div>
          <h3>No videos found</h3>
          <p *ngIf="activeFilter === 'all'">Create your first video to get started</p>
          <p *ngIf="activeFilter !== 'all'">No {{ activeFilter }} videos found</p>
          <a routerLink="/create" class="btn btn-primary" *ngIf="activeFilter === 'all'">Create Video</a>
        </div>

        <div class="loading" *ngIf="isLoading">
          <div class="spinner-large"></div>
          <p>Loading videos...</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .videos-page {
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

    .filters-bar {
      margin-bottom: 2rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: var(--bg-card);
      padding: 0.5rem;
      border-radius: var(--radius-lg);
      width: fit-content;
    }

    .filter-tabs button {
      padding: 0.5rem 1.25rem;
      background: transparent;
      border: none;
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-tabs button.active {
      background: var(--primary-500);
      color: white;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .video-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .video-card:hover {
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
    }

    .progress-fill {
      height: 100%;
      background: var(--primary-500);
      transition: width 0.3s ease;
    }

    .video-info {
      padding: 1rem;
    }

    .video-prompt {
      font-size: 0.9375rem;
      margin-bottom: 0.75rem;
      line-height: 1.5;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8125rem;
      color: var(--text-muted);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-card);
      border: 1px dashed var(--border-light);
      border-radius: var(--radius-xl);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .loading {
      text-align: center;
      padding: 4rem;
    }

    .spinner-large {
      width: 48px;
      height: 48px;
      border: 3px solid var(--border-light);
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class VideosComponent implements OnInit {
  videos: VideoJob[] = [];
  filteredVideos: VideoJob[] = [];
  isLoading = true;
  activeFilter = 'all';

  constructor(private videoService: VideoService) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    this.isLoading = true;
    this.videoService.getMyVideos().subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter() {
    if (this.activeFilter === 'all') {
      this.filteredVideos = this.videos;
    } else {
      this.filteredVideos = this.videos.filter(v => v.status === this.activeFilter);
    }
  }
}

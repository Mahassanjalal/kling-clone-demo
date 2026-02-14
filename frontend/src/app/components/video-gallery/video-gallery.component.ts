import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VideoService, VideoJob } from '../../services/video.service';

@Component({
  selector: 'app-video-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="gallery-container">
      <div class="gallery-header">
        <h1>My Videos</h1>
        <a routerLink="/generate" class="btn btn-primary">
          <span>+</span> Create New
        </a>
      </div>

      <div class="filter-bar">
        <div class="filter-tabs">
          <button 
            *ngFor="let filter of filters"
            [class.active]="activeFilter === filter.value"
            (click)="setFilter(filter.value)"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <div class="videos-grid" *ngIf="!isLoading && filteredVideos.length > 0">
        <div 
          class="video-card" 
          *ngFor="let video of filteredVideos"
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
              {{ video.prompt | slice:0:80 }}{{ video.prompt.length > 80 ? '...' : '' }}
            </p>
            <div class="video-meta">
              <span class="video-date">{{ video.createdAt | date:'mediumDate' }}</span>
              <span class="video-settings">
                {{ video.settings.duration }}s • {{ video.settings.resolution }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredVideos.length === 0">
        <div class="empty-icon">🎥</div>
        <h3>No videos found</h3>
        <p *ngIf="activeFilter === 'all'">Create your first AI-generated video now</p>
        <p *ngIf="activeFilter !== 'all'">No {{ activeFilter }} videos found</p>
        <a routerLink="/generate" class="btn btn-primary" *ngIf="activeFilter === 'all'">
          Create Video
        </a>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading videos...</p>
      </div>

      <div class="pagination" *ngIf="pagination.pages > 1">
        <button 
          [disabled]="pagination.page === 1"
          (click)="changePage(pagination.page - 1)"
        >
          ← Previous
        </button>
        <span class="page-info">
          Page {{ pagination.page }} of {{ pagination.pages }}
        </span>
        <button 
          [disabled]="pagination.page === pagination.pages"
          (click)="changePage(pagination.page + 1)"
        >
          Next →
        </button>
      </div>
    </div>
  `,
  styles: [`
    .gallery-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    h1 {
      color: #fff;
      font-size: 2rem;
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

    .filter-bar {
      margin-bottom: 2rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem;
      border-radius: 12px;
      width: fit-content;
    }

    .filter-tabs button {
      padding: 0.5rem 1.25rem;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #a0a0a0;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 0.9rem;
    }

    .filter-tabs button:hover {
      color: #e0e0e0;
    }

    .filter-tabs button.active {
      background: rgba(102, 126, 234, 0.3);
      color: #fff;
    }

    .videos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
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
      margin-bottom: 0.75rem;
      line-height: 1.4;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
    }

    .video-date {
      color: #666;
    }

    .video-settings {
      color: #667eea;
      font-weight: 500;
    }

    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 16px;
      border: 1px dashed rgba(255, 255, 255, 0.2);
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

    .loading {
      text-align: center;
      padding: 5rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading p {
      color: #a0a0a0;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 3rem;
    }

    .pagination button {
      padding: 0.75rem 1.5rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
    }

    .pagination button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    .pagination button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .page-info {
      color: #a0a0a0;
    }
  `]
})
export class VideoGalleryComponent implements OnInit {
  videos: VideoJob[] = [];
  filteredVideos: VideoJob[] = [];
  isLoading = true;
  activeFilter = 'all';
  
  filters = [
    { value: 'all', label: 'All Videos' },
    { value: 'completed', label: 'Completed' },
    { value: 'processing', label: 'Processing' },
    { value: 'pending', label: 'Pending' }
  ];

  pagination = {
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  };

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
    this.loadVideos();
  }

  loadVideos(): void {
    this.isLoading = true;
    this.videoService.getMyVideos(this.pagination.page, this.pagination.limit).subscribe({
      next: (response) => {
        this.videos = response.videos;
        this.pagination = response.pagination;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.activeFilter === 'all') {
      this.filteredVideos = this.videos;
    } else {
      this.filteredVideos = this.videos.filter(v => v.status === this.activeFilter);
    }
  }

  changePage(page: number): void {
    this.pagination.page = page;
    this.loadVideos();
  }
}
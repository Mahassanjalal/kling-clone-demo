import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideoService, VideoJob, VideoStatusResponse } from '../../services/video.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-video-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-container">
      <div class="detail-header">
        <a routerLink="/gallery" class="back-link">← Back to Gallery</a>
        <div class="actions">
          <button 
            *ngIf="video?.status === 'completed' && video?.outputUrl"
            class="btn btn-primary"
            (click)="downloadVideo()"
          >
            Download
          </button>
          <button class="btn btn-danger" (click)="deleteVideo()">
            Delete
          </button>
        </div>
      </div>

      <div class="detail-content" *ngIf="video">
        <div class="video-player">
          <div class="video-container" *ngIf="video.status === 'completed' && video.outputUrl">
            <video controls [poster]="video.thumbnailUrl || ''">
              <source [src]="video.outputUrl" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>
          
          <div class="processing-state" *ngIf="video.status === 'processing'">
            <div class="processing-animation">
              <div class="spinner-large"></div>
            </div>
            <h3>Generating Your Video</h3>
            <div class="progress-section">
              <div class="progress-bar-large">
                <div class="progress-fill" [style.width.%]="video.progress"></div>
              </div>
              <span class="progress-percent">{{ video.progress }}%</span>
            </div>
            <p class="processing-text">This may take a few minutes...</p>
          </div>

          <div class="pending-state" *ngIf="video.status === 'pending'">
            <div class="pending-icon">⏳</div>
            <h3>In Queue</h3>
            <p>Your video is waiting to be processed...</p>
          </div>

          <div class="failed-state" *ngIf="video.status === 'failed'">
            <div class="failed-icon">❌</div>
            <h3>Generation Failed</h3>
            <p>{{ video.errorMessage || 'Something went wrong. Please try again.' }}</p>
            <button class="btn btn-primary" routerLink="/generate">
              Try Again
            </button>
          </div>
        </div>

        <div class="video-details">
          <div class="detail-card">
            <h3>Prompt</h3>
            <p class="prompt-text">{{ video.prompt }}</p>
          </div>

          <div class="detail-card">
            <h3>Settings</h3>
            <div class="settings-grid">
              <div class="setting-item">
                <span class="label">Duration</span>
                <span class="value">{{ video.settings.duration }} seconds</span>
              </div>
              <div class="setting-item">
                <span class="label">Resolution</span>
                <span class="value">{{ video.settings.resolution }}</span>
              </div>
              <div class="setting-item">
                <span class="label">Aspect Ratio</span>
                <span class="value">{{ video.settings.aspectRatio }}</span>
              </div>
              <div class="setting-item">
                <span class="label">Style</span>
                <span class="value">{{ video.settings.style | titlecase }}</span>
              </div>
              <div class="setting-item">
                <span class="label">Camera Movement</span>
                <span class="value">{{ video.settings.cameraMovement | titlecase }}</span>
              </div>
            </div>
          </div>

          <div class="detail-card">
            <h3>Details</h3>
            <div class="details-list">
              <div class="detail-item">
                <span class="label">Status</span>
                <span class="value status-badge" [class]="video.status">
                  {{ video.status | titlecase }}
                </span>
              </div>
              <div class="detail-item">
                <span class="label">Created</span>
                <span class="value">{{ video.createdAt | date:'medium' }}</span>
              </div>
              <div class="detail-item" *ngIf="video.completedAt">
                <span class="label">Completed</span>
                <span class="value">{{ video.completedAt | date:'medium' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Credits Used</span>
                <span class="value credits">{{ video.creditsUsed }} ⚡</span>
              </div>
            </div>
          </div>

          <div class="detail-card" *ngIf="video.referenceImage">
            <h3>Reference Image</h3>
            <div class="reference-image">
              <img [src]="'/uploads/' + video.referenceImage" alt="Reference">
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="!video && isLoading">
        <div class="spinner-large"></div>
        <p>Loading video...</p>
      </div>
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .back-link {
      color: #a0a0a0;
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.3s;
    }

    .back-link:hover {
      color: #fff;
    }

    .actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      transition: all 0.3s;
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

    .btn-danger {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }

    .btn-danger:hover {
      background: rgba(255, 107, 107, 0.3);
    }

    .detail-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .detail-content {
        grid-template-columns: 1fr;
      }
    }

    .video-player {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .video-container {
      aspect-ratio: 16/9;
      background: #000;
    }

    .video-container video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .processing-state,
    .pending-state,
    .failed-state {
      aspect-ratio: 16/9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
      text-align: center;
    }

    .processing-animation {
      margin-bottom: 1.5rem;
    }

    .spinner-large {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(102, 126, 234, 0.2);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .processing-state h3,
    .pending-state h3,
    .failed-state h3 {
      color: #fff;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .progress-section {
      width: 100%;
      max-width: 300px;
      margin-bottom: 1rem;
    }

    .progress-bar-large {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      border-radius: 4px;
      transition: width 0.3s;
    }

    .progress-percent {
      color: #667eea;
      font-weight: 600;
    }

    .processing-text,
    .pending-state p,
    .failed-state p {
      color: #a0a0a0;
    }

    .pending-icon,
    .failed-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .video-details {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .detail-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .detail-card h3 {
      color: #fff;
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }

    .prompt-text {
      color: #e0e0e0;
      line-height: 1.6;
      font-size: 0.95rem;
    }

    .settings-grid {
      display: grid;
      gap: 0.75rem;
    }

    .setting-item,
    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .setting-item:last-child,
    .detail-item:last-child {
      border-bottom: none;
    }

    .label {
      color: #a0a0a0;
      font-size: 0.9rem;
    }

    .value {
      color: #e0e0e0;
      font-weight: 500;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      text-transform: capitalize;
    }

    .status-badge.completed {
      background: rgba(76, 175, 80, 0.2);
      color: #4caf50;
    }

    .status-badge.processing {
      background: rgba(255, 193, 7, 0.2);
      color: #ffc107;
    }

    .status-badge.pending {
      background: rgba(158, 158, 158, 0.2);
      color: #9e9e9e;
    }

    .status-badge.failed {
      background: rgba(244, 67, 54, 0.2);
      color: #f44336;
    }

    .credits {
      color: #ffd700;
    }

    .reference-image {
      border-radius: 8px;
      overflow: hidden;
    }

    .reference-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .loading {
      text-align: center;
      padding: 5rem;
    }

    .loading p {
      color: #a0a0a0;
      margin-top: 1rem;
    }
  `]
})
export class VideoDetailComponent implements OnInit, OnDestroy {
  video: VideoJob | null = null;
  isLoading = true;
  private statusSubscription?: Subscription;
  private videoId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.videoId = this.route.snapshot.paramMap.get('id') || '';
    this.loadVideo();
  }

  ngOnDestroy(): void {
    this.stopStatusPolling();
  }

  loadVideo(): void {
    this.isLoading = true;
    this.videoService.getVideo(this.videoId).subscribe({
      next: (response) => {
        this.video = response.video;
        this.isLoading = false;
        
        if (this.video.status === 'processing' || this.video.status === 'pending') {
          this.startStatusPolling();
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  startStatusPolling(): void {
    this.statusSubscription = interval(3000).subscribe(() => {
      this.videoService.getVideoStatus(this.videoId).subscribe({
        next: (status: VideoStatusResponse) => {
          if (this.video) {
            this.video.status = status.status as any;
            this.video.progress = status.progress;
            this.video.outputUrl = status.outputUrl;
            this.video.thumbnailUrl = status.thumbnailUrl;
            
            if (status.status === 'completed' || status.status === 'failed') {
              this.stopStatusPolling();
              if (status.status === 'completed') {
                this.video.completedAt = new Date().toISOString();
              }
            }
          }
        }
      });
    });
  }

  stopStatusPolling(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }

  downloadVideo(): void {
    if (this.video?.outputUrl) {
      window.open(this.video.outputUrl, '_blank');
    }
  }

  deleteVideo(): void {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(this.videoId).subscribe({
        next: () => {
          this.router.navigate(['/gallery']);
        }
      });
    }
  }
}
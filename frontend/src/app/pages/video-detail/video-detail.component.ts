import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VideoService, VideoJob } from '../../services/video.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-video-detail',
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
    <div class="video-detail-page" @fadeIn>
      <div class="container">
        <div class="back-link">
          <a routerLink="/videos">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Videos
          </a>
        </div>

        <div class="video-content" *ngIf="video">
          <div class="video-player-section">
            <div class="video-player" *ngIf="video.status === 'completed' && video.outputUrl">
              <video controls [poster]="video.thumbnailUrl || ''">
                <source [src]="video.outputUrl" type="video/mp4">
              </video>
            </div>

            <div class="processing-state" *ngIf="video.status === 'processing'">
              <div class="spinner-large"></div>
              <h3>Generating Your Video</h3>
              <div class="progress-section">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="video.progress"></div>
                </div>
                <span class="progress-text">{{ video.progress }}%</span>
              </div>
            </div>

            <div class="pending-state" *ngIf="video.status === 'pending'">
              <div class="pending-icon">⏳</div>
              <h3>In Queue</h3>
              <p>Your video is waiting to be processed...</p>
            </div>
          </div>

          <div class="video-info-section">
            <div class="info-card">
              <h3>Prompt</h3>
              <p class="prompt-text">{{ video.prompt }}</p>
            </div>

            <div class="info-card">
              <h3>Settings</h3>
              <div class="settings-grid">
                <div class="setting-item">
                  <span class="label">Duration</span>
                  <span class="value">{{ video.settings.duration }}s</span>
                </div>
                <div class="setting-item">
                  <span class="label">Resolution</span>
                  <span class="value">{{ video.settings.resolution }}</span>
                </div>
                <div class="setting-item">
                  <span class="label">Style</span>
                  <span class="value">{{ video.settings.style | titlecase }}</span>
                </div>
                <div class="setting-item">
                  <span class="label">Credits Used</span>
                  <span class="value credits">{{ video.creditsUsed }}</span>
                </div>
              </div>
            </div>

            <div class="actions">
              <button *ngIf="video.status === 'completed'" class="btn btn-primary btn-block" (click)="downloadVideo()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download Video
              </button>
              <button class="btn btn-secondary btn-block" (click)="regenerateVideo()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="23 4 23 10 17 10"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                Regenerate
              </button>
              <button class="btn btn-danger btn-block" (click)="deleteVideo()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-detail-page {
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
      font-size: 0.9375rem;
      transition: color 0.2s ease;
    }

    .back-link a:hover {
      color: var(--text-primary);
    }

    .video-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .video-player-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    .video-player video {
      width: 100%;
      display: block;
    }

    .processing-state,
    .pending-state {
      aspect-ratio: 16/9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }

    .spinner-large {
      width: 48px;
      height: 48px;
      border: 3px solid var(--border-light);
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .pending-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .progress-section {
      width: 100%;
      max-width: 300px;
    }

    .progress-bar {
      height: 6px;
      background: var(--bg-tertiary);
      border-radius: 3px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }

    .progress-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .video-info-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .info-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .info-card h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-secondary);
    }

    .prompt-text {
      font-size: 1rem;
      line-height: 1.6;
    }

    .settings-grid {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-light);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .value {
      font-weight: 500;
    }

    .value.credits {
      color: #f59e0b;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-block {
      width: 100%;
      justify-content: center;
    }

    @media (max-width: 968px) {
      .video-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class VideoDetailComponent implements OnInit {
  video: VideoJob | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    const videoId = this.route.snapshot.paramMap.get('id');
    if (videoId) {
      this.loadVideo(videoId);
    }
  }

  loadVideo(id: string) {
    this.videoService.getVideo(id).subscribe({
      next: (response) => {
        this.video = response.video;
      }
    });
  }

  downloadVideo() {
    if (this.video?.outputUrl) {
      window.open(this.video.outputUrl, '_blank');
    }
  }

  regenerateVideo() {
    if (this.video) {
      this.videoService.regenerateVideo(this.video.id).subscribe({
        next: () => {
          alert('Video regeneration started!');
        }
      });
    }
  }

  deleteVideo() {
    if (confirm('Are you sure you want to delete this video?')) {
      this.videoService.deleteVideo(this.video!.id).subscribe({
        next: () => {
          this.router.navigate(['/videos']);
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-video-generator',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerOptions', [
      transition(':enter', [
        query('.option-card', [
          style({ opacity: 0, transform: 'scale(0.95)' }),
          stagger(50, [
            animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'scale(1)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="video-generator-page">
      <div class="container" @fadeIn>
        <!-- Header -->
        <div class="page-header">
          <div class="header-content">
            <h1>Create AI Video</h1>
            <p>Transform your ideas into stunning videos in minutes</p>
          </div>
          <div class="credits-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>{{ credits }} credits</span>
          </div>
        </div>

        <!-- Generator Form -->
        <div class="generator-layout">
          <!-- Left: Input Section -->
          <div class="input-section">
            <div class="input-card">
              <div class="input-tabs">
                <button 
                  class="tab" 
                  [class.active]="activeTab === 'text'"
                  (click)="activeTab = 'text'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Text to Video
                </button>
                <button 
                  class="tab" 
                  [class.active]="activeTab === 'image'"
                  (click)="activeTab = 'image'"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  Image to Video
                </button>
              </div>

              <div class="input-content">
                <!-- Text Input -->
                <div *ngIf="activeTab === 'text'" class="text-input-area">
                  <label>Describe your video</label>
                  <textarea 
                    [(ngModel)]="prompt"
                    placeholder="A cinematic shot of a futuristic city at sunset with flying cars and neon lights..."
                    rows="6"
                  ></textarea>
                  <div class="prompt-suggestions">
                    <span class="suggestion-label">Try:</span>
                    <button class="suggestion-chip" (click)="useSuggestion(0)">Product showcase</button>
                    <button class="suggestion-chip" (click)="useSuggestion(1)">Nature documentary</button>
                    <button class="suggestion-chip" (click)="useSuggestion(2)">Abstract art</button>
                  </div>
                </div>

                <!-- Image Upload -->
                <div *ngIf="activeTab === 'image'" class="image-upload-area">
                  <div class="upload-zone" 
                       [class.has-image]="uploadedImage"
                       (click)="fileInput.click()"
                       (dragover)="onDragOver($event)"
                       (drop)="onDrop($event)">
                    <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)">
                    <div *ngIf="!uploadedImage" class="upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <p>Drop image here or click to upload</p>
                      <span>Supports JPG, PNG up to 10MB</span>
                    </div>
                    <img *ngIf="uploadedImage" [src]="uploadedImage" alt="Uploaded preview">
                    <button *ngIf="uploadedImage" class="remove-image" (click)="removeImage($event)">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                  <textarea 
                    [(ngModel)]="imagePrompt"
                    placeholder="Describe what you want the AI to do with this image..."
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Settings Panel -->
            <div class="settings-panel">
              <h3>Settings</h3>
              <div class="settings-grid" @staggerOptions>
                <div class="setting-item option-card">
                  <label>Duration</label>
                  <div class="option-chips">
                    <button 
                      *ngFor="let duration of durations" 
                      class="option-chip"
                      [class.active]="selectedDuration === duration"
                      (click)="selectedDuration = duration"
                    >
                      {{ duration }}s
                    </button>
                  </div>
                </div>

                <div class="setting-item option-card">
                  <label>Aspect Ratio</label>
                  <div class="option-chips">
                    <button 
                      *ngFor="let ratio of aspectRatios" 
                      class="option-chip"
                      [class.active]="selectedAspectRatio === ratio.value"
                      (click)="selectedAspectRatio = ratio.value"
                    >
                      {{ ratio.label }}
                    </button>
                  </div>
                </div>

                <div class="setting-item option-card">
                  <label>Resolution</label>
                  <div class="option-chips">
                    <button 
                      *ngFor="let res of resolutions" 
                      class="option-chip"
                      [class.active]="selectedResolution === res"
                      (click)="selectedResolution = res"
                    >
                      {{ res }}
                    </button>
                  </div>
                </div>

                <div class="setting-item option-card">
                  <label>Style</label>
                  <select [(ngModel)]="selectedStyle" class="style-select">
                    <option *ngFor="let style of styles" [value]="style.value">{{ style.label }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Preview & Generate -->
          <div class="preview-section">
            <div class="preview-card">
              <div class="preview-header">
                <h3>Preview</h3>
                <span class="cost-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  {{ calculateCost() }} credits
                </span>
              </div>
              <div class="preview-content">
                <div class="preview-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                  <p>Your video will appear here</p>
                </div>
              </div>
            </div>

            <button 
              class="btn btn-primary btn-lg btn-generate" 
              [disabled]="!canGenerate() || isGenerating"
              (click)="generateVideo()"
            >
              <span *ngIf="!isGenerating">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Generate Video
              </span>
              <span *ngIf="isGenerating" class="generating">
                <span class="spinner"></span>
                Generating...
              </span>
            </button>

            <p class="generate-note">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Videos typically take 2-5 minutes to generate
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-generator-page {
      padding: 2rem 0;
      min-height: calc(100vh - 80px);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .header-content p {
      color: var(--text-secondary);
    }

    .credits-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-lg);
      color: #f59e0b;
      font-weight: 600;
    }

    .generator-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    .input-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .input-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    .input-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-light);
    }

    .tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1rem;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab:hover {
      color: var(--text-primary);
      background: var(--bg-glass);
    }

    .tab.active {
      color: var(--primary-400);
      border-bottom: 2px solid var(--primary-500);
      background: rgba(99, 102, 241, 0.05);
    }

    .input-content {
      padding: 1.5rem;
    }

    .text-input-area label,
    .image-upload-area label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.75rem;
    }

    textarea {
      width: 100%;
      padding: 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9375rem;
      resize: vertical;
      transition: all 0.2s ease;
    }

    textarea:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    textarea::placeholder {
      color: var(--text-muted);
    }

    .prompt-suggestions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .suggestion-label {
      font-size: 0.875rem;
      color: var(--text-muted);
    }

    .suggestion-chip {
      padding: 0.375rem 0.75rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .suggestion-chip:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-medium);
      color: var(--text-primary);
    }

    .image-upload-area {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .upload-zone {
      position: relative;
      aspect-ratio: 16/9;
      background: var(--bg-glass);
      border: 2px dashed var(--border-medium);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      overflow: hidden;
    }

    .upload-zone:hover {
      border-color: var(--primary-500);
      background: rgba(99, 102, 241, 0.05);
    }

    .upload-zone.has-image {
      border-style: solid;
      border-color: var(--border-light);
    }

    .upload-placeholder {
      text-align: center;
      color: var(--text-muted);
    }

    .upload-placeholder svg {
      margin-bottom: 0.75rem;
    }

    .upload-placeholder p {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .upload-placeholder span {
      font-size: 0.8125rem;
    }

    .upload-zone img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .remove-image {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 32px;
      height: 32px;
      background: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .remove-image:hover {
      background: rgba(244, 63, 94, 0.8);
    }

    .settings-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
    }

    .settings-panel h3 {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .setting-item label {
      display: block;
      font-size: 0.8125rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }

    .option-chips {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .option-chip {
      padding: 0.5rem 0.875rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .option-chip:hover {
      background: var(--bg-tertiary);
      border-color: var(--border-medium);
    }

    .option-chip.active {
      background: var(--primary-500);
      border-color: var(--primary-500);
      color: white;
    }

    .style-select {
      width: 100%;
      padding: 0.625rem 0.875rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-primary);
      font-size: 0.8125rem;
      cursor: pointer;
    }

    .style-select:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .preview-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .preview-header h3 {
      font-size: 1rem;
      font-weight: 600;
    }

    .cost-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.375rem 0.75rem;
      background: rgba(245, 158, 11, 0.1);
      border-radius: var(--radius-full);
      color: #f59e0b;
      font-size: 0.8125rem;
      font-weight: 600;
    }

    .preview-content {
      aspect-ratio: 16/9;
      background: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-placeholder {
      text-align: center;
      color: var(--text-muted);
    }

    .preview-placeholder svg {
      margin-bottom: 0.75rem;
      opacity: 0.5;
    }

    .btn-generate {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-generate:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .generating {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    .generate-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.8125rem;
      text-align: center;
    }

    @media (max-width: 1024px) {
      .generator-layout {
        grid-template-columns: 1fr;
      }

      .preview-section {
        order: -1;
      }

      .settings-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
      }

      .settings-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class VideoGeneratorComponent implements OnInit {
  credits = 150;
  activeTab: 'text' | 'image' = 'text';
  prompt = '';
  imagePrompt = '';
  uploadedImage: string | null = null;
  isGenerating = false;

  selectedDuration = 5;
  durations = [3, 5, 10, 15];

  selectedAspectRatio = '16:9';
  aspectRatios = [
    { label: '16:9', value: '16:9' },
    { label: '9:16', value: '9:16' },
    { label: '1:1', value: '1:1' },
    { label: '4:3', value: '4:3' }
  ];

  selectedResolution = '1080p';
  resolutions = ['720p', '1080p', '4K'];

  selectedStyle = 'cinematic';
  styles = [
    { label: 'Cinematic', value: 'cinematic' },
    { label: 'Animated', value: 'animated' },
    { label: 'Realistic', value: 'realistic' },
    { label: 'Abstract', value: 'abstract' },
    { label: 'Vintage', value: 'vintage' }
  ];

  suggestions = [
    'A cinematic product showcase of a sleek smartphone with dramatic lighting and smooth camera movements',
    'A nature documentary style video of a majestic waterfall with birds flying overhead',
    'Abstract flowing shapes and colors morphing into geometric patterns'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}

  useSuggestion(index: number) {
    this.prompt = this.suggestions[index];
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.uploadedImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(event: Event) {
    event.stopPropagation();
    this.uploadedImage = null;
  }

  calculateCost(): number {
    const baseCost = 10;
    const durationMultiplier = this.selectedDuration / 5;
    const resolutionMultiplier = this.selectedResolution === '4K' ? 2 : this.selectedResolution === '1080p' ? 1 : 0.5;
    return Math.round(baseCost * durationMultiplier * resolutionMultiplier);
  }

  canGenerate(): boolean {
    if (this.activeTab === 'text') {
      return this.prompt.trim().length > 0;
    } else {
      return !!this.uploadedImage && this.imagePrompt.trim().length > 0;
    }
  }

  generateVideo() {
    if (!this.canGenerate()) return;
    this.isGenerating = true;
    // Simulate generation
    setTimeout(() => {
      this.isGenerating = false;
    }, 3000);
  }
}

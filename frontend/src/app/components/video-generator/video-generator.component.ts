import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VideoService, VideoSettings } from '../../services/video.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-video-generator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="generator-container">
      <div class="generator-header">
        <h1>Create AI Video</h1>
        <p class="subtitle">Transform your ideas into stunning videos</p>
      </div>

      <div class="generator-content">
        <div class="prompt-section">
          <div class="form-group">
            <label for="prompt">Describe your video</label>
            <textarea 
              id="prompt"
              [formControl]="promptControl"
              placeholder="Example: A serene mountain landscape at sunset with clouds rolling over peaks..."
              rows="4"
            ></textarea>
            <div class="prompt-hints">
              <button 
                type="button" 
                class="hint-btn"
                *ngFor="let hint of promptHints"
                (click)="useHint(hint)"
              >
                {{ hint }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Reference Image (Optional)</label>
            <div class="upload-area" 
                 (click)="fileInput.click()"
                 (dragover)="onDragOver($event)"
                 (drop)="onDrop($event)"
                 [class.has-file]="selectedFile">
              <input 
                type="file" 
                #fileInput
                accept="image/*"
                (change)="onFileSelected($event)"
                hidden
              >
              <div class="upload-placeholder" *ngIf="!selectedFile && !previewUrl">
                <span class="upload-icon">📤</span>
                <p>Drag & drop an image or click to browse</p>
                <span class="upload-hint">Supports: JPG, PNG, GIF, WebP</span>
              </div>
              <div class="preview" *ngIf="previewUrl">
                <img [src]="previewUrl" alt="Preview">
                <button type="button" class="remove-btn" (click)="removeFile($event)">×</button>
              </div>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Video Settings</h3>
          
          <div class="setting-group">
            <label>Duration</label>
            <div class="duration-options">
              <button 
                type="button"
                *ngFor="let duration of durations"
                [class.active]="settings.duration === duration"
                (click)="settings.duration = duration"
              >
                {{ duration }}s
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>Resolution</label>
            <div class="resolution-options">
              <button 
                type="button"
                *ngFor="let res of resolutions"
                [class.active]="settings.resolution === res.value"
                (click)="settings.resolution = res.value"
              >
                {{ res.label }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>Aspect Ratio</label>
            <div class="aspect-options">
              <button 
                type="button"
                *ngFor="let ratio of aspectRatios"
                [class.active]="settings.aspectRatio === ratio.value"
                (click)="settings.aspectRatio = ratio.value"
              >
                {{ ratio.label }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>Style</label>
            <div class="style-options">
              <button 
                type="button"
                *ngFor="let style of styles"
                [class.active]="settings.style === style.value"
                (click)="settings.style = style.value"
              >
                {{ style.label }}
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>Camera Movement</label>
            <div class="camera-options">
              <button 
                type="button"
                *ngFor="let movement of cameraMovements"
                [class.active]="settings.cameraMovement === movement.value"
                (click)="settings.cameraMovement = movement.value"
              >
                {{ movement.label }}
              </button>
            </div>
          </div>

          <div class="credit-cost">
            <div class="cost-info">
              <span class="cost-label">Credit Cost:</span>
              <span class="cost-value">{{ calculateCreditCost() }} credits</span>
            </div>
            <div class="credits-available">
              Available: {{ currentCredits }} credits
            </div>
          </div>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="button"
            class="generate-btn"
            [disabled]="!promptControl.value || isGenerating"
            (click)="generateVideo()"
          >
            <span *ngIf="!isGenerating">Generate Video</span>
            <span *ngIf="isGenerating" class="spinner"></span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .generator-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .generator-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    h1 {
      color: #fff;
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .subtitle {
      color: #a0a0a0;
      font-size: 1.1rem;
    }

    .generator-content {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2rem;
    }

    @media (max-width: 900px) {
      .generator-content {
        grid-template-columns: 1fr;
      }
    }

    .prompt-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      color: #e0e0e0;
      margin-bottom: 0.75rem;
      font-weight: 500;
    }

    textarea {
      width: 100%;
      padding: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      font-size: 1rem;
      resize: vertical;
      transition: all 0.3s;
      font-family: inherit;
    }

    textarea:focus {
      outline: none;
      border-color: #667eea;
      background: rgba(255, 255, 255, 0.08);
    }

    textarea::placeholder {
      color: #666;
    }

    .prompt-hints {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .hint-btn {
      padding: 0.5rem 1rem;
      background: rgba(102, 126, 234, 0.2);
      border: 1px solid rgba(102, 126, 234, 0.3);
      border-radius: 20px;
      color: #a0b0ff;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .hint-btn:hover {
      background: rgba(102, 126, 234, 0.3);
      color: #fff;
    }

    .upload-area {
      border: 2px dashed rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }

    .upload-area:hover {
      border-color: rgba(102, 126, 234, 0.5);
      background: rgba(255, 255, 255, 0.02);
    }

    .upload-area.has-file {
      border-style: solid;
      border-color: rgba(102, 126, 234, 0.5);
    }

    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .upload-icon {
      font-size: 2.5rem;
    }

    .upload-placeholder p {
      color: #e0e0e0;
      margin: 0;
    }

    .upload-hint {
      color: #666;
      font-size: 0.85rem;
    }

    .preview {
      position: relative;
      max-height: 200px;
    }

    .preview img {
      width: 100%;
      max-height: 200px;
      object-fit: contain;
      border-radius: 8px;
    }

    .remove-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ff6b6b;
      border: none;
      color: #fff;
      font-size: 1.2rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .settings-section {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      height: fit-content;
    }

    .settings-section h3 {
      color: #fff;
      margin-bottom: 1.5rem;
      font-size: 1.25rem;
    }

    .setting-group {
      margin-bottom: 1.5rem;
    }

    .setting-group label {
      font-size: 0.9rem;
      color: #a0a0a0;
      margin-bottom: 0.5rem;
    }

    .duration-options,
    .resolution-options,
    .aspect-options,
    .style-options,
    .camera-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .duration-options button,
    .resolution-options button,
    .aspect-options button,
    .style-options button,
    .camera-options button {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #a0a0a0;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    .duration-options button:hover,
    .resolution-options button:hover,
    .aspect-options button:hover,
    .style-options button:hover,
    .camera-options button:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #e0e0e0;
    }

    .duration-options button.active,
    .resolution-options button.active,
    .aspect-options button.active,
    .style-options button.active,
    .camera-options button.active {
      background: rgba(102, 126, 234, 0.3);
      border-color: #667eea;
      color: #fff;
    }

    .credit-cost {
      background: rgba(255, 215, 0, 0.05);
      border: 1px solid rgba(255, 215, 0, 0.2);
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .cost-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .cost-label {
      color: #a0a0a0;
    }

    .cost-value {
      color: #ffd700;
      font-weight: 600;
      font-size: 1.1rem;
    }

    .credits-available {
      color: #666;
      font-size: 0.85rem;
    }

    .error-message {
      background: rgba(255, 107, 107, 0.1);
      border: 1px solid rgba(255, 107, 107, 0.3);
      color: #ff6b6b;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .generate-btn {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      border-radius: 12px;
      color: #fff;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .generate-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
    }

    .generate-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class VideoGeneratorComponent {
  promptControl = this.fb.control('');
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isGenerating = false;
  errorMessage = '';
  currentCredits = 0;

  settings: Partial<VideoSettings> = {
    duration: 5,
    resolution: '720p',
    aspectRatio: '16:9',
    style: 'realistic',
    cameraMovement: 'static'
  };

  promptHints = [
    'Sunset over ocean waves',
    'Cyberpunk city at night',
    'Peaceful forest stream',
    'Abstract colorful particles'
  ];

  durations = [5, 10, 15, 30, 60];
  
  resolutions = [
    { value: '480p', label: '480p' },
    { value: '720p', label: '720p HD' },
    { value: '1080p', label: '1080p FHD' }
  ];

  aspectRatios = [
    { value: '16:9', label: '16:9 Landscape' },
    { value: '9:16', label: '9:16 Portrait' },
    { value: '1:1', label: '1:1 Square' },
    { value: '4:3', label: '4:3 Classic' }
  ];

  styles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'animated', label: 'Animated' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'artistic', label: 'Artistic' }
  ];

  cameraMovements = [
    { value: 'static', label: 'Static' },
    { value: 'zoom-in', label: 'Zoom In' },
    { value: 'zoom-out', label: 'Zoom Out' },
    { value: 'pan-left', label: 'Pan Left' },
    { value: 'pan-right', label: 'Pan Right' },
    { value: 'tilt-up', label: 'Tilt Up' },
    { value: 'tilt-down', label: 'Tilt Down' }
  ];

  constructor(
    private fb: FormBuilder,
    private videoService: VideoService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentCredits = user.credits;
      }
    });
  }

  useHint(hint: string): void {
    this.promptControl.setValue(hint);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.handleFile(files[0]);
    }
  }

  handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please upload an image file';
      return;
    }
    
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    this.errorMessage = '';
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile = null;
    this.previewUrl = null;
  }

  calculateCreditCost(): number {
    const baseCosts: { [key: number]: number } = { 5: 10, 10: 20, 15: 30, 30: 50, 60: 80 };
    const resolutionMultipliers: { [key: string]: number } = { '480p': 1, '720p': 1.5, '1080p': 2 };
    
    const baseCost = baseCosts[this.settings.duration || 5] || 10;
    const multiplier = resolutionMultipliers[this.settings.resolution || '720p'] || 1;
    
    return Math.round(baseCost * multiplier);
  }

  generateVideo(): void {
    if (!this.promptControl.value) return;

    this.isGenerating = true;
    this.errorMessage = '';

    this.videoService.generateVideo({
      prompt: this.promptControl.value,
      settings: this.settings,
      referenceImage: this.selectedFile || undefined
    }).subscribe({
      next: (response) => {
        this.isGenerating = false;
        this.router.navigate(['/video', response.job.id]);
      },
      error: (error) => {
        this.isGenerating = false;
        this.errorMessage = error.error?.message || 'Failed to generate video. Please try again.';
      }
    });
  }
}
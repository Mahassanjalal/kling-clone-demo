import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-brand-kit-editor',
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
    <div class="brand-kit-editor" @fadeIn>
      <div class="container">
        <div class="editor-header">
          <a routerLink="/brand-kits" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Brand Kits
          </a>
          <h1>Edit Brand Kit</h1>
        </div>

        <div class="editor-content">
          <div class="form-section">
            <h3>Brand Information</h3>
            <div class="form-group">
              <label>Brand Name</label>
              <input type="text" value="Acme Corp" placeholder="Enter brand name">
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea rows="3" placeholder="Describe your brand..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3>Colors</h3>
            <div class="color-grid">
              <div class="color-item">
                <label>Primary</label>
                <div class="color-input">
                  <input type="color" value="#6366f1">
                  <span>#6366f1</span>
                </div>
              </div>
              <div class="color-item">
                <label>Secondary</label>
                <div class="color-input">
                  <input type="color" value="#8b5cf6">
                  <span>#8b5cf6</span>
                </div>
              </div>
              <div class="color-item">
                <label>Accent</label>
                <div class="color-input">
                  <input type="color" value="#ec4899">
                  <span>#ec4899</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Typography</h3>
            <div class="form-row">
              <div class="form-group">
                <label>Heading Font</label>
                <select>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Poppins</option>
                </select>
              </div>
              <div class="form-group">
                <label>Body Font</label>
                <select>
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Open Sans</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Brand Assets</h3>
            <div class="asset-upload">
              <div class="upload-area">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p>Drag & drop or click to upload logo</p>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary">Cancel</button>
            <button class="btn btn-primary">Save Brand Kit</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-kit-editor {
      padding: 2rem 0;
    }

    .editor-header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      margin-bottom: 1rem;
    }

    .editor-header h1 {
      font-size: 2rem;
      font-weight: 700;
    }

    .editor-content {
      max-width: 800px;
    }

    .form-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .form-section h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    input,
    select,
    textarea {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .color-input {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
    }

    .color-input input[type="color"] {
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
    }

    .upload-area {
      border: 2px dashed var(--border-light);
      border-radius: var(--radius-xl);
      padding: 3rem;
      text-align: center;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .upload-area:hover {
      border-color: var(--primary-500);
    }

    .upload-area svg {
      margin-bottom: 1rem;
      color: var(--text-muted);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    @media (max-width: 640px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BrandKitEditorComponent {}

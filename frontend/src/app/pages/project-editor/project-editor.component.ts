import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-project-editor',
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
    <div class="project-editor-page" @fadeIn>
      <div class="editor-header">
        <div class="container">
          <div class="header-content">
            <div class="project-info">
              <input type="text" class="project-title" value="Summer Sale Campaign" placeholder="Project Name">
              <span class="project-status in-progress">In Progress</span>
            </div>
            <div class="header-actions">
              <button class="btn btn-secondary">Save Draft</button>
              <button class="btn btn-primary">Compile Video</button>
            </div>
          </div>
        </div>
      </div>

      <div class="editor-body">
        <div class="container">
          <div class="editor-layout">
            <div class="scenes-panel">
              <div class="panel-header">
                <h3>Scenes</h3>
                <button class="btn btn-sm btn-secondary">+ Add Scene</button>
              </div>
              <div class="scenes-list">
                <div class="scene-item active">
                  <span class="scene-number">1</span>
                  <div class="scene-preview"></div>
                  <div class="scene-info">
                    <span class="scene-name">Opening Hook</span>
                    <span class="scene-duration">3s</span>
                  </div>
                </div>
                <div class="scene-item">
                  <span class="scene-number">2</span>
                  <div class="scene-preview"></div>
                  <div class="scene-info">
                    <span class="scene-name">Product Showcase</span>
                    <span class="scene-duration">8s</span>
                  </div>
                </div>
                <div class="scene-item">
                  <span class="scene-number">3</span>
                  <div class="scene-preview"></div>
                  <div class="scene-info">
                    <span class="scene-name">Call to Action</span>
                    <span class="scene-duration">4s</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="preview-panel">
              <div class="video-preview">
                <div class="preview-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
              <div class="timeline">
                <div class="timeline-track">
                  <div class="scene-block" style="width: 15%"></div>
                  <div class="scene-block" style="width: 40%"></div>
                  <div class="scene-block" style="width: 20%"></div>
                </div>
              </div>
            </div>

            <div class="properties-panel">
              <div class="panel-header">
                <h3>Scene Properties</h3>
              </div>
              <div class="properties-form">
                <div class="form-group">
                  <label>Prompt</label>
                  <textarea rows="4" placeholder="Describe this scene...">A cinematic opening with dramatic music</textarea>
                </div>
                <div class="form-group">
                  <label>Duration</label>
                  <input type="number" value="3">
                </div>
                <div class="form-group">
                  <label>Transition</label>
                  <select>
                    <option>Fade</option>
                    <option>Slide</option>
                    <option>Zoom</option>
                  </select>
                </div>
                <button class="btn btn-primary btn-block">Generate Scene</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .project-editor-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .editor-header {
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-light);
      padding: 1rem 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .project-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .project-title {
      font-size: 1.5rem;
      font-weight: 700;
      background: transparent;
      border: none;
      color: var(--text-primary);
      padding: 0.5rem;
      border-radius: var(--radius-md);
      min-width: 300px;
    }

    .project-title:focus {
      outline: none;
      background: var(--bg-glass);
    }

    .project-status {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .project-status.in-progress {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-400);
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .editor-body {
      flex: 1;
      padding: 1.5rem 0;
    }

    .editor-layout {
      display: grid;
      grid-template-columns: 280px 1fr 300px;
      gap: 1.5rem;
      height: calc(100vh - 200px);
    }

    .scenes-panel,
    .properties-panel {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border-light);
    }

    .panel-header h3 {
      font-size: 1rem;
      font-weight: 600;
    }

    .scenes-list {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
    }

    .scene-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 0.5rem;
    }

    .scene-item:hover,
    .scene-item.active {
      background: var(--bg-glass);
    }

    .scene-number {
      width: 28px;
      height: 28px;
      background: var(--bg-tertiary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .scene-preview {
      width: 50px;
      height: 35px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
    }

    .scene-info {
      flex: 1;
    }

    .scene-name {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .scene-duration {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .preview-panel {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .video-preview {
      flex: 1;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-placeholder {
      color: var(--text-muted);
    }

    .timeline {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1rem;
    }

    .timeline-track {
      display: flex;
      height: 40px;
      background: var(--bg-tertiary);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .scene-block {
      background: var(--primary-500);
      border-right: 2px solid var(--bg-card);
    }

    .properties-form {
      padding: 1.25rem;
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
      padding: 0.75rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    input:focus,
    select:focus,
    textarea:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    @media (max-width: 1200px) {
      .editor-layout {
        grid-template-columns: 1fr;
        height: auto;
      }
    }
  `]
})
export class ProjectEditorComponent {}

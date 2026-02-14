import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-project-wizard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ],
  template: `
    <div class="wizard-page" @fadeIn>
      <div class="container">
        <div class="wizard-header">
          <h1>Create New Project</h1>
          <p>Choose a template or start from scratch</p>
        </div>

        <div class="wizard-options">
          <div class="option-card" routerLink="/templates">
            <div class="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <h3>Use Template</h3>
            <p>Start with a professionally designed template</p>
          </div>

          <div class="option-card" routerLink="/create">
            <div class="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
                <circle cx="11" cy="11" r="2"/>
              </svg>
            </div>
            <h3>Start from Scratch</h3>
            <p>Create a custom video project</p>
          </div>

          <div class="option-card">
            <div class="option-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <h3>Import Script</h3>
            <p>Upload a script to auto-generate scenes</p>
          </div>
        </div>

        <div class="wizard-footer">
          <a routerLink="/projects" class="btn btn-ghost">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wizard-page {
      padding: 4rem 0;
      min-height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
    }

    .container {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .wizard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .wizard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .wizard-header p {
      color: var(--text-secondary);
    }

    .wizard-options {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      max-width: 900px;
      margin: 0 auto;
      flex: 1;
    }

    .option-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .option-card:hover {
      transform: translateY(-4px);
      border-color: var(--primary-500);
      box-shadow: var(--shadow-glow-sm);
    }

    .option-icon {
      width: 80px;
      height: 80px;
      background: var(--bg-glass);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--primary-400);
    }

    .option-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .option-card p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .wizard-footer {
      text-align: center;
      margin-top: 3rem;
    }
  `]
})
export class ProjectWizardComponent {}

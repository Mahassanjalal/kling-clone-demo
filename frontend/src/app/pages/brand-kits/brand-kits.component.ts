import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-brand-kits',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('stagger', [
      transition(':enter', [
        query('.brand-kit-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="brand-kits-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Brand Kits</h1>
            <p class="subtitle">Manage your brand assets for consistent video creation</p>
          </div>
          <button class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Brand Kit
          </button>
        </div>

        <div class="kits-grid" @stagger>
          <div class="brand-kit-card" *ngFor="let kit of brandKits" [routerLink]="['/brand-kits', kit.id]">
            <div class="kit-preview">
              <div class="color-preview" [style.background]="kit.primaryColor"></div>
            </div>
            <div class="kit-info">
              <h3>{{ kit.name }}</h3>
              <p class="kit-meta">{{ kit.assets }} assets</p>
              <div class="kit-colors">
                <span class="color-dot" *ngFor="let color of kit.colors" [style.background]="color"></span>
              </div>
            </div>
          </div>

          <div class="add-kit-card">
            <div class="add-icon">+</div>
            <span>Create New Brand Kit</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .brand-kits-page {
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

    .kits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .brand-kit-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .brand-kit-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-medium);
    }

    .kit-preview {
      height: 120px;
      padding: 1rem;
      background: var(--bg-tertiary);
    }

    .color-preview {
      width: 100%;
      height: 100%;
      border-radius: var(--radius-lg);
    }

    .kit-info {
      padding: 1.25rem;
    }

    .kit-info h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .kit-meta {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .kit-colors {
      display: flex;
      gap: 0.5rem;
    }

    .color-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--bg-card);
    }

    .add-kit-card {
      background: var(--bg-card);
      border: 2px dashed var(--border-light);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      min-height: 220px;
    }

    .add-kit-card:hover {
      border-color: var(--primary-500);
    }

    .add-icon {
      width: 48px;
      height: 48px;
      background: var(--bg-glass);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: var(--primary-400);
      margin-bottom: 0.75rem;
    }

    .add-kit-card span {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }
  `]
})
export class BrandKitsComponent {
  brandKits = [
    { id: '1', name: 'Acme Corp', assets: 12, primaryColor: '#6366f1', colors: ['#6366f1', '#8b5cf6', '#ec4899'] },
    { id: '2', name: 'TechStart Inc', assets: 8, primaryColor: '#10b981', colors: ['#10b981', '#06b6d4', '#3b82f6'] }
  ];
}

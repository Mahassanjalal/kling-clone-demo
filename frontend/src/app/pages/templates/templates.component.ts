import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('stagger', [
      transition(':enter', [
        query('.template-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="templates-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Video Templates</h1>
            <p class="subtitle">Choose from professionally designed templates to jumpstart your video creation</p>
          </div>
        </div>

        <div class="filters">
          <div class="filter-group">
            <label>Platform</label>
            <div class="filter-options">
              <button [class.active]="platformFilter === 'all'" (click)="platformFilter = 'all'">All</button>
              <button [class.active]="platformFilter === 'tiktok'" (click)="platformFilter = 'tiktok'">TikTok</button>
              <button [class.active]="platformFilter === 'instagram'" (click)="platformFilter = 'instagram'">Instagram</button>
              <button [class.active]="platformFilter === 'youtube'" (click)="platformFilter = 'youtube'">YouTube</button>
            </div>
          </div>
          <div class="filter-group">
            <label>Category</label>
            <div class="filter-options">
              <button [class.active]="categoryFilter === 'all'" (click)="categoryFilter = 'all'">All</button>
              <button [class.active]="categoryFilter === 'ecommerce'" (click)="categoryFilter = 'ecommerce'">E-commerce</button>
              <button [class.active]="categoryFilter === 'social'" (click)="categoryFilter = 'social'">Social</button>
              <button [class.active]="categoryFilter === 'promo'" (click)="categoryFilter = 'promo'">Promo</button>
            </div>
          </div>
        </div>

        <div class="templates-grid" @stagger>
          <div class="template-card" *ngFor="let template of templates" [routerLink]="['/templates', template.id]">
            <div class="template-preview" [class]="template.platform">
              <span class="platform-badge">{{ template.platform }}</span>
            </div>
            <div class="template-info">
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
              <div class="template-meta">
                <span class="duration">{{ template.duration }}s</span>
                <span class="category">{{ template.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .templates-page {
      padding: 2rem 0;
    }

    .page-header {
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

    .filters {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .filter-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .filter-options {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .filter-options button {
      padding: 0.5rem 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      color: var(--text-secondary);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-options button.active {
      background: var(--primary-500);
      border-color: var(--primary-500);
      color: white;
    }

    .templates-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .template-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .template-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-medium);
    }

    .template-preview {
      aspect-ratio: 9/16;
      position: relative;
      background: var(--bg-tertiary);
    }

    .template-preview.tiktok {
      background: linear-gradient(135deg, #ff0050 0%, #00f2ea 100%);
    }

    .template-preview.instagram {
      background: linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    }

    .template-preview.youtube {
      background: linear-gradient(135deg, #ff0000 0%, #cc0000 100%);
    }

    .platform-badge {
      position: absolute;
      top: 1rem;
      left: 1rem;
      padding: 0.375rem 0.875rem;
      background: rgba(0, 0, 0, 0.6);
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }

    .template-info {
      padding: 1.25rem;
    }

    .template-info h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .template-info p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
    }

    .template-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
  `]
})
export class TemplatesComponent implements OnInit {
  platformFilter = 'all';
  categoryFilter = 'all';
  
  templates = [
    { id: '1', name: 'Product Showcase', description: 'Perfect for e-commerce product launches', platform: 'tiktok', category: 'ecommerce', duration: 15 },
    { id: '2', name: 'Story Ad', description: 'Vertical format optimized for Stories', platform: 'instagram', category: 'social', duration: 10 },
    { id: '3', name: 'Pre-Roll Ad', description: 'Skippable ad format for YouTube', platform: 'youtube', category: 'promo', duration: 15 },
    { id: '4', name: 'Customer Story', description: 'Build trust with testimonials', platform: 'youtube', category: 'social', duration: 30 },
    { id: '5', name: 'Flash Sale', description: 'Urgent promotional content', platform: 'instagram', category: 'promo', duration: 8 },
    { id: '6', name: 'Product Demo', description: 'Showcase product features', platform: 'tiktok', category: 'ecommerce', duration: 20 }
  ];

  ngOnInit() {}
}

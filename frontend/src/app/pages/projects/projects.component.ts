import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('stagger', [
      transition(':enter', [
        query('.project-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="projects-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>My Projects</h1>
            <p class="subtitle">Organize your videos into projects for better workflow</p>
          </div>
          <a routerLink="/new-project" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New Project
          </a>
        </div>

        <div class="projects-grid" @stagger>
          <div class="project-card" *ngFor="let project of projects" [routerLink]="['/projects', project.id]">
            <div class="project-thumbnail">
              <div class="thumbnail-stack">
                <div class="thumb-item" *ngFor="let i of [1,2,3]"></div>
              </div>
            </div>
            <div class="project-info">
              <h3>{{ project.name }}</h3>
              <p class="description">{{ project.description }}</p>
              <div class="project-meta">
                <span class="scenes">{{ project.scenes }} scenes</span>
                <span class="status" [class]="project.status">{{ project.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="projects.length === 0">
          <div class="empty-icon">📁</div>
          <h3>No projects yet</h3>
          <p>Create your first project to organize your videos</p>
          <a routerLink="/new-project" class="btn btn-primary">Create Project</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-page {
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

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .project-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .project-card:hover {
      transform: translateY(-4px);
      border-color: var(--border-medium);
    }

    .project-thumbnail {
      padding: 1.5rem;
      background: var(--bg-tertiary);
    }

    .thumbnail-stack {
      display: flex;
      gap: -10px;
      justify-content: center;
    }

    .thumb-item {
      width: 60px;
      height: 80px;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      margin-left: -20px;
      box-shadow: var(--shadow-md);
    }

    .thumb-item:first-child {
      margin-left: 0;
    }

    .project-info {
      padding: 1.25rem;
    }

    .project-info h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .project-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }

    .scenes {
      color: var(--text-muted);
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-weight: 500;
    }

    .status.draft {
      background: rgba(156, 163, 175, 0.2);
      color: #9ca3af;
    }

    .status.in-progress {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-400);
    }

    .status.completed {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    .empty-state {
      text-align: center;
      padding: 4rem;
      background: var(--bg-card);
      border: 1px dashed var(--border-light);
      border-radius: var(--radius-xl);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
  `]
})
export class ProjectsComponent {
  projects = [
    { id: '1', name: 'Summer Sale Campaign', description: 'Product videos for summer promotion', scenes: 5, status: 'in-progress' },
    { id: '2', name: 'New Product Launch', description: 'Launch video for new collection', scenes: 3, status: 'draft' },
    { id: '3', name: 'Holiday Special', description: 'Holiday themed promotional videos', scenes: 8, status: 'completed' }
  ];
}

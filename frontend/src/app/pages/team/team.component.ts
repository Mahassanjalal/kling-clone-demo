import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('stagger', [
      transition(':enter', [
        query('.member-card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ])
      ])
    ])
  ],
  template: `
    <div class="team-page">
      <div class="container">
        <div class="page-header">
          <div>
            <h1>Team Management</h1>
            <p class="subtitle">Manage your team members and their permissions</p>
          </div>
          <button class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Invite Member
          </button>
        </div>

        <div class="team-stats">
          <div class="stat-card">
            <span class="stat-value">5</span>
            <span class="stat-label">Team Members</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">10</span>
            <span class="stat-label">Seats Available</span>
          </div>
          <div class="stat-card">
            <span class="stat-value">3</span>
            <span class="stat-label">Pending Invites</span>
          </div>
        </div>

        <div class="members-section" @stagger>
          <h2>Team Members</h2>
          <div class="members-list">
            <div class="member-card" *ngFor="let member of members">
              <div class="member-avatar">{{ member.initials }}</div>
              <div class="member-info">
                <h4>{{ member.name }}</h4>
                <p>{{ member.email }}</p>
                <span class="role-badge" [class]="member.role">{{ member.role }}</span>
              </div>
              <div class="member-actions">
                <button class="btn btn-ghost btn-sm">Edit</button>
                <button class="btn btn-danger btn-sm" *ngIf="member.role !== 'owner'">Remove</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .team-page {
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

    .team-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      text-align: center;
    }

    .stat-value {
      display: block;
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-400);
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .members-section h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .members-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .member-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1rem 1.25rem;
    }

    .member-avatar {
      width: 48px;
      height: 48px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: white;
    }

    .member-info {
      flex: 1;
    }

    .member-info h4 {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .member-info p {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 0.25rem;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.625rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .role-badge.owner {
      background: rgba(245, 158, 11, 0.2);
      color: #f59e0b;
    }

    .role-badge.admin {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary-400);
    }

    .role-badge.editor {
      background: rgba(16, 185, 129, 0.2);
      color: var(--accent-emerald);
    }

    .member-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-sm {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  `]
})
export class TeamComponent {
  members = [
    { name: 'John Doe', email: 'john@example.com', initials: 'JD', role: 'owner' },
    { name: 'Jane Smith', email: 'jane@example.com', initials: 'JS', role: 'admin' },
    { name: 'Bob Johnson', email: 'bob@example.com', initials: 'BJ', role: 'editor' },
    { name: 'Alice Brown', email: 'alice@example.com', initials: 'AB', role: 'editor' }
  ];
}

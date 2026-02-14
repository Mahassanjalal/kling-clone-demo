import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-settings',
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
    <div class="settings-page" @fadeIn>
      <div class="container">
        <div class="settings-layout">
          <aside class="settings-sidebar">
            <h2>Settings</h2>
            <nav class="settings-nav">
              <a routerLink="/settings" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Profile</a>
              <a routerLink="/settings/billing" routerLinkActive="active">Billing</a>
              <a href="#">Notifications</a>
              <a href="#">Security</a>
              <a href="#">API Keys</a>
            </nav>
          </aside>

          <main class="settings-content">
            <div class="settings-section">
              <h3>Profile Information</h3>
              <div class="form-group">
                <label>Full Name</label>
                <input type="text" value="John Doe">
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" value="john@example.com" disabled>
              </div>
              <div class="form-group">
                <label>Company</label>
                <input type="text" placeholder="Your company name">
              </div>
              <button class="btn btn-primary">Save Changes</button>
            </div>

            <div class="settings-section">
              <h3>Preferences</h3>
              <div class="form-group">
                <label>Language</label>
                <select>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div class="form-group">
                <label>Timezone</label>
                <select>
                  <option>UTC-8 (Pacific)</option>
                  <option>UTC-5 (Eastern)</option>
                  <option>UTC+0 (GMT)</option>
                </select>
              </div>
            </div>

            <div class="settings-section danger">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, there is no going back.</p>
              <button class="btn btn-danger">Delete Account</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 2rem 0;
    }

    .settings-layout {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 2rem;
    }

    .settings-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .settings-sidebar h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .settings-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .settings-nav a {
      padding: 0.625rem 1rem;
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      transition: all 0.2s ease;
    }

    .settings-nav a:hover,
    .settings-nav a.active {
      background: var(--bg-glass);
      color: var(--text-primary);
    }

    .settings-content {
      max-width: 600px;
    }

    .settings-section {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .settings-section h3 {
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
    select {
      width: 100%;
      padding: 0.75rem 1rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9375rem;
    }

    input:focus,
    select:focus {
      outline: none;
      border-color: var(--primary-500);
    }

    input:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .settings-section.danger {
      border-color: rgba(244, 63, 94, 0.3);
    }

    .settings-section.danger h3 {
      color: var(--accent-rose);
    }

    .settings-section.danger p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
      .settings-layout {
        grid-template-columns: 1fr;
      }

      .settings-sidebar {
        position: static;
      }

      .settings-nav {
        flex-direction: row;
        flex-wrap: wrap;
      }
    }
  `]
})
export class SettingsComponent {}

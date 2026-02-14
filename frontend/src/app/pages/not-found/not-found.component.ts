import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="not-found-page" @fadeIn>
      <div class="container">
        <div class="error-content">
          <span class="error-code">404</span>
          <h1>Page Not Found</h1>
          <p>The page you're looking for doesn't exist or has been moved.</p>
          <div class="error-actions">
            <a routerLink="/" class="btn btn-primary btn-lg">Go Home</a>
            <a routerLink="/dashboard" class="btn btn-secondary btn-lg">Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .error-content {
      text-align: center;
    }

    .error-code {
      font-size: 8rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      display: block;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }

    p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1.125rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 480px) {
      .error-code {
        font-size: 6rem;
      }

      .error-actions {
        flex-direction: column;
      }
    }
  `]
})
export class NotFoundComponent {}

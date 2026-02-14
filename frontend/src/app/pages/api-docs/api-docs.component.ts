import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-api-docs',
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
    <div class="api-docs-page" @fadeIn>
      <div class="container">
        <div class="docs-header">
          <h1>API Documentation</h1>
          <p>Integrate Kling AI into your applications</p>
        </div>

        <div class="docs-content">
          <aside class="docs-sidebar">
            <nav>
              <a href="#authentication">Authentication</a>
              <a href="#videos">Videos</a>
              <a href="#templates">Templates</a>
              <a href="#errors">Errors</a>
            </nav>
          </aside>

          <main class="docs-main">
            <section id="authentication">
              <h2>Authentication</h2>
              <p>All API requests require an API key. Include your key in the header:</p>
              <div class="code-block">
                <code>X-API-Key: your_api_key_here</code>
              </div>
            </section>

            <section id="videos">
              <h2>Video Generation</h2>
              <h3>Create Video</h3>
              <div class="code-block">
                <code>POST /api/videos/generate</code>
              </div>
              <p>Generate a new video from text or image.</p>

              <h4>Request Body</h4>
              <div class="code-block">
                <pre>{
  "prompt": "A sunset over mountains",
  "settings": {
    "duration": 10,
    "resolution": "1080p"
  }
}</pre>
              </div>
            </section>

            <section id="templates">
              <h2>Templates</h2>
              <h3>List Templates</h3>
              <div class="code-block">
                <code>GET /api/templates</code>
              </div>
              <p>Get all available video templates.</p>
            </section>

            <section id="errors">
              <h2>Error Handling</h2>
              <p>The API returns standard HTTP response codes:</p>
              <ul>
                <li><code>200</code> - Success</li>
                <li><code>400</code> - Bad Request</li>
                <li><code>401</code> - Unauthorized</li>
                <li><code>429</code> - Rate Limited</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-docs-page {
      padding: 2rem 0;
    }

    .docs-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .docs-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .docs-header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
    }

    .docs-content {
      display: grid;
      grid-template-columns: 240px 1fr;
      gap: 3rem;
      max-width: 1000px;
      margin: 0 auto;
    }

    .docs-sidebar {
      position: sticky;
      top: 100px;
      height: fit-content;
    }

    .docs-sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .docs-sidebar a {
      padding: 0.5rem 0;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      transition: color 0.2s ease;
    }

    .docs-sidebar a:hover {
      color: var(--text-primary);
    }

    .docs-main section {
      margin-bottom: 3rem;
    }

    .docs-main h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .docs-main h3 {
      font-size: 1.125rem;
      font-weight: 600;
      margin: 1.5rem 0 0.75rem;
    }

    .docs-main p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.7;
    }

    .code-block {
      background: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
    }

    .code-block code,
    .code-block pre {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .docs-main ul {
      list-style: none;
    }

    .docs-main li {
      padding: 0.5rem 0;
      color: var(--text-secondary);
    }

    .docs-main code {
      background: var(--bg-glass);
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .docs-content {
        grid-template-columns: 1fr;
      }

      .docs-sidebar {
        display: none;
      }
    }
  `]
})
export class ApiDocsComponent {}

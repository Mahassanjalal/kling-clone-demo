import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="showNavbar"></app-navbar>
      <main class="main-content" [class.full-width]="!showNavbar">
        <router-outlet></router-outlet>
      </main>
      <app-footer *ngIf="showFooter"></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      padding-top: 80px;
    }

    .main-content.full-width {
      padding-top: 0;
    }

    @media (max-width: 768px) {
      .main-content {
        padding-top: 70px;
      }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  showNavbar = true;
  showFooter = true;
  private routerSubscription?: Subscription;

  // Routes that should not show navbar/footer
  private fullPageRoutes = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Check current route on init
    this.updateLayout(this.router.url);

    // Subscribe to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateLayout(event.url);
      });

    // Initialize auth state
    this.authService.initializeAuth();
  }

  ngOnDestroy() {
    this.routerSubscription?.unsubscribe();
  }

  private updateLayout(url: string) {
    const isFullPage = this.fullPageRoutes.some(route => url.startsWith(route));
    this.showNavbar = !isFullPage;
    this.showFooter = !isFullPage;
  }
}
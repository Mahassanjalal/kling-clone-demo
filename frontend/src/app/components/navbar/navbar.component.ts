import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <nav class="navbar" [class.scrolled]="isScrolled">
      <div class="container navbar-container">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <div class="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#6366f1"/>
                  <stop offset="100%" style="stop-color:#8b5cf6"/>
                </linearGradient>
              </defs>
              <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" stroke="url(#logoGradient)" stroke-width="2" fill="none"/>
              <path d="M16 8l-6 3.5v7l6 3.5 6-3.5v-7L16 8z" fill="url(#logoGradient)"/>
              <circle cx="16" cy="16" r="3" fill="#0a0a0f"/>
            </svg>
          </div>
          <span class="logo-text">Kling<span class="gradient">AI</span></span>
        </a>

        <!-- Desktop Navigation -->
        <div class="nav-links" *ngIf="!currentUser">
          <a routerLink="/features" routerLinkActive="active">Features</a>
          <a routerLink="/pricing" routerLinkActive="active">Pricing</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
          <a routerLink="/api-docs" routerLinkActive="active">API</a>
        </div>

        <div class="nav-links" *ngIf="currentUser">
          <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
          <a routerLink="/create" routerLinkActive="active">Create</a>
          <a routerLink="/videos" routerLinkActive="active">My Videos</a>
          <a routerLink="/templates" routerLinkActive="active">Templates</a>
          <div class="dropdown">
            <button class="dropdown-trigger">
              More
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="dropdown-menu">
              <a routerLink="/projects">Projects</a>
              <a routerLink="/brand-kits">Brand Kits</a>
              <a routerLink="/team">Team</a>
              <a routerLink="/analytics">Analytics</a>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="nav-actions">
          <ng-container *ngIf="!currentUser; else userMenu">
            <a routerLink="/login" class="btn btn-ghost">Sign In</a>
            <a routerLink="/register" class="btn btn-primary">
              Get Started
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M10 5l3 3-3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
          </ng-container>

          <ng-template #userMenu>
            <div class="credits-badge">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v12M2 8h12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span>{{ currentUser?.credits || 0 }}</span>
              <a routerLink="/credits" class="add-btn">+</a>
            </div>

            <div class="user-dropdown">
              <button class="user-trigger" (click)="toggleUserMenu()">
                <div class="avatar">
                  <img *ngIf="currentUser?.avatar" [src]="currentUser?.avatar" alt="Avatar">
                  <span *ngIf="!currentUser?.avatar">{{ getInitials() }}</span>
                </div>
                <span class="user-name">{{ currentUser?.name }}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" [class.rotated]="showUserMenu">
                  <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>

              <div class="user-menu" *ngIf="showUserMenu" @fadeIn>
                <div class="menu-header">
                  <span class="menu-name">{{ currentUser?.name }}</span>
                  <span class="menu-email">{{ currentUser?.email }}</span>
                </div>
                <div class="menu-divider"></div>
                <a routerLink="/dashboard">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6l6-4 6 4v6l-6 4-6-4V6z" stroke="currentColor" stroke-width="1.5"/></svg>
                  Dashboard
                </a>
                <a routerLink="/settings">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M12.7 9.3a5 5 0 000-2.6l1.7-1.7a7 7 0 00-1.7-1.7L11 4a5 5 0 00-2.6 0L6.7 2.3a7 7 0 00-1.7 1.7L4 5.7a5 5 0 000 2.6L2.3 10a7 7 0 001.7 1.7L5.7 14a5 5 0 002.6 0L10 15.7a7 7 0 001.7-1.7L13.3 12" stroke="currentColor" stroke-width="1.5"/></svg>
                  Settings
                </a>
                <a routerLink="/settings/billing">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 8h12" stroke="currentColor" stroke-width="1.5"/></svg>
                  Billing
                </a>
                <div class="menu-divider"></div>
                <button class="logout-btn" (click)="logout()">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 14H3a2 2 0 01-2-2V4a2 2 0 012-2h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  Sign Out
                </button>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" [class.active]="showMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" *ngIf="showMobileMenu" @slideDown>
        <div class="mobile-links" *ngIf="!currentUser">
          <a routerLink="/features" (click)="closeMobileMenu()">Features</a>
          <a routerLink="/pricing" (click)="closeMobileMenu()">Pricing</a>
          <a routerLink="/about" (click)="closeMobileMenu()">About</a>
          <a routerLink="/api-docs" (click)="closeMobileMenu()">API</a>
          <div class="mobile-actions">
            <a routerLink="/login" class="btn btn-secondary" (click)="closeMobileMenu()">Sign In</a>
            <a routerLink="/register" class="btn btn-primary" (click)="closeMobileMenu()">Get Started</a>
          </div>
        </div>

        <div class="mobile-links" *ngIf="currentUser">
          <a routerLink="/dashboard" (click)="closeMobileMenu()">Dashboard</a>
          <a routerLink="/create" (click)="closeMobileMenu()">Create Video</a>
          <a routerLink="/videos" (click)="closeMobileMenu()">My Videos</a>
          <a routerLink="/templates" (click)="closeMobileMenu()">Templates</a>
          <a routerLink="/projects" (click)="closeMobileMenu()">Projects</a>
          <a routerLink="/brand-kits" (click)="closeMobileMenu()">Brand Kits</a>
          <a routerLink="/team" (click)="closeMobileMenu()">Team</a>
          <a routerLink="/analytics" (click)="closeMobileMenu()">Analytics</a>
          <a routerLink="/settings" (click)="closeMobileMenu()">Settings</a>
          <div class="mobile-credits">
            <span>Credits: {{ currentUser?.credits || 0 }}</span>
            <a routerLink="/credits" class="btn btn-primary btn-sm" (click)="closeMobileMenu()">Buy More</a>
          </div>
          <button class="btn btn-secondary" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      height: 80px;
      transition: all 0.3s ease;
      background: transparent;
    }

    .navbar.scrolled {
      background: rgba(10, 10, 15, 0.9);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-light);
    }

    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
    }

    /* Logo */
    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }

    .logo-icon {
      width: 40px;
      height: 40px;
    }

    .logo-icon svg {
      width: 100%;
      height: 100%;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .logo-text .gradient {
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Navigation Links */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .nav-links > a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.2s ease;
      position: relative;
    }

    .nav-links > a:hover,
    .nav-links > a.active {
      color: var(--text-primary);
    }

    .nav-links > a::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--gradient-primary);
      transition: width 0.3s ease;
      border-radius: 2px;
    }

    .nav-links > a:hover::after,
    .nav-links > a.active::after {
      width: 100%;
    }

    /* Dropdown */
    .dropdown {
      position: relative;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      padding: 0.5rem;
      transition: color 0.2s ease;
    }

    .dropdown-trigger:hover {
      color: var(--text-primary);
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 50%;
      transform: translateX(-50%);
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 0.5rem;
      min-width: 180px;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-lg);
    }

    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
    }

    .dropdown-menu a {
      display: block;
      padding: 0.625rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
    }

    .dropdown-menu a:hover {
      background: var(--bg-glass);
      color: var(--text-primary);
    }

    /* Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .credits-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-full);
      color: #f59e0b;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .credits-badge .add-btn {
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(245, 158, 11, 0.2);
      border-radius: 50%;
      color: #f59e0b;
      text-decoration: none;
      font-size: 0.75rem;
      transition: all 0.2s ease;
    }

    .credits-badge .add-btn:hover {
      background: rgba(245, 158, 11, 0.3);
    }

    /* User Dropdown */
    .user-dropdown {
      position: relative;
    }

    .user-trigger {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 0.375rem 0.75rem 0.375rem 0.375rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .user-trigger:hover {
      border-color: var(--border-medium);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
      color: white;
      overflow: hidden;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-trigger svg.rotated {
      transform: rotate(180deg);
    }

    .user-menu {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 0.75rem;
      min-width: 240px;
      box-shadow: var(--shadow-xl);
    }

    .menu-header {
      padding: 0.5rem;
    }

    .menu-name {
      display: block;
      font-weight: 600;
      color: var(--text-primary);
    }

    .menu-email {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    .menu-divider {
      height: 1px;
      background: var(--border-light);
      margin: 0.5rem 0;
    }

    .user-menu a,
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.625rem 0.75rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.875rem;
      border-radius: var(--radius-md);
      transition: all 0.2s ease;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
    }

    .user-menu a:hover,
    .logout-btn:hover {
      background: var(--bg-glass);
      color: var(--text-primary);
    }

    .logout-btn {
      color: var(--accent-rose);
    }

    .logout-btn:hover {
      background: rgba(244, 63, 94, 0.1);
    }

    /* Mobile Menu Button */
    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.5rem;
    }

    .mobile-menu-btn span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--text-primary);
      transition: all 0.3s ease;
    }

    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }

    /* Mobile Menu */
    .mobile-menu {
      display: none;
      position: absolute;
      top: 80px;
      left: 0;
      right: 0;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-light);
      padding: 1.5rem;
      box-shadow: var(--shadow-xl);
    }

    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-links a {
      padding: 0.875rem 1rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 1rem;
      border-radius: var(--radius-lg);
      transition: all 0.2s ease;
    }

    .mobile-links a:hover {
      background: var(--bg-glass);
      color: var(--text-primary);
    }

    .mobile-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .mobile-credits {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: rgba(245, 158, 11, 0.1);
      border-radius: var(--radius-lg);
      color: #f59e0b;
      font-weight: 600;
    }

    @media (max-width: 1024px) {
      .nav-links {
        display: none;
      }

      .mobile-menu-btn,
      .mobile-menu {
        display: flex;
      }
    }

    @media (max-width: 640px) {
      .navbar {
        height: 70px;
      }

      .logo-text {
        font-size: 1.25rem;
      }

      .credits-badge span {
        display: none;
      }

      .user-name {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit {
  isScrolled = false;
  showUserMenu = false;
  showMobileMenu = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown')) {
      this.showUserMenu = false;
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu() {
    this.showMobileMenu = false;
  }

  getInitials(): string {
    if (!this.currentUser?.name) return '?';
    return this.currentUser.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
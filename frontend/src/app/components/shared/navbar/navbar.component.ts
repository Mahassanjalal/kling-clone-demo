import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <a routerLink="/">
          <span class="logo">Kling AI</span>
        </a>
      </div>
      
      <div class="nav-links" *ngIf="currentUser">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/generate" routerLinkActive="active">Create Video</a>
        <a routerLink="/gallery" routerLinkActive="active">My Videos</a>
      </div>
      
      <div class="nav-auth">
        <ng-container *ngIf="!currentUser; else userMenu">
          <a routerLink="/login" class="btn btn-outline">Login</a>
          <a routerLink="/register" class="btn btn-primary">Sign Up</a>
        </ng-container>
        
        <ng-template #userMenu>
          <div class="user-menu">
            <span class="credits">
              <span class="credits-icon">⚡</span>
              {{ currentUser?.credits }} credits
            </span>
            <div class="dropdown">
              <button class="dropdown-toggle">
                {{ currentUser?.name }}
                <span class="arrow">▼</span>
              </button>
              <div class="dropdown-menu">
                <a routerLink="/dashboard">Dashboard</a>
                <hr>
                <button (click)="logout()" class="logout-btn">Logout</button>
              </div>
            </div>
          </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background: rgba(26, 26, 46, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-brand a {
      text-decoration: none;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
    }

    .nav-links a {
      color: #a0a0a0;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
      position: relative;
    }

    .nav-links a:hover,
    .nav-links a.active {
      color: #fff;
    }

    .nav-links a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 2px;
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.3s;
      cursor: pointer;
      border: none;
      font-size: 0.9rem;
    }

    .btn-outline {
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: transparent;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-primary {
      color: #fff;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .credits {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #ffd700;
      font-weight: 600;
      background: rgba(255, 215, 0, 0.1);
      padding: 0.5rem 1rem;
      border-radius: 20px;
    }

    .credits-icon {
      font-size: 1.1rem;
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.95rem;
      padding: 0.5rem;
    }

    .arrow {
      font-size: 0.7rem;
      opacity: 0.7;
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: rgba(30, 30, 50, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 8px;
      padding: 0.5rem 0;
      min-width: 150px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s;
    }

    .dropdown:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-menu a,
    .dropdown-menu button {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      color: #a0a0a0;
      text-decoration: none;
      background: transparent;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .dropdown-menu a:hover,
    .dropdown-menu button:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }

    .dropdown-menu hr {
      border: none;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      margin: 0.5rem 0;
    }

    .logout-btn {
      color: #ff6b6b !important;
    }

    .logout-btn:hover {
      background: rgba(255, 107, 107, 0.1) !important;
    }
  `]
})
export class NavbarComponent {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
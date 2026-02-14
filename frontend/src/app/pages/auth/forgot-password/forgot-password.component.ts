import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="auth-page">
      <div class="auth-background">
        <div class="gradient-orb orb-1"></div>
        <div class="gradient-orb orb-2"></div>
        <div class="gradient-orb orb-3"></div>
      </div>
      
      <div class="auth-container" @fadeIn>
        <div class="auth-card">
          <div class="auth-header">
            <a routerLink="/" class="logo">
              <div class="logo-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" stroke="url(#logoGradient)" stroke-width="2" fill="none"/>
                  <path d="M16 8l-6 3.5v7l6 3.5 6-3.5v-7L16 8z" fill="url(#logoGradient)"/>
                </svg>
              </div>
              <span class="logo-text">Kling<span class="gradient">AI</span></span>
            </a>
            <h1>Forgot Password?</h1>
            <p>No worries, we'll send you reset instructions</p>
          </div>

          <div class="success-state" *ngIf="isSuccess">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Check your email</h2>
            <p>We've sent password reset instructions to <strong>{{ emailForm.get('email')?.value }}</strong></p>
            <button class="btn btn-secondary btn-block mt-4" (click)="backToLogin()">
              Back to Login
            </button>
          </div>

          <form *ngIf="!isSuccess" [formGroup]="emailForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="email">Email</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input 
                  type="email" 
                  id="email"
                  formControlName="email"
                  placeholder="Enter your email"
                  [class.error]="emailForm.get('email')?.invalid && emailForm.get('email')?.touched"
                >
              </div>
              <div class="error-message" *ngIf="emailForm.get('email')?.invalid && emailForm.get('email')?.touched">
                Please enter a valid email
              </div>
            </div>

            <div class="error-alert" *ngIf="errorMessage">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {{ errorMessage }}
            </div>

            <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="emailForm.invalid || isLoading">
              <span *ngIf="!isLoading">Reset Password</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </form>

          <div class="auth-footer" *ngIf="!isSuccess">
            <a routerLink="/login" class="back-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      padding: 2rem;
    }

    .auth-background {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    .gradient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.5;
      animation: float 10s ease-in-out infinite;
    }

    .orb-1 {
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%);
      top: -200px;
      left: -200px;
    }

    .orb-2 {
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      animation-delay: -5s;
    }

    .orb-3 {
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: -2s;
    }

    .auth-container {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 440px;
    }

    .auth-card {
      background: var(--bg-card);
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-2xl);
      padding: 2.5rem;
      box-shadow: var(--shadow-xl);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      margin-bottom: 1.5rem;
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

    .gradient {
      background: linear-gradient(135deg, var(--primary-400), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .auth-header p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
    }

    .auth-form {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-secondary);
    }

    .input-wrapper {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }

    input {
      width: 100%;
      padding: 0.875rem 1rem 0.875rem 2.75rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 0.9375rem;
      transition: all 0.2s ease;
    }

    input:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }

    input.error {
      border-color: var(--accent-rose);
    }

    input::placeholder {
      color: var(--text-muted);
    }

    .error-message {
      color: var(--accent-rose);
      font-size: 0.75rem;
      margin-top: 0.5rem;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.875rem 1rem;
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.2);
      border-radius: var(--radius-lg);
      color: var(--accent-rose);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .btn-block {
      width: 100%;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }

    .success-state {
      text-align: center;
      padding: 2rem 0;
    }

    .success-icon {
      width: 80px;
      height: 80px;
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid rgba(16, 185, 129, 0.3);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--accent-emerald);
    }

    .success-state h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .success-state p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .success-state strong {
      color: var(--text-primary);
    }

    .mt-4 {
      margin-top: 1.5rem;
    }

    .auth-footer {
      text-align: center;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9375rem;
      transition: color 0.2s ease;
    }

    .back-link:hover {
      color: var(--primary-400);
    }

    @media (max-width: 480px) {
      .auth-page {
        padding: 1rem;
      }

      .auth-card {
        padding: 1.5rem;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  emailForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.emailForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1500);
  }

  backToLogin() {
    window.location.href = '/login';
  }
}

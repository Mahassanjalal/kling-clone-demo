import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-reset-password',
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
            <h1>Create New Password</h1>
            <p>Enter a new secure password for your account</p>
          </div>

          <div class="error-container" *ngIf="!isTokenValid">
            <div class="error-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2>Invalid or Expired Link</h2>
            <p>This password reset link is invalid or has expired. Please request a new one.</p>
            <a routerLink="/forgot-password" class="btn btn-primary btn-block mt-4">Request New Link</a>
          </div>

          <div class="success-state" *ngIf="isSuccess">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Password Reset!</h2>
            <p>Your password has been successfully reset. You can now log in with your new password.</p>
            <a routerLink="/login" class="btn btn-primary btn-block mt-4">Go to Login</a>
          </div>

          <form *ngIf="isTokenValid && !isSuccess" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="password">New Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  formControlName="password"
                  placeholder="Enter new password"
                  [class.error]="resetForm.get('password')?.invalid && resetForm.get('password')?.touched"
                >
                <button type="button" class="toggle-password" (click)="togglePassword()">
                  <svg *ngIf="!showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <div class="password-requirements">
                <div class="requirement" [class.met]="hasMinLength">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  At least 8 characters
                </div>
                <div class="requirement" [class.met]="hasUpperCase">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  One uppercase letter
                </div>
                <div class="requirement" [class.met]="hasNumber">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  One number
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="input-wrapper">
                <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  placeholder="Confirm new password"
                  [class.error]="resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched"
                >
                <button type="button" class="toggle-password" (click)="toggleConfirmPassword()">
                  <svg *ngIf="!showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg *ngIf="showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
              <div class="error-message" *ngIf="resetForm.hasError('mismatch') && resetForm.get('confirmPassword')?.touched">
                Passwords do not match
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

            <button type="submit" class="btn btn-primary btn-lg btn-block" [disabled]="resetForm.invalid || isLoading">
              <span *ngIf="!isLoading">Reset Password</span>
              <span *ngIf="isLoading" class="spinner"></span>
            </button>
          </form>
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
      margin-bottom: 1.25rem;
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

    .toggle-password {
      position: absolute;
      right: 1rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem;
    }

    .toggle-password:hover {
      color: var(--text-primary);
    }

    .password-requirements {
      margin-top: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .requirement {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-muted);
      transition: color 0.2s ease;
    }

    .requirement svg {
      opacity: 0.3;
      transition: all 0.2s ease;
    }

    .requirement.met {
      color: var(--accent-emerald);
    }

    .requirement.met svg {
      opacity: 1;
      stroke: var(--accent-emerald);
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

    .error-container,
    .success-state {
      text-align: center;
      padding: 2rem 0;
    }

    .error-icon,
    .success-icon {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .error-icon {
      background: rgba(244, 63, 94, 0.1);
      border: 2px solid rgba(244, 63, 94, 0.3);
      color: var(--accent-rose);
    }

    .success-icon {
      background: rgba(16, 185, 129, 0.1);
      border: 2px solid rgba(16, 185, 129, 0.3);
      color: var(--accent-emerald);
    }

    .error-container h2,
    .success-state h2 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }

    .error-container p,
    .success-state p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
    }

    .mt-4 {
      margin-top: 1.5rem;
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
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  isTokenValid = true;
  errorMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      // In a real app, validate the token with the backend
      if (!this.token) {
        this.isTokenValid = false;
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  get hasMinLength(): boolean {
    return (this.resetForm.get('password')?.value?.length || 0) >= 8;
  }

  get hasUpperCase(): boolean {
    return /[A-Z]/.test(this.resetForm.get('password')?.value || '');
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.resetForm.get('password')?.value || '');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.resetForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.isSuccess = true;
    }, 1500);
  }
}

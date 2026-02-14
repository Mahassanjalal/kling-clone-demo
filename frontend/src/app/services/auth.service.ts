import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  avatar: string | null;
  isEmailVerified: boolean;
  role: string;
  preferences: {
    language: string;
    emailNotifications: boolean;
    marketingEmails: boolean;
  };
}

export interface Subscription {
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: string;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  features: {
    maxVideosPerMonth: number;
    maxVideoLength: number;
    maxResolution: string;
    maxStorage: number;
    teamSeats: number;
    apiAccess: boolean;
    whiteLabel: boolean;
    prioritySupport: boolean;
    advancedAnalytics: boolean;
  };
  usage: {
    videosThisMonth: number;
    storageUsed: number;
    apiCalls: number;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  subscription?: Subscription;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private subscriptionSubject = new BehaviorSubject<Subscription | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public subscription$ = this.subscriptionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  initializeAuth() {
    // Check if user is already logged in
    this.getCurrentUser().subscribe({
      next: (response) => {
        this.currentUserSubject.next(response.user);
        this.subscriptionSubject.next(response.subscription || null);
      },
      error: () => {
        this.logout();
      }
    });
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, {
      name,
      email,
      password
    }).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.subscriptionSubject.next(response.subscription || null);
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
        this.subscriptionSubject.next(response.subscription || null);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/auth/logout`, {}).subscribe({
      next: () => {
        this.currentUserSubject.next(null);
        this.subscriptionSubject.next(null);
        this.router.navigate(['/']);
      },
      error: () => {
        this.currentUserSubject.next(null);
        this.subscriptionSubject.next(null);
        this.router.navigate(['/']);
      }
    });
  }

  getCurrentUser(): Observable<{ user: User; subscription?: Subscription }> {
    return this.http.get<{ user: User; subscription?: Subscription }>(`${this.apiUrl}/auth/me`);
  }

  updateProfile(data: Partial<User>): Observable<{ message: string; user: User }> {
    return this.http.put<{ message: string; user: User }>(`${this.apiUrl}/auth/profile`, data).pipe(
      tap(response => {
        this.currentUserSubject.next(response.user);
      })
    );
  }

  updatePreferences(preferences: Partial<User['preferences']>): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, { preferences }).pipe(
      tap(() => {
        const currentUser = this.currentUserSubject.value;
        if (currentUser) {
          currentUser.preferences = { ...currentUser.preferences, ...preferences };
          this.currentUserSubject.next(currentUser);
        }
      })
    );
  }

  verifyEmail(token: string): Observable<{ message: string }> {
    return this.http.get<{ message: string }>(`${this.apiUrl}/auth/verify-email?token=${token}`);
  }

  resendVerification(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/resend-verification`, { email });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/auth/reset-password`, {
      token,
      password
    });
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  getSubscriptionValue(): Subscription | null {
    return this.subscriptionSubject.value;
  }

  hasPlan(plans: string[]): boolean {
    const subscription = this.subscriptionSubject.value;
    return subscription ? plans.includes(subscription.plan) : plans.includes('free');
  }
}
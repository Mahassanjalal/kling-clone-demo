import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Subscription } from './auth.service';
import { VideoJob } from './video.service';

export interface DashboardStats {
  totalVideos: number;
  completedVideos: number;
  processingVideos: number;
  pendingVideos: number;
  totalProjects: number;
  creditsRemaining: number;
  creditsSpent: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentVideos: VideoJob[];
  subscription?: Subscription;
  team: {
    id: string;
    name: string;
    role: string;
  } | null;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/users/dashboard`);
  }

  getCredits(): Observable<{ credits: number; subscription?: Subscription }> {
    return this.http.get<{ credits: number; subscription?: Subscription }>(`${this.apiUrl}/users/credits`);
  }

  getApiKey(): Observable<{ apiKey: string; createdAt: string; lastUsedAt: string }> {
    return this.http.get<{ apiKey: string; createdAt: string; lastUsedAt: string }>(`${this.apiUrl}/users/api-key`);
  }

  generateApiKey(): Observable<{ message: string; apiKey: string }> {
    return this.http.post<{ message: string; apiKey: string }>(`${this.apiUrl}/users/api-key`, {});
  }

  revokeApiKey(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/users/api-key`);
  }

  updatePreferences(preferences: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/preferences`, { preferences });
  }
}
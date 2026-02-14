import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VideoSettings {
  duration: number;
  resolution: '480p' | '720p' | '1080p' | '4k';
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  style: 'realistic' | 'animated' | 'cinematic' | 'artistic';
  cameraMovement: 'static' | 'zoom-in' | 'zoom-out' | 'pan-left' | 'pan-right' | 'tilt-up' | 'tilt-down';
  fps?: number;
}

export interface VideoJob {
  id: string;
  userId: string;
  prompt: string;
  referenceImage: string | null;
  settings: VideoSettings;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'canceled';
  progress: number;
  outputUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  creditsUsed: number;
  metadata?: {
    type: string;
    predictionId?: string;
    projectId?: string;
    sceneId?: string;
  };
  createdAt: string;
  completedAt: string | null;
}

export interface GenerateVideoRequest {
  prompt: string;
  settings: Partial<VideoSettings>;
  referenceImage?: File;
}

export interface GenerateVideoResponse {
  message: string;
  job: {
    id: string;
    prompt: string;
    settings: VideoSettings;
    status: string;
    creditsUsed: number;
    createdAt: string;
  };
  remainingCredits: number;
}

export interface VideoStatusResponse {
  status: string;
  progress: number;
  outputUrl: string | null;
  thumbnailUrl: string | null;
  errorMessage: string | null;
  predictionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  generateVideo(data: GenerateVideoRequest): Observable<GenerateVideoResponse> {
    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append('settings', JSON.stringify(data.settings));
    
    if (data.referenceImage) {
      formData.append('referenceImage', data.referenceImage);
    }

    return this.http.post<GenerateVideoResponse>(`${this.apiUrl}/videos/generate`, formData);
  }

  getMyVideos(page: number = 1, limit: number = 12): Observable<{
    videos: VideoJob[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  }> {
    return this.http.get<any>(`${this.apiUrl}/videos/my-videos?page=${page}&limit=${limit}`);
  }

  getVideo(id: string): Observable<{ video: VideoJob }> {
    return this.http.get<{ video: VideoJob }>(`${this.apiUrl}/videos/${id}`);
  }

  getVideoStatus(id: string): Observable<VideoStatusResponse> {
    return this.http.get<VideoStatusResponse>(`${this.apiUrl}/videos/${id}/status`);
  }

  cancelVideo(id: string): Observable<{ message: string; refundedCredits: number }> {
    return this.http.post<{ message: string; refundedCredits: number }>(`${this.apiUrl}/videos/${id}/cancel`, {});
  }

  deleteVideo(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/videos/${id}`);
  }

  regenerateVideo(id: string): Observable<GenerateVideoResponse> {
    return this.http.post<GenerateVideoResponse>(`${this.apiUrl}/videos/${id}/regenerate`, {});
  }

  calculateCreditCost(settings: Partial<VideoSettings>): number {
    const baseCosts: { [key: number]: number } = { 5: 10, 10: 20, 15: 30, 30: 50, 60: 80, 120: 150, 300: 300 };
    const resolutionMultipliers: { [key: string]: number } = { '480p': 1, '720p': 1.5, '1080p': 2, '4k': 4 };
    
    const baseCost = baseCosts[settings.duration || 5] || 10;
    const multiplier = resolutionMultipliers[settings.resolution || '720p'] || 1;
    
    return Math.round(baseCost * multiplier);
  }
}
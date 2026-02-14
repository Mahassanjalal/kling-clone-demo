import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  ownerId: string;
  members: TeamMember[];
  subscription: {
    plan: string;
    seats: number;
  };
  credits: {
    balance: number;
    monthly: number;
  };
  myRole?: string;
  myPermissions?: {
    canCreate: boolean;
    canEdit: boolean;
    canDelete: boolean;
    canManageTeam: boolean;
    canManageBilling: boolean;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createTeam(name: string, description?: string): Observable<{ message: string; team: Partial<Team> }> {
    return this.http.post<{ message: string; team: Partial<Team> }>(`${this.apiUrl}/teams/create`, {
      name,
      description
    });
  }

  getMyTeam(): Observable<{ team: Team | null }> {
    return this.http.get<{ team: Team | null }>(`${this.apiUrl}/teams/my-team`);
  }

  inviteMember(email: string, role: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/teams/invite`, { email, role });
  }

  acceptInvite(token: string, teamId: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/teams/accept-invite`, { token, teamId });
  }

  removeMember(memberId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/teams/members/${memberId}`);
  }

  updateMemberRole(memberId: string, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/teams/members/${memberId}/role`, { role });
  }

  leaveTeam(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/teams/leave`, {});
  }

  generateApiKey(name: string): Observable<{ message: string; apiKey: string }> {
    return this.http.post<{ message: string; apiKey: string }>(`${this.apiUrl}/teams/api-key`, { name });
  }
}
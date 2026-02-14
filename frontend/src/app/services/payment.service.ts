import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';

export interface Plan {
  name: string;
  price: number;
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
}

export interface CreditPackage {
  amount: number;
  price: number;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  url: string;
  pdf: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:3000/api';
  private stripePromise = loadStripe('pk_test_your_key');

  constructor(private http: HttpClient) {}

  getPlans(): Observable<{ plans: { [key: string]: Plan }; creditPackages: CreditPackage[] }> {
    return this.http.get<{ plans: { [key: string]: Plan }; creditPackages: CreditPackage[] }>(`${this.apiUrl}/payments/plans`);
  }

  getSubscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/payments/subscription`);
  }

  async createCheckoutSession(plan: string, billingCycle: 'monthly' | 'yearly' = 'monthly') {
    const response = await this.http.post<{ sessionId: string; url: string }>(
      `${this.apiUrl}/payments/create-checkout-session`,
      { plan, billingCycle }
    ).toPromise();
    
    if (response?.url) {
      window.location.href = response.url;
    }
  }

  async purchaseCredits(packageIndex: number) {
    const response = await this.http.post<{ sessionId: string; url: string }>(
      `${this.apiUrl}/payments/purchase-credits`,
      { packageIndex }
    ).toPromise();
    
    if (response?.url) {
      window.location.href = response.url;
    }
  }

  async openBillingPortal() {
    const response = await this.http.post<{ url: string }>(
      `${this.apiUrl}/payments/billing-portal`,
      {}
    ).toPromise();
    
    if (response?.url) {
      window.location.href = response.url;
    }
  }

  getInvoices(): Observable<{ invoices: Invoice[] }> {
    return this.http.get<{ invoices: Invoice[] }>(`${this.apiUrl}/payments/invoices`);
  }

  cancelSubscription(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/payments/cancel-subscription`, {});
  }

  reactivateSubscription(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/payments/reactivate-subscription`, {});
  }
}
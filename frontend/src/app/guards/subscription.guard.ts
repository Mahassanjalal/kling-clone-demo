import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPlans = route.data['plans'] as string[];
    
    if (this.authService.hasPlan(requiredPlans)) {
      return true;
    }
    
    this.router.navigate(['/pricing'], { 
      queryParams: { 
        upgrade: 'true',
        feature: route.url[0]?.path 
      }
    });
    return false;
  }
}
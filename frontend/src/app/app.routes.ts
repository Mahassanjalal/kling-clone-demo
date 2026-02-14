import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { SubscriptionGuard } from './guards/subscription.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./pages/features/features.component').then(m => m.FeaturesComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./pages/auth/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },

  // Protected Routes
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/video-generator/video-generator.component').then(m => m.VideoGeneratorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'videos',
    loadComponent: () => import('./pages/videos/videos.component').then(m => m.VideosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'video/:id',
    loadComponent: () => import('./pages/video-detail/video-detail.component').then(m => m.VideoDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'templates',
    loadComponent: () => import('./pages/templates/templates.component').then(m => m.TemplatesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'templates/:id',
    loadComponent: () => import('./pages/template-detail/template-detail.component').then(m => m.TemplateDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./pages/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'projects/:id',
    loadComponent: () => import('./pages/project-editor/project-editor.component').then(m => m.ProjectEditorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'new-project',
    loadComponent: () => import('./pages/project-wizard/project-wizard.component').then(m => m.ProjectWizardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'brand-kits',
    loadComponent: () => import('./pages/brand-kits/brand-kits.component').then(m => m.BrandKitsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'brand-kits/:id',
    loadComponent: () => import('./pages/brand-kit-editor/brand-kit-editor.component').then(m => m.BrandKitEditorComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'team',
    loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [AuthGuard, SubscriptionGuard],
    data: { plans: ['pro', 'business', 'enterprise'] }
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'settings/billing',
    loadComponent: () => import('./pages/settings/billing/billing.component').then(m => m.BillingComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'credits',
    loadComponent: () => import('./pages/credits/credits.component').then(m => m.CreditsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/success',
    loadComponent: () => import('./pages/payment/success/success.component').then(m => m.PaymentSuccessComponent)
  },

  // API Docs (Public)
  {
    path: 'api-docs',
    loadComponent: () => import('./pages/api-docs/api-docs.component').then(m => m.ApiDocsComponent)
  },

  // 404
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
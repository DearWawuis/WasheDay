import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'home-washo',
    loadChildren: () => import('./pages/washo/home-washo/home-washo.module').then( m => m.HomeWashoPageModule)
  },
  {
    path: 'home-washer',
    loadChildren: () => import('./pages/washer/home-washer/home-washer.module').then( m => m.HomeWasherPageModule)
  },
  {
    path: 'history-washo',
    loadChildren: () => import('./pages/washo/history-washo/history-washo.module').then( m => m.HistoryWashoPageModule)
  },
  {
    path: 'monitoring-washer',
    loadChildren: () => import('./pages/washer/monitoring-washer/monitoring-washer.module').then( m => m.MonitoringWasherPageModule)
  },
  {
    path: 'recommendations',
    loadChildren: () => import('./pages/recommendations/recommendations.module').then( m => m.RecommendationsPageModule)
  },
  {
    path: 'washer-proceso',
    loadChildren: () => import('./pages/washer/washer-proceso/washer-proceso.module').then( m => m.WasherProcesoPageModule)
  },
  {
    path: 'payment-method-washo',
    loadChildren: () => import('./pages/washo/payment-method-washo/payment-method-washo.module').then( m => m.PaymentMethodWashoPageModule)
  },
  {
    path: 'stripe-washo/:id',
    loadChildren: () => import('./pages/washo/stripe-washo/stripe-washo.module').then( m => m.StripeWashoPageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

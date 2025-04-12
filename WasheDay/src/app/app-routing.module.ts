import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  //Falta proteger esta ruta
  {
    path: 'configuration-washer',
    loadChildren: () =>
      import(
        './pages/washer/configuration-washer/configuration-washer.module'
      ).then((m) => m.ConfigurationWasherPageModule),
  },
  // Rutas protegidas para washo
  {
    path: 'home-washo',
    loadChildren: () =>
      import('./pages/washo/home-washo/home-washo.module').then(
        (m) => m.HomeWashoPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washo' }, // Si necesitas protección por rol
  },
  {
    path: 'history-washo',
    loadChildren: () =>
      import('./pages/washo/history-washo/history-washo.module').then(
        (m) => m.HistoryWashoPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washo' },
  },
  {
    path: 'payment-method-washo',
    loadChildren: () =>
      import(
        './pages/washo/payment-method-washo/payment-method-washo.module'
      ).then((m) => m.PaymentMethodWashoPageModule),
    // canActivate: [AuthGuard],
    data: { role: 'washo' },
  },
  {
    path: 'stripe-washo/:id',
    loadChildren: () =>
      import('./pages/washo/stripe-washo/stripe-washo.module').then(
        (m) => m.StripeWashoPageModule
      ),
    // canActivate: [AuthGuard],
    data: { role: 'washo' },
  },
  // Rutas protegidas para washer
  {
    path: 'home-washer',
    loadChildren: () =>
      import('./pages/washer/home-washer/home-washer.module').then(
        (m) => m.HomeWasherPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washer' },
  },
  {
    path: 'monitoring-washer',
    loadChildren: () =>
      import('./pages/washer/monitoring-washer/monitoring-washer.module').then(
        (m) => m.MonitoringWasherPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washer' },
  },
  {
    path: 'washer-proceso',
    loadChildren: () =>
      import('./pages/washer/washer-proceso/washer-proceso.module').then(
        (m) => m.WasherProcesoPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washer' },
  },
  {
    path: 'homewasher-config',
    loadChildren: () =>
      import('./pages/washer/homewasher-config/homewasher-config.module').then(
        (m) => m.HomewasherConfigPageModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'washer' },
  },
  // Ruta de recomendaciones
  {
    path: 'recommendations',
    loadChildren: () =>
      import('./pages/recommendations/recommendations.module').then(
        (m) => m.RecommendationsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    canActivate: [AuthGuard],
    path: 'solicitando-servicio',
    loadChildren: () =>
      import(
        './pages/washo/solicitando-servicio/solicitando-servicio.module'
      ).then((m) => m.SolicitandoServicioPageModule),
  },
  // Redirección para rutas no encontradas
  {
    path: '**',
    redirectTo: 'login',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

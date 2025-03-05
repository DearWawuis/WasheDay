import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'calificaciones',
    loadChildren: () => import('./pages/calificaciones/calificaciones.module').then( m => m.CalificacionesPageModule)
  },
  {
    path: 'calificaciones-materias',
    loadChildren: () => import('./pages/calificaciones-materias/calificaciones-materias.module').then( m => m.CalificacionesMateriasPageModule)
  },  {
    path: 'horario',
    loadChildren: () => import('./pages/horario/horario.module').then( m => m.HorarioPageModule)
  },
  {
    path: 'horario-detalles',
    loadChildren: () => import('./pages/horario-detalles/horario-detalles.module').then( m => m.HorarioDetallesPageModule)
  },
  {
    path: 'horario-materia',
    loadChildren: () => import('./pages/horario-materia/horario-materia.module').then( m => m.HorarioMateriaPageModule)
  },
  {
    path: 'english-score',
    loadChildren: () => import('./pages/english-score/english-score.module').then( m => m.EnglishScorePageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

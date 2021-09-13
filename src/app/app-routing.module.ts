import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'fonte',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/fonte/fonte.module').then( m => m.FontePageModule)
  },
  {
    path: 'agendamento',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/agendamento/agendamento.module').then( m => m.AgendamentoPageModule)
  },
  {
    path: 'perfil',
    canActivate: [AuthGuard],
    loadChildren: () => import('./pages/perfil/perfil.module').then( m => m.PerfilPageModule)
  },
  {
    path: 'meus-agendamentos',
    loadChildren: () => import('./pages/meus-agendamentos/meus-agendamentos.module').then( m => m.MeusAgendamentosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

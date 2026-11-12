import { Routes } from '@angular/router';
import { PaginaLogin } from './pages/login/login';
import { PaginaDashboard } from './pages/dashboard/dashboard';
import { SesionGuard } from './guards/sesion.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PaginaLogin },
  {
    path: 'dashboard',
    component: PaginaDashboard,
    canMatch: [SesionGuard]
  },
  { path: '**', redirectTo: '/login' }
];

import { Routes } from '@angular/router';
import { PaginaLogin } from './pages/login/login';
import { PaginaDashboard } from './pages/dashboard/dashboard';
import { SesionGuard } from './guards/sesion.guard';
import { PaginaPacientes } from './pages/pacientes/pacientes';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PaginaLogin },
  {
    path: 'dashboard',
    component: PaginaDashboard,
    canMatch: [SesionGuard]
  },
  {
    path: 'pacientes',
    component: PaginaPacientes,
    canMatch: [SesionGuard]
  },
  { path: '**', redirectTo: '/login' }
];

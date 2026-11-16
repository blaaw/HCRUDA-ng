import { Routes } from '@angular/router';
import { PaginaLogin } from './pages/login/login';
import { PaginaRegistro } from './pages/registro/registro';
import { PaginaDashboard } from './pages/dashboard/dashboard';
import { SesionGuard } from './guards/sesion.guard';
import { PaginaPacientes } from './pages/pacientes/pacientes';
import { PaginaPacienteDetalle } from './pages/paciente-detalle/paciente-detalle';
import { PaginaMedicoDetalle } from './pages/medico-detalle/medico-detalle';
import { PaginaDoctores } from './pages/doctores/doctores';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: PaginaLogin },
  { path: 'registro', component: PaginaRegistro },
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
  {
    path: 'pacientes/:id',
    component: PaginaPacienteDetalle,
    canMatch: [SesionGuard]
  },
  {
    path: 'doctores',
    component: PaginaDoctores,
    canMatch: [SesionGuard]
  },
  {
    path: 'doctores/:id',
    component: PaginaMedicoDetalle,
    canMatch: [SesionGuard]
  },
  { path: '**', redirectTo: '/login' }
];

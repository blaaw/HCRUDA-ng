import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

/**
 * Guardia de sesión: solo permite acceder si hay usuario logueado en sessionStorage.
 * Se usa en las rutas protegidas (dashboard, pacientes, doctores, citas, tratamientos).
 */
export const SesionGuard: CanMatchFn = () => {
  const router = inject(Router);
  const sesion = sessionStorage.getItem('usuario');
  if (sesion) {
    return true;
  }
  return router.parseUrl('/login');
};

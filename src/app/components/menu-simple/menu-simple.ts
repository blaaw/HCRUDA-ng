import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-menu-simple',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './menu-simple.html',
  styleUrl: './menu-simple.css'
})
export class MenuSimpleComponent {
  private router = inject(Router);

  menuItems = [
    { label: 'Dashboard', ruta: '/dashboard', icono: 'dashboard' },
    { label: 'Pacientes', ruta: '/pacientes', icono: 'people' },
    { label: 'Doctores', ruta: '/doctores', icono: 'local_hospital' },
    { label: 'Citas', ruta: '/citas', icono: 'event' },
    { label: 'Tratamientos', ruta: '/tratamientos', icono: 'medication' }
  ];

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}

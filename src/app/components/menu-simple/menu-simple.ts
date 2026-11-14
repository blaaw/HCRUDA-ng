import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
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

  usuarioConectado = signal<{ codigo: string; nombre: string; rol: string } | null>(null);

  menuItems = [
    { label: 'Dashboard', ruta: '/dashboard', icono: 'dashboard' },
    { label: 'Pacientes', ruta: '/pacientes', icono: 'people' },
    { label: 'Doctores', ruta: '/doctores', icono: 'local_hospital' },
    { label: 'Citas', ruta: '/citas', icono: 'event' },
    { label: 'Tratamientos', ruta: '/tratamientos', icono: 'medication' }
  ];

  constructor() {
    const sesion = sessionStorage.getItem('usuario');
    if (sesion) {
      this.usuarioConectado.set(JSON.parse(sesion));
    }
  }

  cerrarSesion(): void {
    sessionStorage.removeItem('usuario');
    this.usuarioConectado.set(null);
    this.router.navigate(['/login']);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ServicioUsuarios } from '../../services/servicio-usuarios.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class PaginaLogin implements OnInit {
  codigoUsuario = '';
  contrasenaUsuario = '';
  estaCargando = false;
  mensajeError = '';

  private servicioUsuarios = inject(ServicioUsuarios);
  private router = inject(Router);

  ngOnInit(): void {
    const sesionGuardada = sessionStorage.getItem('usuario');
    if (sesionGuardada) {
      this.router.navigate(['/dashboard']);
    }
  }

  iniciarSesion(): void {
    if (!this.codigoUsuario || !this.contrasenaUsuario) {
      this.mensajeError = 'Completa código y contraseña';
      return;
    }

    this.estaCargando = true;
    this.mensajeError = '';

    this.servicioUsuarios.obtenerUsuarios().subscribe({
      next: (listaUsuarios) => {
        this.estaCargando = false;
        const usuarioEncontrado = listaUsuarios.find(
          usuario => usuario.codigo === this.codigoUsuario && usuario.contrasena === this.contrasenaUsuario
        );
        if (usuarioEncontrado) {
          const sesion = {
            codigo: usuarioEncontrado.codigo,
            nombre: usuarioEncontrado.nombre,
            rol: usuarioEncontrado.rol
          };
          sessionStorage.setItem('usuario', JSON.stringify(sesion));

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        } else {
          this.mensajeError = 'Código o contraseña incorrectos';
        }
      },
      error: () => {
        this.estaCargando = false;
        this.mensajeError = 'No se pudo conectar con el servidor de datos';
      }
    });
  }
}

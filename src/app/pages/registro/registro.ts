import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NuevoUsuario } from '../../models/usuario.model';
import { ServicioUsuarios } from '../../services/servicio-usuarios.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class PaginaRegistro {
  private formBuilder = inject(FormBuilder);
  private servicioUsuarios = inject(ServicioUsuarios);
  private router = inject(Router);

  private contrasenasCoinciden = (formulario: AbstractControl): ValidationErrors | null => {
    const contrasena = formulario.get('contrasena')?.value;
    const confirmarContrasena = formulario.get('confirmarContrasena')?.value;

    return contrasena === confirmarContrasena ? null : { contrasenasDistintas: true };
  };

  formularioRegistro = this.formBuilder.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}[A-Za-z]$/)]],
      email: ['', [Validators.required, Validators.email]],
      rol: ['medico', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    },
    { validators: this.contrasenasCoinciden }
  );

  estaCargando = signal(false);
  mensajeError = signal('');
  mensajeExito = signal('');
  codigoAsignado = signal('');

  get nombre() {
    return this.formularioRegistro.get('nombre')!;
  }

  get apellidos() {
    return this.formularioRegistro.get('apellidos')!;
  }

  get dni() {
    return this.formularioRegistro.get('dni')!;
  }

  get email() {
    return this.formularioRegistro.get('email')!;
  }

  get rol() {
    return this.formularioRegistro.get('rol')!;
  }

  get contrasena() {
    return this.formularioRegistro.get('contrasena')!;
  }

  get confirmarContrasena() {
    return this.formularioRegistro.get('confirmarContrasena')!;
  }

  registrarUsuario(): void {
    this.mensajeError.set('');
    this.mensajeExito.set('');

    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const datosFormulario = this.formularioRegistro.getRawValue();
    const nuevoUsuario: NuevoUsuario = {
      nombre: (datosFormulario.nombre ?? '').trim(),
      apellidos: (datosFormulario.apellidos ?? '').trim(),
      dni: (datosFormulario.dni ?? '').trim().toUpperCase(),
      email: (datosFormulario.email ?? '').trim().toLowerCase(),
      rol: datosFormulario.rol as "medico" | "enfermero",
      contrasena: datosFormulario.contrasena ?? ''
    };

    this.estaCargando.set(true);

    this.servicioUsuarios.registrarUsuario(nuevoUsuario).subscribe({
      next: usuarioCreado => {
        this.estaCargando.set(false);
        this.codigoAsignado.set(usuarioCreado.codigo);
        this.mensajeExito.set('La cuenta se creó correctamente.');
        setTimeout(() => this.router.navigate(['/login']), 6000);
      },
      error: (error: Error) => {
        this.estaCargando.set(false);
        this.mensajeError.set(error.message || 'No se pudo registrar el usuario.');
      }
    });
  }
}

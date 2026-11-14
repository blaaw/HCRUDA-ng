import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './tabla-pacientes.html',
  styleUrl: './tabla-pacientes.css'
})
export class TablaPacientesComponent {
  @Input() pacientes: Paciente[] = [];
  @Output() seleccionarPaciente = new EventEmitter<string>();

  filtroNombre = signal('');
  columnas = ['nombre', 'apellidos', 'dni', 'telefono', 'tipo', 'accion'];

  get pacientesFiltrados() {
    const filtro = this.filtroNombre().toLowerCase();
    return this.pacientes.filter(p =>
      filtro === '' ||
      (p.nombre + ' ' + p.apellidos).toLowerCase().includes(filtro)
    );
  }

  verDetalle(id: string): void {
    this.seleccionarPaciente.emit(id);
  }

  trackById(_indice: number, elemento: { id: string }): string {
    return elemento.id;
  }
}

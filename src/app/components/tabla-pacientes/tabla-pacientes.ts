import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Paciente } from '../../models/paciente.model';

@Component({
  selector: 'app-tabla-pacientes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './tabla-pacientes.html',
  styleUrl: './tabla-pacientes.css'
})
export class TablaPacientesComponent {
  @Input() pacientes: Paciente[] = [];
  @Output() seleccionarPaciente = new EventEmitter<string>();

  filtroNombre = signal('');
  columnas = ['nombre', 'apellidos', 'dni', 'telefono', 'tipo'];

  get pacientesFiltrados() {
    const filtro = this.filtroNombre().toLowerCase();
    return this.pacientes.filter(p =>
      filtro === '' ||
      (p.nombre + ' ' + p.apellidos).toLowerCase().includes(filtro)
    );
  }

  verDetalle(idPaciente: string): void {
    this.seleccionarPaciente.emit(idPaciente);
  }

  trackById(_indice: number, elemento: { id: string }): string {
    return elemento.id;
  }
}

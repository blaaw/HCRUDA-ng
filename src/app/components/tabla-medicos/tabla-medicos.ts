import { Component, Input, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-tabla-medicos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, MatButtonModule, MatSelectModule],
  templateUrl: './tabla-medicos.html',
  styleUrl: './tabla-medicos.css'
})
export class TablaMedicosComponent {
  @Input() medicos: Medico[] = [];
  @Input() departamentos: Departamento[] = [];
  @Output() seleccionarMedico = new EventEmitter<string>();

  filtroNombre = signal('');
  filtroDepartamento = signal('');

  columnas = ['nombre', 'apellidos', 'dni', 'especialidad', 'departamento', 'accion'];

  get medicosFiltrados() {
    const nombreFiltro = this.filtroNombre().toLowerCase();
    const deptoFiltro = this.filtroDepartamento();

    return this.medicos.filter(m => {
      const coincideNombre = nombreFiltro === '' ||
        (m.nombre + ' ' + m.apellidos).toLowerCase().includes(nombreFiltro);
      const coincideDepto = deptoFiltro === '' || m.departamentoId === deptoFiltro;
      return coincideNombre && coincideDepto;
    });
  }

  obtenerNombreDepartamento(idDepartamento: string): string {
    const depto = this.departamentos.find(d => d.id === idDepartamento);
    return depto ? depto.nombre : '—';
  }

  verDetalle(id: string): void {
    this.seleccionarMedico.emit(id);
  }

  trackById(_indice: number, elemento: { id: string }): string {
    return elemento.id;
  }
}

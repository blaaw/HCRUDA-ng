import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Tratamiento } from '../../models/tratamiento.model';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-grafico-tratamientos-departamento',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './grafico-tratamientos-departamento.html',
  styleUrl: './grafico-tratamientos-departamento.css'
})
export class GraficoTratamientosDepartamentoComponent {
  @Input() tratamientos: Tratamiento[] = [];
  @Input() medicos: Medico[] = [];
  @Input() departamentos: Departamento[] = [];

  vista: [number, number] = [500, 350];

  get datosGrafico() {
    const datosPorDepartamento: { [key: string]: number } = {};

    this.tratamientos.forEach(tratamiento => {
      const medico = this.medicos.find(m => m.id === tratamiento.medicoId);
      if (!medico) return;

      const departamento = this.departamentos.find(d => d.id === medico.departamentoId);
      if (!departamento) return;

      const nombre = departamento.nombre;
      datosPorDepartamento[nombre] = (datosPorDepartamento[nombre] || 0) + 1;
    });

    return [{
      nombre: 'Tratamientos por Departamento',
      series: Object.entries(datosPorDepartamento).map(([nombre, valor]) => ({
        nombre,
        valor
      }))
    }];
  }

  seleccionar(evento: any): void {
    console.log('Elemento seleccionado:', evento);
  }
}

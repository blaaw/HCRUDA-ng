import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Tratamiento } from '../../models/tratamiento.model';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-grafico-tratamientos-departamento',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './grafico-tratamientos-departamento.html',
  styleUrl: './grafico-tratamientos-departamento.css'
})
export class GraficoTratamientosDepartamentoComponent implements OnInit, OnChanges {
  @Input() tratamientos: Tratamiento[] = [];
  @Input() medicos: Medico[] = [];
  @Input() departamentos: Departamento[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  tipoGrafico: any = 'pie';
  datosGrafico: any = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9c27b0'],
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  opcionesGrafico: any = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { size: 20 } } }
    }
  };

  ngOnInit(): void {
    this.actualizarDatos();
  }

  ngOnChanges(): void {
    this.actualizarDatos();
    this.chart?.chart?.update();
  }

  actualizarDatos(): void {
    const datosPorDepartamento: { [key: string]: number } = {};

    this.tratamientos.forEach(tratamiento => {
      const medico = this.medicos.find(m => m.id === tratamiento.medicoId);
      if (!medico) return;

      const departamento = this.departamentos.find(d => d.id === medico.departamentoId);
      if (!departamento) return;

      datosPorDepartamento[departamento.nombre] = (datosPorDepartamento[departamento.nombre] || 0) + 1;
    });

    const labels = Object.keys(datosPorDepartamento);
    const datos = Object.values(datosPorDepartamento);

    this.datosGrafico.labels = labels;
    this.datosGrafico.datasets = [{
      data: datos,
      backgroundColor: ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9c27b0'],
      borderColor: '#fff',
      borderWidth: 2
    }];
  }
}

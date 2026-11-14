import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import ApexCharts from 'apexcharts';
import { ApexOptions } from 'apexcharts';
import { Tratamiento } from '../../models/tratamiento.model';
import { Medico } from '../../models/medico.model';
import { Departamento } from '../../models/departamento.model';

@Component({
  selector: 'app-grafico-tratamientos-departamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grafico-tratamientos-departamento.html',
  styleUrl: './grafico-tratamientos-departamento.css'
})
export class GraficoTratamientosDepartamentoComponent implements OnInit, AfterViewInit {
  @Input() tratamientos: Tratamiento[] = [];
  @Input() medicos: Medico[] = [];
  @Input() departamentos: Departamento[] = [];

  chartOptions: ApexOptions = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#ff9800', '#2196f3', '#4caf50', '#f44336', '#9c27b0'],
    labels: [],
    dataLabels: {
      enabled: true,
      formatter: function (val: any, opts: any) {
        const label = opts.w.globals.labels[opts.seriesIndex];
        return label + ': ' + val;
      },
      style: {
        colors: ['#333'],
        fontSize: '14px',
        fontWeight: 600
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  private chart: ApexCharts | null = null;

  ngOnInit(): void {
    this.chartOptions.series = this.contarTratamientosPorDepartamento().map(d => d.valor);
    this.chartOptions.labels = this.contarTratamientosPorDepartamento().map(d => d.nombre);
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.updateSeries(this.contarTratamientosPorDepartamento().map(d => d.valor));
      this.chart.updateOptions({ labels: this.contarTratamientosPorDepartamento().map(d => d.nombre) });
    }
  }

  contarTratamientosPorDepartamento(): { nombre: string; valor: number }[] {
    const datosPorDepartamento: { [key: string]: number } = {};

    this.tratamientos.forEach(tratamiento => {
      const medico = this.medicos.find(m => m.id === tratamiento.medicoId);
      if (!medico) return;

      const departamento = this.departamentos.find(d => d.id === medico.departamentoId);
      if (!departamento) return;

      const nombre = departamento.nombre;
      datosPorDepartamento[nombre] = (datosPorDepartamento[nombre] || 0) + 1;
    });

    return Object.entries(datosPorDepartamento).map(([nombre, valor]) => ({
      nombre,
      valor
    }));
  }

  private renderChart(): void {
    const datos = this.contarTratamientosPorDepartamento();
    const options = {
      ...this.chartOptions,
      series: datos.map(d => d.valor),
      labels: datos.map(d => d.nombre)
    };
    const chart = new ApexCharts(document.querySelector('#grafico-tratamientos-departamento') as HTMLElement, options);
    chart.render();
    this.chart = chart;
  }
}

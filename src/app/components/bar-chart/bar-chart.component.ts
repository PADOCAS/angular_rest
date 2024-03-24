import {Component, OnInit} from '@angular/core';
import {MenuComponent} from "../menu/menu.component";
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [
    MenuComponent
  ],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit {
  chart: any;

  constructor() {
  }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    this.chart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Maça', 'Banana', 'Pessego', 'Laranja'],
        datasets: [
          {
            label: 'Salário dos Usuários',
            data: [467, 576, 572, 79],
            backgroundColor: 'blue'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1
      }
    });
  }
}

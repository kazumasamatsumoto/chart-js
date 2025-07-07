import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';

@Component({
    selector: 'app-utils',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="utils-container">
      <h2>Chart.js Utilities</h2>
      
      <div class="chart-section">
        <h3>Color Utilities</h3>
        <div class="controls">
          <label>
            Base Color:
            <input type="color" [(ngModel)]="colorOptions.baseColor" (change)="updateColorChart()">
          </label>
          <label>
            Opacity:
            <input type="range" min="0" max="1" step="0.1" [(ngModel)]="colorOptions.opacity" (change)="updateColorChart()">
            <span>{{ colorOptions.opacity }}</span>
          </label>
        </div>
        <div class="chart-wrapper">
          <canvas #colorChart></canvas>
        </div>
      </div>

      <div class="chart-section">
        <h3>Data Utilities</h3>
        <div class="controls">
          <label>
            Data Points:
            <input type="number" min="3" max="12" [(ngModel)]="dataOptions.pointCount" (change)="updateDataChart()">
          </label>
          <label>
            Min Value:
            <input type="number" [(ngModel)]="dataOptions.minValue" (change)="updateDataChart()">
          </label>
          <label>
            Max Value:
            <input type="number" [(ngModel)]="dataOptions.maxValue" (change)="updateDataChart()">
          </label>
        </div>
        <div class="chart-wrapper">
          <canvas #dataChart></canvas>
        </div>
      </div>

      <div class="chart-section">
        <h3>Helper Functions</h3>
        <div class="controls">
          <button (click)="generateRandomData()">Generate Random Data</button>
          <button (click)="exportChartData()">Export Chart Data</button>
          <button (click)="resetAllCharts()">Reset All Charts</button>
        </div>
        <div class="utility-output">
          <h4>Generated Data:</h4>
          <pre>{{ generatedData | json }}</pre>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .utils-container {
      padding: 20px;
    }

    .chart-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .controls {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .controls label {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .controls input {
      padding: 5px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .controls button {
      padding: 10px 15px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .controls button:hover {
      background-color: #0056b3;
    }

    .chart-wrapper {
      width: 100%;
      height: 400px;
      margin-bottom: 20px;
    }

    .utility-output {
      margin-top: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
    }

    .utility-output pre {
      background-color: white;
      padding: 10px;
      border-radius: 4px;
      overflow-x: auto;
    }
  `]
})
export class UtilsComponent implements OnInit, OnDestroy {
    colorChart: Chart | null = null;
    dataChart: Chart | null = null;

    colorOptions = {
        baseColor: '#3498db',
        opacity: 0.7
    };

    dataOptions = {
        pointCount: 6,
        minValue: 0,
        maxValue: 100
    };

    generatedData: any = {};

    ngOnInit() {
        this.initializeCharts();
        this.generateRandomData();
    }

    ngOnDestroy() {
        if (this.colorChart) {
            this.colorChart.destroy();
        }
        if (this.dataChart) {
            this.dataChart.destroy();
        }
    }

    initializeCharts() {
        setTimeout(() => {
            this.createColorChart();
            this.createDataChart();
        }, 100);
    }

    createColorChart() {
        const canvas = document.querySelector('canvas[ng-reflect-name="colorChart"]') as HTMLCanvasElement;
        if (!canvas) return;

        this.colorChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ['Red', 'Green', 'Blue', 'Yellow', 'Purple', 'Orange'],
                datasets: [{
                    label: 'Color Demo',
                    data: [65, 59, 80, 81, 56, 55],
                    backgroundColor: this.generateColors(6)
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Color Utility Demo'
                    }
                }
            }
        });
    }

    createDataChart() {
        const canvas = document.querySelector('canvas[ng-reflect-name="dataChart"]') as HTMLCanvasElement;
        if (!canvas) return;

        this.dataChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: this.generateLabels(this.dataOptions.pointCount),
                datasets: [{
                    label: 'Generated Data',
                    data: this.generateRandomValues(this.dataOptions.pointCount, this.dataOptions.minValue, this.dataOptions.maxValue),
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Data Utility Demo'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    generateColors(count: number): string[] {
        const colors = [];
        for (let i = 0; i < count; i++) {
            const hue = (i * 360) / count;
            colors.push(this.hslToRgba(hue, 70, 50, this.colorOptions.opacity));
        }
        return colors;
    }

    hslToRgba(h: number, s: number, l: number, a: number): string {
        const hDecimal = h / 360;
        const sDecimal = s / 100;
        const lDecimal = l / 100;

        const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
        const x = c * (1 - Math.abs(((hDecimal * 6) % 2) - 1));
        const m = lDecimal - c / 2;

        let r, g, b;
        if (hDecimal < 1 / 6) {
            r = c; g = x; b = 0;
        } else if (hDecimal < 2 / 6) {
            r = x; g = c; b = 0;
        } else if (hDecimal < 3 / 6) {
            r = 0; g = c; b = x;
        } else if (hDecimal < 4 / 6) {
            r = 0; g = x; b = c;
        } else if (hDecimal < 5 / 6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }

        return `rgba(${Math.round((r + m) * 255)}, ${Math.round((g + m) * 255)}, ${Math.round((b + m) * 255)}, ${a})`;
    }

    generateLabels(count: number): string[] {
        const labels = [];
        for (let i = 1; i <= count; i++) {
            labels.push(`Point ${i}`);
        }
        return labels;
    }

    generateRandomValues(count: number, min: number, max: number): number[] {
        const values = [];
        for (let i = 0; i < count; i++) {
            values.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        return values;
    }

    updateColorChart() {
        if (this.colorChart) {
            this.colorChart.data.datasets[0].backgroundColor = this.generateColors(6);
            this.colorChart.update();
        }
    }

    updateDataChart() {
        if (this.dataChart) {
            this.dataChart.data.labels = this.generateLabels(this.dataOptions.pointCount);
            this.dataChart.data.datasets[0].data = this.generateRandomValues(
                this.dataOptions.pointCount,
                this.dataOptions.minValue,
                this.dataOptions.maxValue
            );
            this.dataChart.update();
        }
    }

    generateRandomData() {
        this.generatedData = {
            labels: this.generateLabels(this.dataOptions.pointCount),
            values: this.generateRandomValues(this.dataOptions.pointCount, this.dataOptions.minValue, this.dataOptions.maxValue),
            colors: this.generateColors(this.dataOptions.pointCount),
            timestamp: new Date().toISOString()
        };
    }

    exportChartData() {
        const dataStr = JSON.stringify(this.generatedData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'chart-data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    resetAllCharts() {
        this.colorOptions = {
            baseColor: '#3498db',
            opacity: 0.7
        };

        this.dataOptions = {
            pointCount: 6,
            minValue: 0,
            maxValue: 100
        };

        this.updateColorChart();
        this.updateDataChart();
        this.generateRandomData();
    }
} 
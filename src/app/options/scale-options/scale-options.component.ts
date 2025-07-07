import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-scale-options',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="scale-options-container">
      <h1 class="page-title">Scale Options</h1>
      <p class="page-description">
        スケールの詳細オプションを設定できます。グリッドライン、ティック、境界線などをカスタマイズできます。
      </p>

      <!-- Grid Options Chart -->
      <div class="chart-container">
        <h2 class="chart-title">グリッドライン設定</h2>
        <p class="chart-description">
          グリッドラインの表示、色、幅、スタイルを設定できます。
        </p>
        <canvas id="gridOptionsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Grid Options -->
      <div class="control-panel">
        <h3>グリッドライン設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>グリッドライン表示</label>
            <select [(ngModel)]="gridOptions.display" (change)="updateGridOptionsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>グリッドライン色</label>
            <input 
              type="color" 
              [(ngModel)]="gridOptions.color" 
              (change)="updateGridOptionsChart()"
            >
          </div>
          <div class="control-group">
            <label>グリッドライン幅</label>
            <input 
              type="number" 
              [(ngModel)]="gridOptions.lineWidth" 
              (change)="updateGridOptionsChart()"
              min="1"
              max="10"
            >
          </div>
        </div>
      </div>

      <!-- Tick Options Chart -->
      <div class="chart-container">
        <h2 class="chart-title">ティック設定</h2>
        <p class="chart-description">
          軸のティック（目盛り）の表示、色、サイズを設定できます。
        </p>
        <canvas id="tickOptionsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Tick Options -->
      <div class="control-panel">
        <h3>ティック設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>ティック表示</label>
            <select [(ngModel)]="tickOptions.display" (change)="updateTickOptionsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>ティック色</label>
            <input 
              type="color" 
              [(ngModel)]="tickOptions.color" 
              (change)="updateTickOptionsChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="tickOptions.fontSize" 
              (change)="updateTickOptionsChart()"
              min="8"
              max="20"
            >
          </div>
        </div>
      </div>

      <!-- Border Options Chart -->
      <div class="chart-container">
        <h2 class="chart-title">境界線設定</h2>
        <p class="chart-description">
          軸の境界線の表示、色、幅を設定できます。
        </p>
        <canvas id="borderOptionsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Border Options -->
      <div class="control-panel">
        <h3>境界線設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>境界線表示</label>
            <select [(ngModel)]="borderOptions.display" (change)="updateBorderOptionsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>境界線色</label>
            <input 
              type="color" 
              [(ngModel)]="borderOptions.color" 
              (change)="updateBorderOptionsChart()"
            >
          </div>
          <div class="control-group">
            <label>境界線幅</label>
            <input 
              type="number" 
              [(ngModel)]="borderOptions.width" 
              (change)="updateBorderOptionsChart()"
              min="1"
              max="10"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .scale-options-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .page-title {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #2c3e50;
      text-align: center;
    }
    
    .page-description {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 2rem;
      font-size: 1.1rem;
    }
    
    input[type="color"] {
      width: 50px;
      height: 40px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ScaleOptionsComponent implements OnInit, OnDestroy {
    private gridOptionsChart: Chart | null = null;
    private tickOptionsChart: Chart | null = null;
    private borderOptionsChart: Chart | null = null;

    private baseData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: 'サンプルデータ',
            data: [65, 59, 80, 81, 56, 75],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // Grid Options
    gridOptions = {
        display: true,
        color: '#e0e0e0',
        lineWidth: 1
    };

    // Tick Options
    tickOptions = {
        display: true,
        color: '#666666',
        fontSize: 12
    };

    // Border Options
    borderOptions = {
        display: true,
        color: '#000000',
        width: 2
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createGridOptionsChart();
            this.createTickOptionsChart();
            this.createBorderOptionsChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.gridOptionsChart) {
            this.gridOptionsChart.destroy();
        }
        if (this.tickOptionsChart) {
            this.tickOptionsChart.destroy();
        }
        if (this.borderOptionsChart) {
            this.borderOptionsChart.destroy();
        }
    }

    private createGridOptionsChart() {
        const ctx = document.getElementById('gridOptionsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.gridOptionsChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'グリッドライン設定例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: this.gridOptions.display,
                            color: this.gridOptions.color,
                            lineWidth: this.gridOptions.lineWidth
                        }
                    },
                    y: {
                        grid: {
                            display: this.gridOptions.display,
                            color: this.gridOptions.color,
                            lineWidth: this.gridOptions.lineWidth
                        }
                    }
                }
            }
        });
    }

    private createTickOptionsChart() {
        const ctx = document.getElementById('tickOptionsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.tickOptionsChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'ティック設定例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            display: this.tickOptions.display,
                            color: this.tickOptions.color,
                            font: {
                                size: this.tickOptions.fontSize
                            }
                        }
                    },
                    y: {
                        ticks: {
                            display: this.tickOptions.display,
                            color: this.tickOptions.color,
                            font: {
                                size: this.tickOptions.fontSize
                            }
                        }
                    }
                }
            }
        });
    }

    private createBorderOptionsChart() {
        const ctx = document.getElementById('borderOptionsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.borderOptionsChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '境界線設定例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        border: {
                            display: this.borderOptions.display,
                            color: this.borderOptions.color,
                            width: this.borderOptions.width
                        }
                    },
                    y: {
                        border: {
                            display: this.borderOptions.display,
                            color: this.borderOptions.color,
                            width: this.borderOptions.width
                        }
                    }
                }
            }
        });
    }

    updateGridOptionsChart() {
        if (this.gridOptionsChart) {
            if (this.gridOptionsChart.options.scales && this.gridOptionsChart.options.scales['x'] && this.gridOptionsChart.options.scales['x'].grid) {
                this.gridOptionsChart.options.scales['x'].grid.display = this.gridOptions.display;
                this.gridOptionsChart.options.scales['x'].grid.color = this.gridOptions.color;
                this.gridOptionsChart.options.scales['x'].grid.lineWidth = this.gridOptions.lineWidth;
            }
            if (this.gridOptionsChart.options.scales && this.gridOptionsChart.options.scales['y'] && this.gridOptionsChart.options.scales['y'].grid) {
                this.gridOptionsChart.options.scales['y'].grid.display = this.gridOptions.display;
                this.gridOptionsChart.options.scales['y'].grid.color = this.gridOptions.color;
                this.gridOptionsChart.options.scales['y'].grid.lineWidth = this.gridOptions.lineWidth;
            }
            this.gridOptionsChart.update();
        }
    }

    updateTickOptionsChart() {
        if (this.tickOptionsChart) {
            if (this.tickOptionsChart.options.scales && this.tickOptionsChart.options.scales['x'] && this.tickOptionsChart.options.scales['x'].ticks) {
                this.tickOptionsChart.options.scales['x'].ticks.display = this.tickOptions.display;
                this.tickOptionsChart.options.scales['x'].ticks.color = this.tickOptions.color;
                if (this.tickOptionsChart.options.scales['x'].ticks.font) {
                    (this.tickOptionsChart.options.scales['x'].ticks.font as any).size = this.tickOptions.fontSize;
                }
            }
            if (this.tickOptionsChart.options.scales && this.tickOptionsChart.options.scales['y'] && this.tickOptionsChart.options.scales['y'].ticks) {
                this.tickOptionsChart.options.scales['y'].ticks.display = this.tickOptions.display;
                this.tickOptionsChart.options.scales['y'].ticks.color = this.tickOptions.color;
                if (this.tickOptionsChart.options.scales['y'].ticks.font) {
                    (this.tickOptionsChart.options.scales['y'].ticks.font as any).size = this.tickOptions.fontSize;
                }
            }
            this.tickOptionsChart.update();
        }
    }

    updateBorderOptionsChart() {
        if (this.borderOptionsChart) {
            if (this.borderOptionsChart.options.scales && this.borderOptionsChart.options.scales['x']) {
                const xScale = this.borderOptionsChart.options.scales['x'] as any;
                if (xScale.border) {
                    xScale.border.display = this.borderOptions.display;
                    xScale.border.color = this.borderOptions.color;
                    xScale.border.width = this.borderOptions.width;
                }
            }
            if (this.borderOptionsChart.options.scales && this.borderOptionsChart.options.scales['y']) {
                const yScale = this.borderOptionsChart.options.scales['y'] as any;
                if (yScale.border) {
                    yScale.border.display = this.borderOptions.display;
                    yScale.border.color = this.borderOptions.color;
                    yScale.border.width = this.borderOptions.width;
                }
            }
            this.borderOptionsChart.update();
        }
    }
} 
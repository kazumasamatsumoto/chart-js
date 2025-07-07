import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-scales',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="scales-container">
      <h1 class="page-title">Scales</h1>
      <p class="page-description">
        チャートの軸のスケール設定を様々なパターンで表示します。線形、対数、カスタムスケールなど。
      </p>

      <!-- Linear Scale Chart -->
      <div class="chart-container">
        <h2 class="chart-title">線形スケール</h2>
        <p class="chart-description">
          基本的な線形スケールです。等間隔でデータを表示します。
        </p>
        <canvas id="linearScaleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Linear Scale -->
      <div class="control-panel">
        <h3>線形スケール - 設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>最小値</label>
            <input 
              type="number" 
              [(ngModel)]="linearScaleOptions.min" 
              (change)="updateLinearScaleChart()"
            >
          </div>
          <div class="control-group">
            <label>最大値</label>
            <input 
              type="number" 
              [(ngModel)]="linearScaleOptions.max" 
              (change)="updateLinearScaleChart()"
            >
          </div>
          <div class="control-group">
            <label>ステップサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="linearScaleOptions.stepSize" 
              (change)="updateLinearScaleChart()"
              min="1"
              max="50"
            >
          </div>
        </div>
      </div>

      <!-- Logarithmic Scale Chart -->
      <div class="chart-container">
        <h2 class="chart-title">対数スケール</h2>
        <p class="chart-description">
          対数スケールでデータを表示します。幅広い範囲のデータに適しています。
        </p>
        <canvas id="logScaleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Logarithmic Scale -->
      <div class="control-panel">
        <h3>対数スケール - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of logScaleData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateLogScaleChart()"
              min="1"
              max="10000"
            >
          </div>
        </div>
      </div>

      <!-- Multiple Axes Chart -->
      <div class="chart-container">
        <h2 class="chart-title">複数軸スケール</h2>
        <p class="chart-description">
          左軸と右軸に異なるスケールを持つチャートです。
        </p>
        <canvas id="multipleAxesChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Multiple Axes -->
      <div class="control-panel">
        <h3>複数軸スケール - データ設定</h3>
        <div class="multiple-axes-controls">
          <div class="dataset-control" *ngFor="let dataset of multipleAxesData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ multipleAxesLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updateMultipleAxesChart()"
                  min="0"
                  max="1000"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .scales-container {
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
    
    .multiple-axes-controls {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .dataset-control {
      border: 1px solid #ecf0f1;
      border-radius: 8px;
      padding: 1rem;
      background-color: #f8f9fa;
    }
    
    .dataset-control h4 {
      margin-bottom: 0.5rem;
      color: #2c3e50;
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
      
      .multiple-axes-controls {
        gap: 1rem;
      }
    }
  `]
})
export class ScalesComponent implements OnInit, OnDestroy {
    private linearScaleChart: Chart | null = null;
    private logScaleChart: Chart | null = null;
    private multipleAxesChart: Chart | null = null;

    // Linear Scale Options
    linearScaleOptions = {
        min: 0,
        max: 100,
        stepSize: 10
    };

    // Logarithmic Scale Data
    logScaleData = [
        { label: '1倍', value: 1 },
        { label: '10倍', value: 10 },
        { label: '100倍', value: 100 },
        { label: '1000倍', value: 1000 },
        { label: '10000倍', value: 10000 }
    ];

    // Multiple Axes Data
    multipleAxesLabels = ['1月', '2月', '3月', '4月', '5月', '6月'];
    multipleAxesData = [
        {
            label: '売上（百万円）',
            data: [120, 150, 180, 200, 170, 220],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            yAxisID: 'y'
        },
        {
            label: '利益率（%）',
            data: [15, 18, 22, 25, 20, 28],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            yAxisID: 'y1'
        }
    ];

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createLinearScaleChart();
            this.createLogScaleChart();
            this.createMultipleAxesChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.linearScaleChart) {
            this.linearScaleChart.destroy();
        }
        if (this.logScaleChart) {
            this.logScaleChart.destroy();
        }
        if (this.multipleAxesChart) {
            this.multipleAxesChart.destroy();
        }
    }

    private createLinearScaleChart() {
        const ctx = document.getElementById('linearScaleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.linearScaleChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['A', 'B', 'C', 'D', 'E', 'F'],
                datasets: [{
                    label: 'データ値',
                    data: [10, 30, 25, 60, 45, 80],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '線形スケール例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        min: this.linearScaleOptions.min,
                        max: this.linearScaleOptions.max,
                        ticks: {
                            stepSize: this.linearScaleOptions.stepSize
                        },
                        title: {
                            display: true,
                            text: '値'
                        }
                    }
                }
            }
        });
    }

    private createLogScaleChart() {
        const ctx = document.getElementById('logScaleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.logScaleChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.logScaleData.map(item => item.label),
                datasets: [{
                    label: '指数的データ',
                    data: this.logScaleData.map(item => item.value),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '対数スケール例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: '値（対数スケール）'
                        }
                    }
                }
            }
        });
    }

    private createMultipleAxesChart() {
        const ctx = document.getElementById('multipleAxesChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.multipleAxesChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.multipleAxesLabels,
                datasets: this.multipleAxesData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    borderColor: dataset.borderColor,
                    backgroundColor: dataset.backgroundColor,
                    yAxisID: dataset.yAxisID,
                    tension: 0.4,
                    fill: false
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '複数軸スケール例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '月'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: '売上（百万円）'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: '利益率（%）'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }

    updateLinearScaleChart() {
        if (this.linearScaleChart) {
            if (this.linearScaleChart.options.scales && this.linearScaleChart.options.scales['y']) {
                const yScale = this.linearScaleChart.options.scales['y'] as any;
                yScale.min = this.linearScaleOptions.min;
                yScale.max = this.linearScaleOptions.max;
                if (yScale.ticks) {
                    yScale.ticks.stepSize = this.linearScaleOptions.stepSize;
                }
            }
            this.linearScaleChart.update();
        }
    }

    updateLogScaleChart() {
        if (this.logScaleChart) {
            this.logScaleChart.data.datasets[0].data = this.logScaleData.map(item => item.value);
            this.logScaleChart.update();
        }
    }

    updateMultipleAxesChart() {
        if (this.multipleAxesChart) {
            this.multipleAxesChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.multipleAxesData[index].data];
            });
            this.multipleAxesChart.update();
        }
    }
} 
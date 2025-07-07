import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-line-charts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="line-charts-container">
      <h1 class="page-title">Line Charts</h1>
      <p class="page-description">
        様々なラインチャートの例を表示します。時系列データの可視化に適しています。
      </p>

      <!-- Basic Line Chart -->
      <div class="chart-container">
        <h2 class="chart-title">基本的なラインチャート</h2>
        <p class="chart-description">
          シンプルなラインチャートです。時系列データの推移を表示します。
        </p>
        <canvas id="basicLineChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Basic Line Chart -->
      <div class="control-panel">
        <h3>基本的なラインチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of basicLineData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateBasicLineChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>

      <!-- Multi-Series Line Chart -->
      <div class="chart-container">
        <h2 class="chart-title">複数系列ラインチャート</h2>
        <p class="chart-description">
          複数のデータセットを同時に表示するラインチャートです。比較分析に有効です。
        </p>
        <canvas id="multiLineChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Multi-Series Line Chart -->
      <div class="control-panel">
        <h3>複数系列ラインチャート - データ設定</h3>
        <div class="multi-series-controls">
          <div class="dataset-control" *ngFor="let dataset of multiLineData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ multiLineLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updateMultiLineChart()"
                  min="0"
                  max="100"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stepped Line Chart -->
      <div class="chart-container">
        <h2 class="chart-title">段階的ラインチャート</h2>
        <p class="chart-description">
          階段状に表示されるラインチャートです。段階的な変化を表現できます。
        </p>
        <canvas id="steppedLineChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Stepped Line Chart -->
      <div class="control-panel">
        <h3>段階的ラインチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of steppedLineData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateSteppedLineChart()"
              min="0"
              max="50"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .line-charts-container {
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
    
    .multi-series-controls {
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
      
      .multi-series-controls {
        gap: 1rem;
      }
    }
  `]
})
export class LineChartsComponent implements OnInit, OnDestroy {
    private basicLineChart: Chart | null = null;
    private multiLineChart: Chart | null = null;
    private steppedLineChart: Chart | null = null;

    // Basic Line Chart Data
    basicLineData = [
        { label: '1月', value: 12 },
        { label: '2月', value: 19 },
        { label: '3月', value: 13 },
        { label: '4月', value: 25 },
        { label: '5月', value: 22 },
        { label: '6月', value: 30 },
        { label: '7月', value: 28 }
    ];

    // Multi-Series Line Chart Data
    multiLineLabels = ['週1', '週2', '週3', '週4', '週5', '週6'];
    multiLineData = [
        {
            label: 'ウェブサイト',
            data: [35, 42, 38, 55, 48, 62],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.4
        },
        {
            label: 'モバイルアプリ',
            data: [28, 35, 45, 42, 58, 55],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.4
        },
        {
            label: 'デスクトップ',
            data: [15, 22, 18, 28, 25, 32],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            tension: 0.4
        }
    ];

    // Stepped Line Chart Data
    steppedLineData = [
        { label: 'Q1', value: 10 },
        { label: 'Q2', value: 15 },
        { label: 'Q3', value: 25 },
        { label: 'Q4', value: 30 },
        { label: 'Q5', value: 35 },
        { label: 'Q6', value: 40 }
    ];

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createBasicLineChart();
            this.createMultiLineChart();
            this.createSteppedLineChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.basicLineChart) {
            this.basicLineChart.destroy();
        }
        if (this.multiLineChart) {
            this.multiLineChart.destroy();
        }
        if (this.steppedLineChart) {
            this.steppedLineChart.destroy();
        }
    }

    private createBasicLineChart() {
        const ctx = document.getElementById('basicLineChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.basicLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.basicLineData.map(item => item.label),
                datasets: [{
                    label: '気温（℃）',
                    data: this.basicLineData.map(item => item.value),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: 'rgba(75, 192, 192, 1)',
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '月別平均気温'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '月'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '気温（℃）'
                        }
                    }
                }
            }
        });
    }

    private createMultiLineChart() {
        const ctx = document.getElementById('multiLineChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.multiLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.multiLineLabels,
                datasets: this.multiLineData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    borderColor: dataset.borderColor,
                    backgroundColor: dataset.backgroundColor,
                    tension: dataset.tension,
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'プラットフォーム別アクセス数（週次）'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '週'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'アクセス数（千回）'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    private createSteppedLineChart() {
        const ctx = document.getElementById('steppedLineChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.steppedLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.steppedLineData.map(item => item.label),
                datasets: [{
                    label: '売上目標（百万円）',
                    data: this.steppedLineData.map(item => item.value),
                    borderColor: 'rgba(255, 206, 86, 1)',
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    stepped: true,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointBackgroundColor: 'rgba(255, 206, 86, 1)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '四半期別売上目標'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: '四半期'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: '売上目標（百万円）'
                        }
                    }
                }
            }
        });
    }

    updateBasicLineChart() {
        if (this.basicLineChart) {
            this.basicLineChart.data.datasets[0].data = this.basicLineData.map(item => item.value);
            this.basicLineChart.update();
        }
    }

    updateMultiLineChart() {
        if (this.multiLineChart) {
            this.multiLineChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.multiLineData[index].data];
            });
            this.multiLineChart.update();
        }
    }

    updateSteppedLineChart() {
        if (this.steppedLineChart) {
            this.steppedLineChart.data.datasets[0].data = this.steppedLineData.map(item => item.value);
            this.steppedLineChart.update();
        }
    }
} 
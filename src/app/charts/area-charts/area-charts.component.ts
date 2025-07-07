import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-area-charts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="area-charts-container">
      <h1 class="page-title">Area Charts</h1>
      <p class="page-description">
        エリアチャートは線の下の領域を塗りつぶしたチャートです。データの全体的な傾向を強調できます。
      </p>

      <!-- Basic Area Chart -->
      <div class="chart-container">
        <h2 class="chart-title">基本的なエリアチャート</h2>
        <p class="chart-description">
          シンプルなエリアチャートです。線の下の領域を塗りつぶして表示します。
        </p>
        <canvas id="basicAreaChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Basic Area Chart -->
      <div class="control-panel">
        <h3>基本的なエリアチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of basicAreaData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateBasicAreaChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>

      <!-- Stacked Area Chart -->
      <div class="chart-container">
        <h2 class="chart-title">積み上げエリアチャート</h2>
        <p class="chart-description">
          複数のデータセットを積み上げて表示するエリアチャートです。
        </p>
        <canvas id="stackedAreaChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Stacked Area Chart -->
      <div class="control-panel">
        <h3>積み上げエリアチャート - データ設定</h3>
        <div class="stacked-controls">
          <div class="dataset-control" *ngFor="let dataset of stackedAreaData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ stackedAreaLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updateStackedAreaChart()"
                  min="0"
                  max="30"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Percentage Area Chart -->
      <div class="chart-container">
        <h2 class="chart-title">パーセンタイルエリアチャート</h2>
        <p class="chart-description">
          各データセットの比率を100%として表示するエリアチャートです。
        </p>
        <canvas id="percentageAreaChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Percentage Area Chart -->
      <div class="control-panel">
        <h3>パーセンタイルエリアチャート - データ設定</h3>
        <div class="percentage-controls">
          <div class="dataset-control" *ngFor="let dataset of percentageAreaData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ percentageAreaLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updatePercentageAreaChart()"
                  min="0"
                  max="50"
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .area-charts-container {
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
    
    .stacked-controls,
    .percentage-controls {
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
      
      .stacked-controls,
      .percentage-controls {
        gap: 1rem;
      }
    }
  `]
})
export class AreaChartsComponent implements OnInit, OnDestroy {
    private basicAreaChart: Chart | null = null;
    private stackedAreaChart: Chart | null = null;
    private percentageAreaChart: Chart | null = null;

    // Basic Area Chart Data
    basicAreaData = [
        { label: '1月', value: 30 },
        { label: '2月', value: 45 },
        { label: '3月', value: 35 },
        { label: '4月', value: 50 },
        { label: '5月', value: 60 },
        { label: '6月', value: 70 },
        { label: '7月', value: 65 }
    ];

    // Stacked Area Chart Data
    stackedAreaLabels = ['1月', '2月', '3月', '4月', '5月', '6月'];
    stackedAreaData = [
        {
            label: '製品A',
            data: [12, 19, 14, 22, 18, 25],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2
        },
        {
            label: '製品B',
            data: [8, 12, 10, 15, 14, 18],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2
        },
        {
            label: '製品C',
            data: [6, 8, 12, 10, 16, 15],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2
        }
    ];

    // Percentage Area Chart Data
    percentageAreaLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
    percentageAreaData = [
        {
            label: 'デスクトップ',
            data: [30, 25, 35, 28],
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)'
        },
        {
            label: 'モバイル',
            data: [25, 30, 20, 32],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)'
        },
        {
            label: 'タブレット',
            data: [15, 20, 18, 22],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)'
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
            this.createBasicAreaChart();
            this.createStackedAreaChart();
            this.createPercentageAreaChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.basicAreaChart) {
            this.basicAreaChart.destroy();
        }
        if (this.stackedAreaChart) {
            this.stackedAreaChart.destroy();
        }
        if (this.percentageAreaChart) {
            this.percentageAreaChart.destroy();
        }
    }

    private createBasicAreaChart() {
        const ctx = document.getElementById('basicAreaChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.basicAreaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.basicAreaData.map(item => item.label),
                datasets: [{
                    label: 'ユーザー数（千人）',
                    data: this.basicAreaData.map(item => item.value),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '月別ユーザー数推移'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ユーザー数（千人）'
                        }
                    }
                }
            }
        });
    }

    private createStackedAreaChart() {
        const ctx = document.getElementById('stackedAreaChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.stackedAreaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.stackedAreaLabels,
                datasets: this.stackedAreaData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    backgroundColor: dataset.backgroundColor,
                    borderColor: dataset.borderColor,
                    borderWidth: dataset.borderWidth,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '月別製品売上推移'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: '月'
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '売上（百万円）'
                        }
                    }
                }
            }
        });
    }

    private createPercentageAreaChart() {
        const ctx = document.getElementById('percentageAreaChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.percentageAreaChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.percentageAreaLabels,
                datasets: this.percentageAreaData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    backgroundColor: dataset.backgroundColor,
                    borderColor: dataset.borderColor,
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 5
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '四半期別デバイス利用率'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: '四半期'
                        }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: '利用率 (%)'
                        }
                    }
                }
            }
        });
    }

    updateBasicAreaChart() {
        if (this.basicAreaChart) {
            this.basicAreaChart.data.datasets[0].data = this.basicAreaData.map(item => item.value);
            this.basicAreaChart.update();
        }
    }

    updateStackedAreaChart() {
        if (this.stackedAreaChart) {
            this.stackedAreaChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.stackedAreaData[index].data];
            });
            this.stackedAreaChart.update();
        }
    }

    updatePercentageAreaChart() {
        if (this.percentageAreaChart) {
            this.percentageAreaChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.percentageAreaData[index].data];
            });
            this.percentageAreaChart.update();
        }
    }
} 
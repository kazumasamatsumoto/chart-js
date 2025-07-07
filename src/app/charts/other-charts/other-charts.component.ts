import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-other-charts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="other-charts-container">
      <h1 class="page-title">Other Charts</h1>
      <p class="page-description">
        Pie、Doughnut、Radar、Polar Area チャートなど、様々な種類のチャートを表示します。
      </p>

      <!-- Pie Chart -->
      <div class="chart-container">
        <h2 class="chart-title">円グラフ (Pie Chart)</h2>
        <p class="chart-description">
          データの割合を円形で表示します。全体に対する各項目の比率を視覚的に表現できます。
        </p>
        <div class="chart-wrapper">
          <canvas id="pieChart" width="400" height="400"></canvas>
        </div>
      </div>

      <!-- Control Panel for Pie Chart -->
      <div class="control-panel">
        <h3>円グラフ - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of pieData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updatePieChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>

      <!-- Doughnut Chart -->
      <div class="chart-container">
        <h2 class="chart-title">ドーナツチャート (Doughnut Chart)</h2>
        <p class="chart-description">
          中央に空洞のある円グラフです。追加情報を中央に表示できます。
        </p>
        <div class="chart-wrapper">
          <canvas id="doughnutChart" width="400" height="400"></canvas>
        </div>
      </div>

      <!-- Control Panel for Doughnut Chart -->
      <div class="control-panel">
        <h3>ドーナツチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of doughnutData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateDoughnutChart()"
              min="0"
              max="50"
            >
          </div>
        </div>
      </div>

      <!-- Radar Chart -->
      <div class="chart-container">
        <h2 class="chart-title">レーダーチャート (Radar Chart)</h2>
        <p class="chart-description">
          複数の項目を多角形で表示します。能力やスキルの比較に適しています。
        </p>
        <div class="chart-wrapper">
          <canvas id="radarChart" width="400" height="400"></canvas>
        </div>
      </div>

      <!-- Control Panel for Radar Chart -->
      <div class="control-panel">
        <h3>レーダーチャート - データ設定</h3>
        <div class="radar-controls">
          <div class="dataset-control" *ngFor="let dataset of radarData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ radarLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updateRadarChart()"
                  min="0"
                  max="10"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Polar Area Chart -->
      <div class="chart-container">
        <h2 class="chart-title">極座標エリアチャート (Polar Area Chart)</h2>
        <p class="chart-description">
          極座標系でデータを表示します。各セクターの面積でデータの大きさを表現します。
        </p>
        <div class="chart-wrapper">
          <canvas id="polarAreaChart" width="400" height="400"></canvas>
        </div>
      </div>

      <!-- Control Panel for Polar Area Chart -->
      <div class="control-panel">
        <h3>極座標エリアチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of polarAreaData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updatePolarAreaChart()"
              min="0"
              max="30"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .other-charts-container {
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
    
    .chart-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .radar-controls {
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
      
      .radar-controls {
        gap: 1rem;
      }
      
      .chart-wrapper {
        max-width: 100%;
      }
    }
  `]
})
export class OtherChartsComponent implements OnInit, OnDestroy {
    private pieChart: Chart | null = null;
    private doughnutChart: Chart | null = null;
    private radarChart: Chart | null = null;
    private polarAreaChart: Chart | null = null;

    // Pie Chart Data
    pieData = [
        { label: 'Chrome', value: 45 },
        { label: 'Firefox', value: 25 },
        { label: 'Safari', value: 20 },
        { label: 'Edge', value: 8 },
        { label: 'その他', value: 2 }
    ];

    // Doughnut Chart Data
    doughnutData = [
        { label: 'モバイル', value: 35 },
        { label: 'デスクトップ', value: 40 },
        { label: 'タブレット', value: 20 },
        { label: 'その他', value: 5 }
    ];

    // Radar Chart Data
    radarLabels = ['スピード', '信頼性', '快適性', '燃費', '価格', 'デザイン'];
    radarData = [
        {
            label: '車種A',
            data: [8, 7, 9, 6, 5, 8],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            pointBackgroundColor: 'rgba(255, 99, 132, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
        },
        {
            label: '車種B',
            data: [6, 8, 7, 8, 7, 6],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
        }
    ];

    // Polar Area Chart Data
    polarAreaData = [
        { label: 'レッド', value: 11 },
        { label: 'グリーン', value: 16 },
        { label: 'イエロー', value: 7 },
        { label: 'グレー', value: 9 },
        { label: 'ブルー', value: 14 }
    ];

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createPieChart();
            this.createDoughnutChart();
            this.createRadarChart();
            this.createPolarAreaChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.pieChart) {
            this.pieChart.destroy();
        }
        if (this.doughnutChart) {
            this.doughnutChart.destroy();
        }
        if (this.radarChart) {
            this.radarChart.destroy();
        }
        if (this.polarAreaChart) {
            this.polarAreaChart.destroy();
        }
    }

    private createPieChart() {
        const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: this.pieData.map(item => item.label),
                datasets: [{
                    data: this.pieData.map(item => item.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'ブラウザ市場シェア (%)'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    private createDoughnutChart() {
        const ctx = document.getElementById('doughnutChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.doughnutData.map(item => item.label),
                datasets: [{
                    data: this.doughnutData.map(item => item.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'デバイス別アクセス数 (%)'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                cutout: '50%'
            }
        });
    }

    private createRadarChart() {
        const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: this.radarLabels,
                datasets: this.radarData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    borderColor: dataset.borderColor,
                    backgroundColor: dataset.backgroundColor,
                    pointBackgroundColor: dataset.pointBackgroundColor,
                    pointBorderColor: dataset.pointBorderColor,
                    pointHoverBackgroundColor: dataset.pointHoverBackgroundColor,
                    pointHoverBorderColor: dataset.pointHoverBorderColor
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '車種別性能比較'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 2
                        }
                    }
                }
            }
        });
    }

    private createPolarAreaChart() {
        const ctx = document.getElementById('polarAreaChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.polarAreaChart = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: this.polarAreaData.map(item => item.label),
                datasets: [{
                    data: this.polarAreaData.map(item => item.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'カテゴリ別データ分布'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 25
                    }
                }
            }
        });
    }

    updatePieChart() {
        if (this.pieChart) {
            this.pieChart.data.datasets[0].data = this.pieData.map(item => item.value);
            this.pieChart.update();
        }
    }

    updateDoughnutChart() {
        if (this.doughnutChart) {
            this.doughnutChart.data.datasets[0].data = this.doughnutData.map(item => item.value);
            this.doughnutChart.update();
        }
    }

    updateRadarChart() {
        if (this.radarChart) {
            this.radarChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.radarData[index].data];
            });
            this.radarChart.update();
        }
    }

    updatePolarAreaChart() {
        if (this.polarAreaChart) {
            this.polarAreaChart.data.datasets[0].data = this.polarAreaData.map(item => item.value);
            this.polarAreaChart.update();
        }
    }
} 
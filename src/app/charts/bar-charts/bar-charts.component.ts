import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-bar-charts',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="bar-charts-container">
      <h1 class="page-title">Bar Charts</h1>
      <p class="page-description">
        様々なバーチャートの例を表示します。データを変更してチャートの動作を確認できます。
      </p>

      <!-- Basic Bar Chart -->
      <div class="chart-container">
        <h2 class="chart-title">基本的なバーチャート</h2>
        <p class="chart-description">
          シンプルなバーチャートです。各項目の数値を個別に表示します。
        </p>
        <canvas id="basicBarChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Basic Bar Chart -->
      <div class="control-panel">
        <h3>基本的なバーチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of basicBarData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateBasicBarChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>

      <!-- Stacked Bar Chart -->
      <div class="chart-container">
        <h2 class="chart-title">積み上げバーチャート</h2>
        <p class="chart-description">
          複数のデータセットを積み上げて表示するバーチャートです。
        </p>
        <canvas id="stackedBarChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Stacked Bar Chart -->
      <div class="control-panel">
        <h3>積み上げバーチャート - データ設定</h3>
        <div class="stacked-controls">
          <div class="dataset-control" *ngFor="let dataset of stackedBarData; let i = index">
            <h4>{{ dataset.label }}</h4>
            <div class="control-row">
              <div class="control-group" *ngFor="let value of dataset.data; let j = index">
                <label>{{ stackedBarLabels[j] }}</label>
                <input 
                  type="number" 
                  [(ngModel)]="dataset.data[j]" 
                  (change)="updateStackedBarChart()"
                  min="0"
                  max="50"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Horizontal Bar Chart -->
      <div class="chart-container">
        <h2 class="chart-title">水平バーチャート</h2>
        <p class="chart-description">
          横向きに表示されるバーチャートです。ラベルが長い場合に有効です。
        </p>
        <canvas id="horizontalBarChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Horizontal Bar Chart -->
      <div class="control-panel">
        <h3>水平バーチャート - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of horizontalBarData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateHorizontalBarChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .bar-charts-container {
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
    
    .stacked-controls {
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
      
      .stacked-controls {
        gap: 1rem;
      }
    }
  `]
})
export class BarChartsComponent implements OnInit, OnDestroy {
    private basicBarChart: Chart | null = null;
    private stackedBarChart: Chart | null = null;
    private horizontalBarChart: Chart | null = null;

    // Basic Bar Chart Data
    basicBarData = [
        { label: '1月', value: 65 },
        { label: '2月', value: 59 },
        { label: '3月', value: 80 },
        { label: '4月', value: 81 },
        { label: '5月', value: 56 },
        { label: '6月', value: 75 }
    ];

    // Stacked Bar Chart Data
    stackedBarLabels = ['1Q', '2Q', '3Q', '4Q'];
    stackedBarData = [
        {
            label: '売上',
            data: [20, 30, 25, 35],
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
        },
        {
            label: '利益',
            data: [15, 25, 20, 30],
            backgroundColor: 'rgba(255, 99, 132, 0.8)'
        },
        {
            label: 'コスト',
            data: [10, 15, 12, 18],
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
        }
    ];

    // Horizontal Bar Chart Data
    horizontalBarData = [
        { label: 'JavaScript', value: 85 },
        { label: 'TypeScript', value: 78 },
        { label: 'Angular', value: 72 },
        { label: 'React', value: 68 },
        { label: 'Vue.js', value: 65 }
    ];

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createBasicBarChart();
            this.createStackedBarChart();
            this.createHorizontalBarChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.basicBarChart) {
            this.basicBarChart.destroy();
        }
        if (this.stackedBarChart) {
            this.stackedBarChart.destroy();
        }
        if (this.horizontalBarChart) {
            this.horizontalBarChart.destroy();
        }
    }

    private createBasicBarChart() {
        const ctx = document.getElementById('basicBarChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.basicBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.basicBarData.map(item => item.label),
                datasets: [{
                    label: '売上（百万円）',
                    data: this.basicBarData.map(item => item.value),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '月別売上推移'
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
                            text: '売上（百万円）'
                        }
                    }
                }
            }
        });
    }

    private createStackedBarChart() {
        const ctx = document.getElementById('stackedBarChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.stackedBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.stackedBarLabels,
                datasets: this.stackedBarData.map(dataset => ({
                    label: dataset.label,
                    data: [...dataset.data],
                    backgroundColor: dataset.backgroundColor
                }))
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '四半期別業績'
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
                        title: {
                            display: true,
                            text: '金額（百万円）'
                        }
                    }
                }
            }
        });
    }

    private createHorizontalBarChart() {
        const ctx = document.getElementById('horizontalBarChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.horizontalBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.horizontalBarData.map(item => item.label),
                datasets: [{
                    label: '人気度（%）',
                    data: this.horizontalBarData.map(item => item.value),
                    backgroundColor: 'rgba(54, 162, 235, 0.8)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'プログラミング言語・フレームワーク人気度'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '人気度（%）'
                        }
                    }
                }
            }
        });
    }

    updateBasicBarChart() {
        if (this.basicBarChart) {
            this.basicBarChart.data.datasets[0].data = this.basicBarData.map(item => item.value);
            this.basicBarChart.update();
        }
    }

    updateStackedBarChart() {
        if (this.stackedBarChart) {
            this.stackedBarChart.data.datasets.forEach((dataset, index) => {
                dataset.data = [...this.stackedBarData[index].data];
            });
            this.stackedBarChart.update();
        }
    }

    updateHorizontalBarChart() {
        if (this.horizontalBarChart) {
            this.horizontalBarChart.data.datasets[0].data = this.horizontalBarData.map(item => item.value);
            this.horizontalBarChart.update();
        }
    }
} 
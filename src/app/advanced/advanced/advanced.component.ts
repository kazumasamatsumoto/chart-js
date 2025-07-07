import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-advanced',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="advanced-container">
      <h1 class="page-title">Advanced</h1>
      <p class="page-description">
        Chart.js の高度な機能を使用した複雑なチャート例です。
      </p>

      <!-- Mixed Chart -->
      <div class="chart-container">
        <h2 class="chart-title">複合チャート</h2>
        <p class="chart-description">
          異なるチャートタイプを組み合わせた複合チャートです。
        </p>
        <canvas id="mixedChart" width="400" height="200"></canvas>
      </div>

      <!-- Real-time Chart -->
      <div class="chart-container">
        <h2 class="chart-title">リアルタイムチャート</h2>
        <p class="chart-description">
          自動的に更新されるリアルタイムデータチャートです。
        </p>
        <canvas id="realtimeChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Real-time -->
      <div class="control-panel">
        <h3>リアルタイム設定</h3>
        <div class="control-row">
          <div class="control-group">
            <button (click)="toggleRealtime()">
              {{ isRealtimeRunning ? '停止' : '開始' }}
            </button>
          </div>
          <div class="control-group">
            <label>更新間隔（ms）</label>
            <input 
              type="number" 
              [(ngModel)]="realtimeInterval" 
              (change)="updateRealtimeInterval()"
              min="500"
              max="5000"
              step="500"
            >
          </div>
        </div>
      </div>

      <!-- Complex Layout Chart -->
      <div class="chart-container">
        <h2 class="chart-title">複雑なレイアウト</h2>
        <p class="chart-description">
          カスタムレイアウトとマルチプラグインの組み合わせです。
        </p>
        <canvas id="complexChart" width="400" height="200"></canvas>
      </div>
    </div>
  `,
    styles: [`
    .advanced-container {
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
    
    button {
      background: #3498db;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    button:hover {
      background: #2980b9;
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class AdvancedComponent implements OnInit, OnDestroy {
    private mixedChart: Chart | null = null;
    private realtimeChart: Chart | null = null;
    private complexChart: Chart | null = null;
      realtimeInterval = 1000;
  private realtimeTimer: any = null;
    isRealtimeRunning = false;

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
        if (this.realtimeTimer) {
            clearInterval(this.realtimeTimer);
        }
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createMixedChart();
            this.createRealtimeChart();
            this.createComplexChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.mixedChart) {
            this.mixedChart.destroy();
        }
        if (this.realtimeChart) {
            this.realtimeChart.destroy();
        }
        if (this.complexChart) {
            this.complexChart.destroy();
        }
    }

    private createMixedChart() {
        const ctx = document.getElementById('mixedChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.mixedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    type: 'bar',
                    label: '売上（棒グラフ）',
                    data: [65, 59, 80, 81, 56, 75],
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }, {
                    type: 'line',
                    label: '利益（線グラフ）',
                    data: [28, 48, 40, 19, 96, 60],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '売上と利益の複合チャート'
                    },
                    legend: {
                        display: true,
                        position: 'top'
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

    private createRealtimeChart() {
        const ctx = document.getElementById('realtimeChart') as HTMLCanvasElement;
        if (!ctx) return;

        const initialData = Array.from({ length: 10 }, (_, i) => ({
            x: i,
            y: Math.random() * 100
        }));

        this.realtimeChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'リアルタイムデータ',
                    data: initialData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'リアルタイムデータ監視'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: '時間'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: '値'
                        }
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }

    private createComplexChart() {
        const ctx = document.getElementById('complexChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.complexChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'データセット1',
                    data: Array.from({ length: 20 }, () => ({
                        x: Math.random() * 100,
                        y: Math.random() * 100
                    })),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointRadius: 8
                }, {
                    label: 'データセット2',
                    data: Array.from({ length: 20 }, () => ({
                        x: Math.random() * 100,
                        y: Math.random() * 100
                    })),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '散布図 - 複雑なデータ分析'
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
                            text: 'X軸の値'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Y軸の値'
                        }
                    }
                }
            }
        });
    }

    toggleRealtime() {
        if (this.isRealtimeRunning) {
            this.stopRealtime();
        } else {
            this.startRealtime();
        }
    }

    private startRealtime() {
        this.isRealtimeRunning = true;
        this.realtimeTimer = setInterval(() => {
            this.updateRealtimeData();
        }, this.realtimeInterval);
    }

    private stopRealtime() {
        this.isRealtimeRunning = false;
        if (this.realtimeTimer) {
            clearInterval(this.realtimeTimer);
            this.realtimeTimer = null;
        }
    }

    private updateRealtimeData() {
        if (!this.realtimeChart) return;

        const dataset = this.realtimeChart.data.datasets[0];
        const data = dataset.data as { x: number; y: number }[];

        // 新しいデータポイントを追加
        const lastX = data.length > 0 ? data[data.length - 1].x : 0;
        data.push({
            x: lastX + 1,
            y: Math.random() * 100
        });

        // 古いデータを削除（最大20ポイント）
        if (data.length > 20) {
            data.shift();
        }

        this.realtimeChart.update('none');
    }

    updateRealtimeInterval() {
        if (this.isRealtimeRunning) {
            this.stopRealtime();
            this.startRealtime();
        }
    }
} 
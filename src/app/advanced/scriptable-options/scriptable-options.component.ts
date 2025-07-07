import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-scriptable-options',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="scriptable-options-container">
      <h1 class="page-title">Scriptable Options</h1>
      <p class="page-description">
        Chart.js の動的設定機能を使用して、データの値に基づいてチャートの見た目を動的に変更できます。
      </p>

      <!-- Color Based on Value Chart -->
      <div class="chart-container">
        <h2 class="chart-title">値に基づく色の変更</h2>
        <p class="chart-description">
          データの値に応じて、バーの色が動的に変わります。
        </p>
        <canvas id="colorBasedChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Color Based -->
      <div class="control-panel">
        <h3>色の変更 - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of colorBasedData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateColorBasedChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
        <div class="control-row">
          <div class="control-group">
            <label>閾値</label>
            <input 
              type="number" 
              [(ngModel)]="colorBasedThreshold" 
              (change)="updateColorBasedChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>

      <!-- Size Based on Value Chart -->
      <div class="chart-container">
        <h2 class="chart-title">値に基づくサイズの変更</h2>
        <p class="chart-description">
          データの値に応じて、ポイントのサイズが動的に変わります。
        </p>
        <canvas id="sizeBasedChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Size Based -->
      <div class="control-panel">
        <h3>サイズの変更 - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of sizeBasedData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateSizeBasedChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
        <div class="control-row">
          <div class="control-group">
            <label>最小サイズ</label>
            <input 
              type="number" 
              [(ngModel)]="sizeBasedOptions.minSize" 
              (change)="updateSizeBasedChart()"
              min="1"
              max="10"
            >
          </div>
          <div class="control-group">
            <label>最大サイズ</label>
            <input 
              type="number" 
              [(ngModel)]="sizeBasedOptions.maxSize" 
              (change)="updateSizeBasedChart()"
              min="10"
              max="30"
            >
          </div>
        </div>
      </div>

      <!-- Conditional Styling Chart -->
      <div class="chart-container">
        <h2 class="chart-title">条件付きスタイリング</h2>
        <p class="chart-description">
          複数の条件に基づいて、様々なスタイルを動的に適用します。
        </p>
        <canvas id="conditionalChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Conditional Styling -->
      <div class="control-panel">
        <h3>条件付きスタイリング - データ設定</h3>
        <div class="control-row">
          <div class="control-group" *ngFor="let item of conditionalData; let i = index">
            <label>{{ item.label }}</label>
            <input 
              type="number" 
              [(ngModel)]="item.value" 
              (change)="updateConditionalChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
        <div class="control-row">
          <div class="control-group">
            <label>警告レベル</label>
            <input 
              type="number" 
              [(ngModel)]="conditionalOptions.warningLevel" 
              (change)="updateConditionalChart()"
              min="0"
              max="100"
            >
          </div>
          <div class="control-group">
            <label>危険レベル</label>
            <input 
              type="number" 
              [(ngModel)]="conditionalOptions.dangerLevel" 
              (change)="updateConditionalChart()"
              min="0"
              max="100"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .scriptable-options-container {
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
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class ScriptableOptionsComponent implements OnInit, OnDestroy {
    private colorBasedChart: Chart | null = null;
    private sizeBasedChart: Chart | null = null;
    private conditionalChart: Chart | null = null;

    // Color Based Data
    colorBasedData = [
        { label: 'A', value: 30 },
        { label: 'B', value: 75 },
        { label: 'C', value: 45 },
        { label: 'D', value: 90 },
        { label: 'E', value: 20 }
    ];
    colorBasedThreshold = 50;

    // Size Based Data
    sizeBasedData = [
        { label: '1月', value: 30 },
        { label: '2月', value: 75 },
        { label: '3月', value: 45 },
        { label: '4月', value: 90 },
        { label: '5月', value: 20 },
        { label: '6月', value: 65 }
    ];
    sizeBasedOptions = {
        minSize: 3,
        maxSize: 20
    };

    // Conditional Data
    conditionalData = [
        { label: 'CPU', value: 85 },
        { label: 'メモリ', value: 60 },
        { label: 'ディスク', value: 30 },
        { label: 'ネットワーク', value: 95 },
        { label: 'バッテリー', value: 40 }
    ];
    conditionalOptions = {
        warningLevel: 70,
        dangerLevel: 90
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createColorBasedChart();
            this.createSizeBasedChart();
            this.createConditionalChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.colorBasedChart) {
            this.colorBasedChart.destroy();
        }
        if (this.sizeBasedChart) {
            this.sizeBasedChart.destroy();
        }
        if (this.conditionalChart) {
            this.conditionalChart.destroy();
        }
    }

    private createColorBasedChart() {
        const ctx = document.getElementById('colorBasedChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.colorBasedChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.colorBasedData.map(item => item.label),
                datasets: [{
                    label: 'データ値',
                    data: this.colorBasedData.map(item => item.value),
                    backgroundColor: (context) => {
                        const value = context.parsed.y;
                        return value >= this.colorBasedThreshold ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)';
                    },
                    borderColor: (context) => {
                        const value = context.parsed.y;
                        return value >= this.colorBasedThreshold ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
                    },
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '値に基づく色の変更（閾値: ' + this.colorBasedThreshold + ')'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    private createSizeBasedChart() {
        const ctx = document.getElementById('sizeBasedChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.sizeBasedChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.sizeBasedData.map(item => item.label),
                datasets: [{
                    label: 'データ値',
                    data: this.sizeBasedData.map(item => item.value),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.4,
                    pointRadius: (context) => {
                        const value = context.parsed.y;
                        const maxValue = Math.max(...this.sizeBasedData.map(d => d.value));
                        const minValue = Math.min(...this.sizeBasedData.map(d => d.value));
                        const normalized = (value - minValue) / (maxValue - minValue);
                        return this.sizeBasedOptions.minSize +
                            (normalized * (this.sizeBasedOptions.maxSize - this.sizeBasedOptions.minSize));
                    },
                    pointHoverRadius: (context) => {
                        const value = context.parsed.y;
                        const maxValue = Math.max(...this.sizeBasedData.map(d => d.value));
                        const minValue = Math.min(...this.sizeBasedData.map(d => d.value));
                        const normalized = (value - minValue) / (maxValue - minValue);
                        return this.sizeBasedOptions.minSize +
                            (normalized * (this.sizeBasedOptions.maxSize - this.sizeBasedOptions.minSize)) + 2;
                    }
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '値に基づくサイズの変更'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    private createConditionalChart() {
        const ctx = document.getElementById('conditionalChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.conditionalChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.conditionalData.map(item => item.label),
                datasets: [{
                    label: '使用率（%）',
                    data: this.conditionalData.map(item => item.value),
                    backgroundColor: (context) => {
                        const value = context.parsed.y;
                        if (value >= this.conditionalOptions.dangerLevel) {
                            return 'rgba(255, 99, 132, 0.8)'; // 危険（赤）
                        } else if (value >= this.conditionalOptions.warningLevel) {
                            return 'rgba(255, 205, 86, 0.8)'; // 警告（黄）
                        } else {
                            return 'rgba(75, 192, 192, 0.8)'; // 正常（緑）
                        }
                    },
                    borderColor: (context) => {
                        const value = context.parsed.y;
                        if (value >= this.conditionalOptions.dangerLevel) {
                            return 'rgba(255, 99, 132, 1)';
                        } else if (value >= this.conditionalOptions.warningLevel) {
                            return 'rgba(255, 205, 86, 1)';
                        } else {
                            return 'rgba(75, 192, 192, 1)';
                        }
                    },
                    borderWidth: (context) => {
                        const value = context.parsed.y;
                        return value >= this.conditionalOptions.dangerLevel ? 4 : 2;
                    }
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'システムリソース使用率'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: '使用率（%）'
                        }
                    }
                }
            }
        });
    }

    updateColorBasedChart() {
        if (this.colorBasedChart) {
            this.colorBasedChart.data.datasets[0].data = this.colorBasedData.map(item => item.value);
            this.colorBasedChart.options.plugins!.title!.text = '値に基づく色の変更（閾値: ' + this.colorBasedThreshold + ')';
            this.colorBasedChart.update();
        }
    }

    updateSizeBasedChart() {
        if (this.sizeBasedChart) {
            this.sizeBasedChart.data.datasets[0].data = this.sizeBasedData.map(item => item.value);
            this.sizeBasedChart.update();
        }
    }

    updateConditionalChart() {
        if (this.conditionalChart) {
            this.conditionalChart.data.datasets[0].data = this.conditionalData.map(item => item.value);
            this.conditionalChart.update();
        }
    }
} 
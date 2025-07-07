import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-tooltip',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="tooltip-container">
      <h1 class="page-title">Tooltip</h1>
      <p class="page-description">
        チャートのツールチップ（ホバー時の情報表示）の設定を行えます。
      </p>

      <!-- Tooltip Basic Chart -->
      <div class="chart-container">
        <h2 class="chart-title">基本ツールチップ設定</h2>
        <p class="chart-description">
          ツールチップの基本的な表示設定です。ポイントにホバーして確認してください。
        </p>
        <canvas id="tooltipBasicChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Tooltip Basic -->
      <div class="control-panel">
        <h3>基本ツールチップ設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>ツールチップ表示</label>
            <select [(ngModel)]="tooltipBasicOptions.enabled" (change)="updateTooltipBasicChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>表示モード</label>
            <select [(ngModel)]="tooltipBasicOptions.mode" (change)="updateTooltipBasicChart()">
              <option value="nearest">最寄り</option>
              <option value="point">ポイント</option>
              <option value="index">インデックス</option>
              <option value="dataset">データセット</option>
            </select>
          </div>
          <div class="control-group">
            <label>交差判定</label>
            <select [(ngModel)]="tooltipBasicOptions.intersect" (change)="updateTooltipBasicChart()">
              <option [value]="true">有効</option>
              <option [value]="false">無効</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Tooltip Style Chart -->
      <div class="chart-container">
        <h2 class="chart-title">ツールチップスタイル設定</h2>
        <p class="chart-description">
          ツールチップの色、フォント、背景などのスタイルを設定できます。
        </p>
        <canvas id="tooltipStyleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Tooltip Style -->
      <div class="control-panel">
        <h3>ツールチップスタイル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>背景色</label>
            <input 
              type="color" 
              [(ngModel)]="tooltipStyleOptions.backgroundColor" 
              (change)="updateTooltipStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>タイトル色</label>
            <input 
              type="color" 
              [(ngModel)]="tooltipStyleOptions.titleColor" 
              (change)="updateTooltipStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>本文色</label>
            <input 
              type="color" 
              [(ngModel)]="tooltipStyleOptions.bodyColor" 
              (change)="updateTooltipStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="tooltipStyleOptions.titleFontSize" 
              (change)="updateTooltipStyleChart()"
              min="8"
              max="20"
            >
          </div>
        </div>
      </div>

      <!-- Custom Tooltip Chart -->
      <div class="chart-container">
        <h2 class="chart-title">カスタムツールチップ</h2>
        <p class="chart-description">
          カスタマイズされたツールチップです。詳細な情報を表示します。
        </p>
        <canvas id="customTooltipChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Custom Tooltip -->
      <div class="control-panel">
        <h3>カスタムツールチップ設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>アニメーション有効</label>
            <select [(ngModel)]="customTooltipOptions.animation" (change)="updateCustomTooltipChart()">
              <option [value]="true">有効</option>
              <option [value]="false">無効</option>
            </select>
          </div>
          <div class="control-group">
            <label>角丸サイズ</label>
            <input 
              type="number" 
              [(ngModel)]="customTooltipOptions.cornerRadius" 
              (change)="updateCustomTooltipChart()"
              min="0"
              max="20"
            >
          </div>
          <div class="control-group">
            <label>パディング</label>
            <input 
              type="number" 
              [(ngModel)]="customTooltipOptions.padding" 
              (change)="updateCustomTooltipChart()"
              min="0"
              max="20"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .tooltip-container {
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
export class TooltipComponent implements OnInit, OnDestroy {
    private tooltipBasicChart: Chart | null = null;
    private tooltipStyleChart: Chart | null = null;
    private customTooltipChart: Chart | null = null;

    private baseData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: '売上（百万円）',
            data: [65, 59, 80, 81, 56, 75],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // Tooltip Basic Options
    tooltipBasicOptions = {
        enabled: true,
        mode: 'nearest' as const,
        intersect: true
    };

    // Tooltip Style Options
    tooltipStyleOptions = {
        backgroundColor: '#333333',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        titleFontSize: 14
    };

    // Custom Tooltip Options
    customTooltipOptions = {
        animation: true,
        cornerRadius: 6,
        padding: 10
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createTooltipBasicChart();
            this.createTooltipStyleChart();
            this.createCustomTooltipChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.tooltipBasicChart) {
            this.tooltipBasicChart.destroy();
        }
        if (this.tooltipStyleChart) {
            this.tooltipStyleChart.destroy();
        }
        if (this.customTooltipChart) {
            this.customTooltipChart.destroy();
        }
    }

    private createTooltipBasicChart() {
        const ctx = document.getElementById('tooltipBasicChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.tooltipBasicChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '基本ツールチップ例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        enabled: this.tooltipBasicOptions.enabled,
                        mode: this.tooltipBasicOptions.mode,
                        intersect: this.tooltipBasicOptions.intersect
                    }
                },
                interaction: {
                    mode: this.tooltipBasicOptions.mode,
                    intersect: this.tooltipBasicOptions.intersect
                }
            }
        });
    }

    private createTooltipStyleChart() {
        const ctx = document.getElementById('tooltipStyleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.tooltipStyleChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [{
                    label: 'データ値',
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'スタイル設定例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: this.tooltipStyleOptions.backgroundColor,
                        titleColor: this.tooltipStyleOptions.titleColor,
                        bodyColor: this.tooltipStyleOptions.bodyColor,
                        titleFont: {
                            size: this.tooltipStyleOptions.titleFontSize
                        }
                    }
                }
            }
        });
    }

    private createCustomTooltipChart() {
        const ctx = document.getElementById('customTooltipChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.customTooltipChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
                datasets: [{
                    data: [12, 19, 3, 5, 2],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'カスタムツールチップ例'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true,
                        animation: this.customTooltipOptions.animation as any,
                        cornerRadius: this.customTooltipOptions.cornerRadius,
                        padding: this.customTooltipOptions.padding,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateTooltipBasicChart() {
        if (this.tooltipBasicChart) {
            this.tooltipBasicChart.options.plugins!.tooltip!.enabled = this.tooltipBasicOptions.enabled;
            this.tooltipBasicChart.options.plugins!.tooltip!.mode = this.tooltipBasicOptions.mode;
            this.tooltipBasicChart.options.plugins!.tooltip!.intersect = this.tooltipBasicOptions.intersect;
            this.tooltipBasicChart.options.interaction!.mode = this.tooltipBasicOptions.mode;
            this.tooltipBasicChart.options.interaction!.intersect = this.tooltipBasicOptions.intersect;
            this.tooltipBasicChart.update();
        }
    }

    updateTooltipStyleChart() {
        if (this.tooltipStyleChart) {
            this.tooltipStyleChart.options.plugins!.tooltip!.backgroundColor = this.tooltipStyleOptions.backgroundColor;
            this.tooltipStyleChart.options.plugins!.tooltip!.titleColor = this.tooltipStyleOptions.titleColor;
            this.tooltipStyleChart.options.plugins!.tooltip!.bodyColor = this.tooltipStyleOptions.bodyColor;
            if (this.tooltipStyleChart.options.plugins!.tooltip!.titleFont) {
                (this.tooltipStyleChart.options.plugins!.tooltip!.titleFont as any).size = this.tooltipStyleOptions.titleFontSize;
            }
            this.tooltipStyleChart.update();
        }
    }

    updateCustomTooltipChart() {
        if (this.customTooltipChart) {
            if (this.customTooltipChart.options.plugins!.tooltip) {
                (this.customTooltipChart.options.plugins!.tooltip as any).animation = this.customTooltipOptions.animation;
            }
            this.customTooltipChart.options.plugins!.tooltip!.cornerRadius = this.customTooltipOptions.cornerRadius;
            this.customTooltipChart.options.plugins!.tooltip!.padding = this.customTooltipOptions.padding;
            this.customTooltipChart.update();
        }
    }
} 
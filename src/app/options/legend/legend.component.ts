import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-legend',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="legend-container">
      <h1 class="page-title">Legend</h1>
      <p class="page-description">
        チャートの凡例（Legend）の表示、位置、スタイルを設定できます。
      </p>

      <!-- Legend Position Chart -->
      <div class="chart-container">
        <h2 class="chart-title">凡例位置設定</h2>
        <p class="chart-description">
          凡例の位置を上下左右に設定できます。
        </p>
        <canvas id="legendPositionChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Legend Position -->
      <div class="control-panel">
        <h3>凡例位置設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>凡例表示</label>
            <select [(ngModel)]="legendOptions.display" (change)="updateLegendPositionChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>凡例位置</label>
            <select [(ngModel)]="legendOptions.position" (change)="updateLegendPositionChart()">
              <option value="top">上</option>
              <option value="bottom">下</option>
              <option value="left">左</option>
              <option value="right">右</option>
            </select>
          </div>
          <div class="control-group">
            <label>凡例配置</label>
            <select [(ngModel)]="legendOptions.align" (change)="updateLegendPositionChart()">
              <option value="start">開始</option>
              <option value="center">中央</option>
              <option value="end">終了</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Legend Style Chart -->
      <div class="chart-container">
        <h2 class="chart-title">凡例スタイル設定</h2>
        <p class="chart-description">
          凡例のフォント、色、サイズを設定できます。
        </p>
        <canvas id="legendStyleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Legend Style -->
      <div class="control-panel">
        <h3>凡例スタイル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="legendStyleOptions.fontSize" 
              (change)="updateLegendStyleChart()"
              min="8"
              max="24"
            >
          </div>
          <div class="control-group">
            <label>フォント色</label>
            <input 
              type="color" 
              [(ngModel)]="legendStyleOptions.color" 
              (change)="updateLegendStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントファミリー</label>
            <select [(ngModel)]="legendStyleOptions.fontFamily" (change)="updateLegendStyleChart()">
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Custom Legend Chart -->
      <div class="chart-container">
        <h2 class="chart-title">カスタム凡例</h2>
        <p class="chart-description">
          凡例の表示スタイルをカスタマイズできます。
        </p>
        <canvas id="customLegendChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Custom Legend -->
      <div class="control-panel">
        <h3>カスタム凡例設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>ボックス幅</label>
            <input 
              type="number" 
              [(ngModel)]="customLegendOptions.boxWidth" 
              (change)="updateCustomLegendChart()"
              min="10"
              max="50"
            >
          </div>
          <div class="control-group">
            <label>ボックス高さ</label>
            <input 
              type="number" 
              [(ngModel)]="customLegendOptions.boxHeight" 
              (change)="updateCustomLegendChart()"
              min="10"
              max="50"
            >
          </div>
          <div class="control-group">
            <label>パディング</label>
            <input 
              type="number" 
              [(ngModel)]="customLegendOptions.padding" 
              (change)="updateCustomLegendChart()"
              min="0"
              max="50"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .legend-container {
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
export class LegendComponent implements OnInit, OnDestroy {
    private legendPositionChart: Chart | null = null;
    private legendStyleChart: Chart | null = null;
    private customLegendChart: Chart | null = null;

    private baseData = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'データセット1',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 205, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)'
            ]
        }]
    };

    // Legend Position Options
    legendOptions = {
        display: true,
        position: 'top' as const,
        align: 'center' as const
    };

    // Legend Style Options
    legendStyleOptions = {
        fontSize: 14,
        color: '#333333',
        fontFamily: 'Arial'
    };

    // Custom Legend Options
    customLegendOptions = {
        boxWidth: 20,
        boxHeight: 20,
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
            this.createLegendPositionChart();
            this.createLegendStyleChart();
            this.createCustomLegendChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.legendPositionChart) {
            this.legendPositionChart.destroy();
        }
        if (this.legendStyleChart) {
            this.legendStyleChart.destroy();
        }
        if (this.customLegendChart) {
            this.customLegendChart.destroy();
        }
    }

    private createLegendPositionChart() {
        const ctx = document.getElementById('legendPositionChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.legendPositionChart = new Chart(ctx, {
            type: 'pie',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '凡例位置設定例'
                    },
                    legend: {
                        display: this.legendOptions.display,
                        position: this.legendOptions.position,
                        align: this.legendOptions.align
                    }
                }
            }
        });
    }

    private createLegendStyleChart() {
        const ctx = document.getElementById('legendStyleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.legendStyleChart = new Chart(ctx, {
            type: 'doughnut',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '凡例スタイル設定例'
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            font: {
                                size: this.legendStyleOptions.fontSize,
                                family: this.legendStyleOptions.fontFamily
                            },
                            color: this.legendStyleOptions.color
                        }
                    }
                }
            }
        });
    }

    private createCustomLegendChart() {
        const ctx = document.getElementById('customLegendChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.customLegendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月'],
                datasets: [{
                    label: '製品A',
                    data: [65, 59, 80, 81, 56],
                    backgroundColor: 'rgba(255, 99, 132, 0.8)'
                }, {
                    label: '製品B',
                    data: [28, 48, 40, 19, 86],
                    backgroundColor: 'rgba(54, 162, 235, 0.8)'
                }, {
                    label: '製品C',
                    data: [45, 35, 60, 70, 40],
                    backgroundColor: 'rgba(75, 192, 192, 0.8)'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'カスタム凡例例'
                    },
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            boxWidth: this.customLegendOptions.boxWidth,
                            boxHeight: this.customLegendOptions.boxHeight,
                            padding: this.customLegendOptions.padding,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                }
            }
        });
    }

    updateLegendPositionChart() {
        if (this.legendPositionChart) {
            this.legendPositionChart.options.plugins!.legend!.display = this.legendOptions.display;
            this.legendPositionChart.options.plugins!.legend!.position = this.legendOptions.position;
            this.legendPositionChart.options.plugins!.legend!.align = this.legendOptions.align;
            this.legendPositionChart.update();
        }
    }

    updateLegendStyleChart() {
        if (this.legendStyleChart) {
            if (this.legendStyleChart.options.plugins!.legend!.labels!.font) {
                (this.legendStyleChart.options.plugins!.legend!.labels!.font as any).size = this.legendStyleOptions.fontSize;
                (this.legendStyleChart.options.plugins!.legend!.labels!.font as any).family = this.legendStyleOptions.fontFamily;
            }
            this.legendStyleChart.options.plugins!.legend!.labels!.color = this.legendStyleOptions.color;
            this.legendStyleChart.update();
        }
    }

    updateCustomLegendChart() {
        if (this.customLegendChart) {
            this.customLegendChart.options.plugins!.legend!.labels!.boxWidth = this.customLegendOptions.boxWidth;
            this.customLegendChart.options.plugins!.legend!.labels!.boxHeight = this.customLegendOptions.boxHeight;
            this.customLegendChart.options.plugins!.legend!.labels!.padding = this.customLegendOptions.padding;
            this.customLegendChart.update();
        }
    }
} 
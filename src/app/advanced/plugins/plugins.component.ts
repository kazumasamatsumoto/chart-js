import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-plugins',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="plugins-container">
      <h1 class="page-title">Plugins</h1>
      <p class="page-description">
        Chart.js のプラグイン機能を使用してチャートの機能を拡張できます。
      </p>

      <!-- Custom Plugin Chart -->
      <div class="chart-container">
        <h2 class="chart-title">カスタムプラグイン</h2>
        <p class="chart-description">
          カスタムプラグインでチャートに追加情報を表示します。
        </p>
        <canvas id="customPluginChart" width="400" height="200"></canvas>
      </div>

      <!-- Zoom Plugin Chart -->
      <div class="chart-container">
        <h2 class="chart-title">背景色プラグイン</h2>
        <p class="chart-description">
          チャートの背景色を変更するプラグインです。
        </p>
        <canvas id="backgroundPluginChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Background Plugin -->
      <div class="control-panel">
        <h3>背景色設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>背景色</label>
            <input 
              type="color" 
              [(ngModel)]="backgroundPluginOptions.backgroundColor" 
              (change)="updateBackgroundPlugin()"
            >
          </div>
          <div class="control-group">
            <label>透明度</label>
            <input 
              type="range" 
              [(ngModel)]="backgroundPluginOptions.opacity" 
              (change)="updateBackgroundPlugin()"
              min="0"
              max="1"
              step="0.1"
            >
            <span>{{ backgroundPluginOptions.opacity }}</span>
          </div>
        </div>
      </div>

      <!-- Data Labels Plugin Chart -->
      <div class="chart-container">
        <h2 class="chart-title">データラベルプラグイン</h2>
        <p class="chart-description">
          データポイントに直接値を表示するプラグインです。
        </p>
        <canvas id="dataLabelsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Data Labels -->
      <div class="control-panel">
        <h3>データラベル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>ラベル表示</label>
            <select [(ngModel)]="dataLabelsOptions.display" (change)="updateDataLabelsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>ラベル色</label>
            <input 
              type="color" 
              [(ngModel)]="dataLabelsOptions.color" 
              (change)="updateDataLabelsChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="dataLabelsOptions.fontSize" 
              (change)="updateDataLabelsChart()"
              min="8"
              max="20"
            >
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .plugins-container {
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
    
    input[type="range"] {
      width: 100px;
      margin-right: 10px;
    }
    
    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
    }
  `]
})
export class PluginsComponent implements OnInit, OnDestroy {
    private customPluginChart: Chart | null = null;
    private backgroundPluginChart: Chart | null = null;
    private dataLabelsChart: Chart | null = null;

    // Background Plugin Options
    backgroundPluginOptions = {
        backgroundColor: '#f0f0f0',
        opacity: 0.5
    };

    // Data Labels Options
    dataLabelsOptions = {
        display: true,
        color: '#333333',
        fontSize: 12
    };

    // Custom Plugins
    private customCenterTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: Chart) => {
            if ((chart as any).config.type === 'doughnut') {
                const { ctx, chartArea: { left, top, width, height } } = chart;
                ctx.save();

                const centerX = left + width / 2;
                const centerY = top + height / 2;

                ctx.font = 'bold 20px Arial';
                ctx.fillStyle = '#333';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('総計', centerX, centerY - 10);

                ctx.font = '16px Arial';
                ctx.fillText('100%', centerX, centerY + 10);

                ctx.restore();
            }
        }
    };

    private backgroundColorPlugin = {
        id: 'backgroundColor',
        beforeDraw: (chart: Chart) => {
            const { ctx, chartArea: { left, top, width, height } } = chart;
            ctx.save();
            ctx.globalAlpha = this.backgroundPluginOptions.opacity;
            ctx.fillStyle = this.backgroundPluginOptions.backgroundColor;
            ctx.fillRect(left, top, width, height);
            ctx.restore();
        }
    };

    private dataLabelsPlugin = {
        id: 'dataLabels',
        afterDatasetsDraw: (chart: Chart) => {
            if (!this.dataLabelsOptions.display) return;

            const { ctx } = chart;
            ctx.save();

            chart.data.datasets.forEach((dataset, datasetIndex) => {
                const meta = chart.getDatasetMeta(datasetIndex);
                meta.data.forEach((element, index) => {
                    const value = dataset.data[index];
                    const { x, y } = element.getProps(['x', 'y'], true);

                    ctx.font = `${this.dataLabelsOptions.fontSize}px Arial`;
                    ctx.fillStyle = this.dataLabelsOptions.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(value?.toString() || '0', x, y - 15);
                });
            });

            ctx.restore();
        }
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createCustomPluginChart();
            this.createBackgroundPluginChart();
            this.createDataLabelsChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.customPluginChart) {
            this.customPluginChart.destroy();
        }
        if (this.backgroundPluginChart) {
            this.backgroundPluginChart.destroy();
        }
        if (this.dataLabelsChart) {
            this.dataLabelsChart.destroy();
        }
    }

    private createCustomPluginChart() {
        const ctx = document.getElementById('customPluginChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.customPluginChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green'],
                datasets: [{
                    data: [30, 25, 25, 20],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 205, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'カスタムプラグイン - 中央テキスト'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            },
            plugins: [this.customCenterTextPlugin]
        });
    }

    private createBackgroundPluginChart() {
        const ctx = document.getElementById('backgroundPluginChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.backgroundPluginChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                datasets: [{
                    label: 'データ値',
                    data: [65, 59, 80, 81, 56, 75],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '背景色プラグイン例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            },
            plugins: [this.backgroundColorPlugin]
        });
    }

    private createDataLabelsChart() {
        const ctx = document.getElementById('dataLabelsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.dataLabelsChart = new Chart(ctx, {
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
                        text: 'データラベルプラグイン例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            },
            plugins: [this.dataLabelsPlugin]
        });
    }

    updateBackgroundPlugin() {
        if (this.backgroundPluginChart) {
            this.backgroundPluginChart.update();
        }
    }

    updateDataLabelsChart() {
        if (this.dataLabelsChart) {
            this.dataLabelsChart.update();
        }
    }
} 
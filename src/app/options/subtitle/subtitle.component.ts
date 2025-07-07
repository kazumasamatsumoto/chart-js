import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-subtitle',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="subtitle-container">
      <h1 class="page-title">Subtitle</h1>
      <p class="page-description">
        チャートのサブタイトルの表示、位置、スタイルを設定できます。
      </p>

      <!-- Subtitle Options Chart -->
      <div class="chart-container">
        <h2 class="chart-title">サブタイトル設定</h2>
        <p class="chart-description">
          サブタイトルのテキスト、表示位置、配置を設定できます。
        </p>
        <canvas id="subtitleOptionsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Subtitle Options -->
      <div class="control-panel">
        <h3>サブタイトル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>サブタイトル表示</label>
            <select [(ngModel)]="subtitleOptions.display" (change)="updateSubtitleOptionsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>サブタイトルテキスト</label>
            <input 
              type="text" 
              [(ngModel)]="subtitleOptions.text" 
              (change)="updateSubtitleOptionsChart()"
              placeholder="サブタイトルを入力"
            >
          </div>
          <div class="control-group">
            <label>サブタイトル位置</label>
            <select [(ngModel)]="subtitleOptions.position" (change)="updateSubtitleOptionsChart()">
              <option value="top">上</option>
              <option value="bottom">下</option>
            </select>
          </div>
          <div class="control-group">
            <label>サブタイトル配置</label>
            <select [(ngModel)]="subtitleOptions.align" (change)="updateSubtitleOptionsChart()">
              <option value="start">開始</option>
              <option value="center">中央</option>
              <option value="end">終了</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Subtitle Style Chart -->
      <div class="chart-container">
        <h2 class="chart-title">サブタイトルスタイル設定</h2>
        <p class="chart-description">
          サブタイトルのフォント、色、サイズを設定できます。
        </p>
        <canvas id="subtitleStyleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Subtitle Style -->
      <div class="control-panel">
        <h3>サブタイトルスタイル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="subtitleStyleOptions.fontSize" 
              (change)="updateSubtitleStyleChart()"
              min="8"
              max="24"
            >
          </div>
          <div class="control-group">
            <label>フォント色</label>
            <input 
              type="color" 
              [(ngModel)]="subtitleStyleOptions.color" 
              (change)="updateSubtitleStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントファミリー</label>
            <select [(ngModel)]="subtitleStyleOptions.fontFamily" (change)="updateSubtitleStyleChart()">
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>
          <div class="control-group">
            <label>フォントスタイル</label>
            <select [(ngModel)]="subtitleStyleOptions.fontStyle" (change)="updateSubtitleStyleChart()">
              <option value="normal">通常</option>
              <option value="italic">斜体</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .subtitle-container {
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
export class SubtitleComponent implements OnInit, OnDestroy {
    private subtitleOptionsChart: Chart | null = null;
    private subtitleStyleChart: Chart | null = null;

    private baseData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: '売上データ',
            data: [65, 59, 80, 81, 56, 75],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // Subtitle Options
    subtitleOptions = {
        display: true,
        text: 'チャートの詳細説明',
        position: 'top' as const,
        align: 'center' as const
    };

    // Subtitle Style Options
    subtitleStyleOptions = {
        fontSize: 12,
        color: '#666666',
        fontFamily: 'Arial',
        fontStyle: 'normal'
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createSubtitleOptionsChart();
            this.createSubtitleStyleChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.subtitleOptionsChart) {
            this.subtitleOptionsChart.destroy();
        }
        if (this.subtitleStyleChart) {
            this.subtitleStyleChart.destroy();
        }
    }

    private createSubtitleOptionsChart() {
        const ctx = document.getElementById('subtitleOptionsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.subtitleOptionsChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'メインタイトル'
                    },
                    subtitle: {
                        display: this.subtitleOptions.display,
                        text: this.subtitleOptions.text,
                        position: this.subtitleOptions.position,
                        align: this.subtitleOptions.align
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    private createSubtitleStyleChart() {
        const ctx = document.getElementById('subtitleStyleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.subtitleStyleChart = new Chart(ctx, {
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
                    subtitle: {
                        display: true,
                        text: 'サブタイトルスタイル例',
                        font: {
                            size: this.subtitleStyleOptions.fontSize,
                            family: this.subtitleStyleOptions.fontFamily,
                            style: this.subtitleStyleOptions.fontStyle as any
                        },
                        color: this.subtitleStyleOptions.color
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateSubtitleOptionsChart() {
        if (this.subtitleOptionsChart) {
            this.subtitleOptionsChart.options.plugins!.subtitle!.display = this.subtitleOptions.display;
            this.subtitleOptionsChart.options.plugins!.subtitle!.text = this.subtitleOptions.text;
            this.subtitleOptionsChart.options.plugins!.subtitle!.position = this.subtitleOptions.position;
            this.subtitleOptionsChart.options.plugins!.subtitle!.align = this.subtitleOptions.align;
            this.subtitleOptionsChart.update();
        }
    }

    updateSubtitleStyleChart() {
        if (this.subtitleStyleChart) {
            if (this.subtitleStyleChart.options.plugins!.subtitle!.font) {
                (this.subtitleStyleChart.options.plugins!.subtitle!.font as any).size = this.subtitleStyleOptions.fontSize;
                (this.subtitleStyleChart.options.plugins!.subtitle!.font as any).family = this.subtitleStyleOptions.fontFamily;
                (this.subtitleStyleChart.options.plugins!.subtitle!.font as any).style = this.subtitleStyleOptions.fontStyle;
            }
            this.subtitleStyleChart.options.plugins!.subtitle!.color = this.subtitleStyleOptions.color;
            this.subtitleStyleChart.update();
        }
    }
} 
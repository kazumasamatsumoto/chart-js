import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-title',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="title-container">
      <h1 class="page-title">Title</h1>
      <p class="page-description">
        チャートのタイトルの表示、位置、スタイルを設定できます。
      </p>

      <!-- Title Options Chart -->
      <div class="chart-container">
        <h2 class="chart-title">タイトル設定</h2>
        <p class="chart-description">
          タイトルのテキスト、表示位置、配置を設定できます。
        </p>
        <canvas id="titleOptionsChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Title Options -->
      <div class="control-panel">
        <h3>タイトル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>タイトル表示</label>
            <select [(ngModel)]="titleOptions.display" (change)="updateTitleOptionsChart()">
              <option [value]="true">表示</option>
              <option [value]="false">非表示</option>
            </select>
          </div>
          <div class="control-group">
            <label>タイトルテキスト</label>
            <input 
              type="text" 
              [(ngModel)]="titleOptions.text" 
              (change)="updateTitleOptionsChart()"
              placeholder="タイトルを入力"
            >
          </div>
          <div class="control-group">
            <label>タイトル位置</label>
            <select [(ngModel)]="titleOptions.position" (change)="updateTitleOptionsChart()">
              <option value="top">上</option>
              <option value="bottom">下</option>
              <option value="left">左</option>
              <option value="right">右</option>
            </select>
          </div>
          <div class="control-group">
            <label>タイトル配置</label>
            <select [(ngModel)]="titleOptions.align" (change)="updateTitleOptionsChart()">
              <option value="start">開始</option>
              <option value="center">中央</option>
              <option value="end">終了</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Title Style Chart -->
      <div class="chart-container">
        <h2 class="chart-title">タイトルスタイル設定</h2>
        <p class="chart-description">
          タイトルのフォント、色、サイズを設定できます。
        </p>
        <canvas id="titleStyleChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Title Style -->
      <div class="control-panel">
        <h3>タイトルスタイル設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>フォントサイズ</label>
            <input 
              type="number" 
              [(ngModel)]="titleStyleOptions.fontSize" 
              (change)="updateTitleStyleChart()"
              min="10"
              max="36"
            >
          </div>
          <div class="control-group">
            <label>フォント色</label>
            <input 
              type="color" 
              [(ngModel)]="titleStyleOptions.color" 
              (change)="updateTitleStyleChart()"
            >
          </div>
          <div class="control-group">
            <label>フォントファミリー</label>
            <select [(ngModel)]="titleStyleOptions.fontFamily" (change)="updateTitleStyleChart()">
              <option value="Arial">Arial</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Helvetica">Helvetica</option>
            </select>
          </div>
          <div class="control-group">
            <label>フォントスタイル</label>
            <select [(ngModel)]="titleStyleOptions.fontStyle" (change)="updateTitleStyleChart()">
              <option value="normal">通常</option>
              <option value="italic">斜体</option>
              <option value="bold">太字</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .title-container {
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
export class TitleComponent implements OnInit, OnDestroy {
    private titleOptionsChart: Chart | null = null;
    private titleStyleChart: Chart | null = null;

    private baseData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: '売上データ',
            data: [65, 59, 80, 81, 56, 75],
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.4,
            fill: true
        }]
    };

    // Title Options
    titleOptions = {
        display: true,
        text: 'チャートタイトル',
        position: 'top' as const,
        align: 'center' as const
    };

    // Title Style Options
    titleStyleOptions = {
        fontSize: 16,
        color: '#333333',
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
            this.createTitleOptionsChart();
            this.createTitleStyleChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.titleOptionsChart) {
            this.titleOptionsChart.destroy();
        }
        if (this.titleStyleChart) {
            this.titleStyleChart.destroy();
        }
    }

    private createTitleOptionsChart() {
        const ctx = document.getElementById('titleOptionsChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.titleOptionsChart = new Chart(ctx, {
            type: 'line',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: this.titleOptions.display,
                        text: this.titleOptions.text,
                        position: this.titleOptions.position,
                        align: this.titleOptions.align
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    private createTitleStyleChart() {
        const ctx = document.getElementById('titleStyleChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.titleStyleChart = new Chart(ctx, {
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
                        text: 'スタイル設定例',
                        font: {
                            size: this.titleStyleOptions.fontSize,
                            family: this.titleStyleOptions.fontFamily,
                            style: this.titleStyleOptions.fontStyle as any
                        },
                        color: this.titleStyleOptions.color
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
    }

    updateTitleOptionsChart() {
        if (this.titleOptionsChart) {
            this.titleOptionsChart.options.plugins!.title!.display = this.titleOptions.display;
            this.titleOptionsChart.options.plugins!.title!.text = this.titleOptions.text;
            this.titleOptionsChart.options.plugins!.title!.position = this.titleOptions.position;
            this.titleOptionsChart.options.plugins!.title!.align = this.titleOptions.align;
            this.titleOptionsChart.update();
        }
    }

    updateTitleStyleChart() {
        if (this.titleStyleChart) {
            if (this.titleStyleChart.options.plugins!.title!.font) {
                (this.titleStyleChart.options.plugins!.title!.font as any).size = this.titleStyleOptions.fontSize;
                (this.titleStyleChart.options.plugins!.title!.font as any).family = this.titleStyleOptions.fontFamily;
                (this.titleStyleChart.options.plugins!.title!.font as any).style = this.titleStyleOptions.fontStyle;
            }
            this.titleStyleChart.options.plugins!.title!.color = this.titleStyleOptions.color;
            this.titleStyleChart.update();
        }
    }
} 
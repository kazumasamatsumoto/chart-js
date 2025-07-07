import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-animations',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="animations-container">
      <h1 class="page-title">Animations</h1>
      <p class="page-description">
        Chart.js のアニメーション機能を使用して、チャートに動的な効果を追加できます。
      </p>

      <!-- Basic Animation Chart -->
      <div class="chart-container">
        <h2 class="chart-title">基本アニメーション設定</h2>
        <p class="chart-description">
          アニメーションの持続時間、イージング、遅延を設定できます。
        </p>
        <canvas id="basicAnimationChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Basic Animation -->
      <div class="control-panel">
        <h3>基本アニメーション設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>アニメーション有効</label>
            <select [(ngModel)]="basicAnimationOptions.enabled" (change)="updateBasicAnimationChart()">
              <option [value]="true">有効</option>
              <option [value]="false">無効</option>
            </select>
          </div>
          <div class="control-group">
            <label>持続時間（ms）</label>
            <input 
              type="number" 
              [(ngModel)]="basicAnimationOptions.duration" 
              (change)="updateBasicAnimationChart()"
              min="0"
              max="5000"
              step="100"
            >
          </div>
          <div class="control-group">
            <label>イージング</label>
            <select [(ngModel)]="basicAnimationOptions.easing" (change)="updateBasicAnimationChart()">
              <option value="linear">linear</option>
              <option value="easeInQuad">easeInQuad</option>
              <option value="easeOutQuad">easeOutQuad</option>
              <option value="easeInOutQuad">easeInOutQuad</option>
              <option value="easeInBounce">easeInBounce</option>
              <option value="easeOutBounce">easeOutBounce</option>
            </select>
          </div>
          <div class="control-group">
            <label>遅延（ms）</label>
            <input 
              type="number" 
              [(ngModel)]="basicAnimationOptions.delay" 
              (change)="updateBasicAnimationChart()"
              min="0"
              max="2000"
              step="100"
            >
          </div>
        </div>
        <div class="control-row">
          <div class="control-group">
            <button (click)="replayBasicAnimation()">アニメーション再生</button>
          </div>
        </div>
      </div>

      <!-- Progressive Animation Chart -->
      <div class="chart-container">
        <h2 class="chart-title">段階的アニメーション</h2>
        <p class="chart-description">
          データポイントごとに順次アニメーションを実行します。
        </p>
        <canvas id="progressiveAnimationChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Progressive Animation -->
      <div class="control-panel">
        <h3>段階的アニメーション設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>要素間の遅延（ms）</label>
            <input 
              type="number" 
              [(ngModel)]="progressiveAnimationOptions.delayBetween" 
              (change)="updateProgressiveAnimationChart()"
              min="0"
              max="500"
              step="50"
            >
          </div>
          <div class="control-group">
            <label>アニメーション方向</label>
            <select [(ngModel)]="progressiveAnimationOptions.direction" (change)="updateProgressiveAnimationChart()">
              <option value="x">X軸</option>
              <option value="y">Y軸</option>
            </select>
          </div>
          <div class="control-group">
            <button (click)="replayProgressiveAnimation()">アニメーション再生</button>
          </div>
        </div>
      </div>

      <!-- Hover Animation Chart -->
      <div class="chart-container">
        <h2 class="chart-title">ホバーアニメーション</h2>
        <p class="chart-description">
          ホバー時のアニメーション効果を設定できます。
        </p>
        <canvas id="hoverAnimationChart" width="400" height="200"></canvas>
      </div>

      <!-- Control Panel for Hover Animation -->
      <div class="control-panel">
        <h3>ホバーアニメーション設定</h3>
        <div class="control-row">
          <div class="control-group">
            <label>ホバー持続時間（ms）</label>
            <input 
              type="number" 
              [(ngModel)]="hoverAnimationOptions.duration" 
              (change)="updateHoverAnimationChart()"
              min="0"
              max="1000"
              step="50"
            >
          </div>
          <div class="control-group">
            <label>ホバーイージング</label>
            <select [(ngModel)]="hoverAnimationOptions.easing" (change)="updateHoverAnimationChart()">
              <option value="linear">linear</option>
              <option value="easeInQuad">easeInQuad</option>
              <option value="easeOutQuad">easeOutQuad</option>
              <option value="easeInOutQuad">easeInOutQuad</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .animations-container {
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
export class AnimationsComponent implements OnInit, OnDestroy {
    private basicAnimationChart: Chart | null = null;
    private progressiveAnimationChart: Chart | null = null;
    private hoverAnimationChart: Chart | null = null;

    private baseData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
            label: 'サンプルデータ',
            data: [65, 59, 80, 81, 56, 75],
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
            borderWidth: 2
        }]
    };

    // Basic Animation Options
    basicAnimationOptions = {
        enabled: true,
        duration: 1000,
        easing: 'easeOutQuad' as const,
        delay: 0
    };

    // Progressive Animation Options
    progressiveAnimationOptions = {
        delayBetween: 100,
        direction: 'x' as const
    };

    // Hover Animation Options
    hoverAnimationOptions = {
        duration: 400,
        easing: 'easeInOutQuad' as const
    };

    ngOnInit() {
        this.initializeCharts();
    }

    ngOnDestroy() {
        this.destroyCharts();
    }

    private initializeCharts() {
        setTimeout(() => {
            this.createBasicAnimationChart();
            this.createProgressiveAnimationChart();
            this.createHoverAnimationChart();
        }, 100);
    }

    private destroyCharts() {
        if (this.basicAnimationChart) {
            this.basicAnimationChart.destroy();
        }
        if (this.progressiveAnimationChart) {
            this.progressiveAnimationChart.destroy();
        }
        if (this.hoverAnimationChart) {
            this.hoverAnimationChart.destroy();
        }
    }

    private createBasicAnimationChart() {
        const ctx = document.getElementById('basicAnimationChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.basicAnimationChart = new Chart(ctx, {
            type: 'bar',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '基本アニメーション例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                animation: {
                    duration: this.basicAnimationOptions.duration,
                    easing: this.basicAnimationOptions.easing,
                    delay: this.basicAnimationOptions.delay
                }
            }
        });
    }

    private createProgressiveAnimationChart() {
        const ctx = document.getElementById('progressiveAnimationChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.progressiveAnimationChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.baseData.labels,
                datasets: [{
                    label: 'サンプルデータ',
                    data: this.baseData.datasets[0].data,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '段階的アニメーション例'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                animation: {
                    duration: 1500,
                    delay: (context: any) => {
                        let delay = 0;
                        if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * this.progressiveAnimationOptions.delayBetween;
                        }
                        return delay;
                    }
                }
            }
        });
    }

    private createHoverAnimationChart() {
        const ctx = document.getElementById('hoverAnimationChart') as HTMLCanvasElement;
        if (!ctx) return;

        this.hoverAnimationChart = new Chart(ctx, {
            type: 'doughnut',
            data: { ...this.baseData },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'ホバーアニメーション例'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                                    hover: {
                        mode: 'nearest' as const
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000
                }
            }
        });
    }

    updateBasicAnimationChart() {
        if (this.basicAnimationChart) {
            if (this.basicAnimationChart.options.animation && typeof this.basicAnimationChart.options.animation === 'object') {
                (this.basicAnimationChart.options.animation as any).duration = this.basicAnimationOptions.duration;
                (this.basicAnimationChart.options.animation as any).easing = this.basicAnimationOptions.easing;
                (this.basicAnimationChart.options.animation as any).delay = this.basicAnimationOptions.delay;
            }
            this.basicAnimationChart.update();
        }
    }

    updateProgressiveAnimationChart() {
        if (this.progressiveAnimationChart) {
            if (this.progressiveAnimationChart.options.animation && typeof this.progressiveAnimationChart.options.animation === 'object') {
                (this.progressiveAnimationChart.options.animation as any).delay = (context: any) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * this.progressiveAnimationOptions.delayBetween;
                    }
                    return delay;
                };
            }
            this.progressiveAnimationChart.update();
        }
    }

    updateHoverAnimationChart() {
        if (this.hoverAnimationChart) {
            // Chart.js doesn't have hover animation duration in the hover options
            // Instead, we can update the main animation options
            if (this.hoverAnimationChart.options.animation && typeof this.hoverAnimationChart.options.animation === 'object') {
                (this.hoverAnimationChart.options.animation as any).duration = this.hoverAnimationOptions.duration;
            }
            this.hoverAnimationChart.update();
        }
    }

    replayBasicAnimation() {
        if (this.basicAnimationChart) {
            this.basicAnimationChart.update('reset');
        }
    }

    replayProgressiveAnimation() {
        if (this.progressiveAnimationChart) {
            this.progressiveAnimationChart.update('reset');
        }
    }
} 
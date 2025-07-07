import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <h1>Chart.js Angular サンプル</h1>
      </div>
      <div class="navbar-menu">
        <div class="navbar-section">
          <h3>基本チャート</h3>
          <ul>
            <li><a routerLink="/bar-charts" routerLinkActive="active">Bar Charts</a></li>
            <li><a routerLink="/line-charts" routerLinkActive="active">Line Charts</a></li>
            <li><a routerLink="/other-charts" routerLinkActive="active">Other Charts</a></li>
            <li><a routerLink="/area-charts" routerLinkActive="active">Area Charts</a></li>
          </ul>
        </div>
        <div class="navbar-section">
          <h3>設定オプション</h3>
          <ul>
            <li><a routerLink="/scales" routerLinkActive="active">Scales</a></li>
            <li><a routerLink="/scale-options" routerLinkActive="active">Scale Options</a></li>
            <li><a routerLink="/legend" routerLinkActive="active">Legend</a></li>
            <li><a routerLink="/title" routerLinkActive="active">Title</a></li>
            <li><a routerLink="/subtitle" routerLinkActive="active">Subtitle</a></li>
            <li><a routerLink="/tooltip" routerLinkActive="active">Tooltip</a></li>
          </ul>
        </div>
        <div class="navbar-section">
          <h3>高度な機能</h3>
          <ul>
            <li><a routerLink="/scriptable-options" routerLinkActive="active">Scriptable Options</a></li>
            <li><a routerLink="/animations" routerLinkActive="active">Animations</a></li>
            <li><a routerLink="/advanced" routerLinkActive="active">Advanced</a></li>
            <li><a routerLink="/plugins" routerLinkActive="active">Plugins</a></li>
            <li><a routerLink="/utils" routerLinkActive="active">Utils</a></li>
          </ul>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .navbar-menu {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .navbar-section {
      flex: 1;
      min-width: 200px;
    }
    
    .navbar-section h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      color: #ecf0f1;
      border-bottom: 2px solid #3498db;
      padding-bottom: 0.3rem;
    }
    
    .navbar-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .navbar-section li {
      margin: 0.3rem 0;
    }
    
    .navbar-section a {
      color: #bdc3c7;
      text-decoration: none;
      padding: 0.3rem 0.5rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      display: block;
    }
    
    .navbar-section a:hover {
      background-color: #34495e;
      color: white;
    }
    
    .navbar-section a.active {
      background-color: #3498db;
      color: white;
    }
    
    @media (max-width: 768px) {
      .navbar-menu {
        flex-direction: column;
        gap: 1rem;
      }
      
      .navbar-section {
        min-width: auto;
      }
    }
  `]
})
export class NavigationComponent {
} 
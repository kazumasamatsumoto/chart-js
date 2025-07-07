import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/bar-charts', pathMatch: 'full' },
    { path: 'bar-charts', loadComponent: () => import('./charts/bar-charts/bar-charts.component').then(m => m.BarChartsComponent) },
    { path: 'line-charts', loadComponent: () => import('./charts/line-charts/line-charts.component').then(m => m.LineChartsComponent) },
    { path: 'other-charts', loadComponent: () => import('./charts/other-charts/other-charts.component').then(m => m.OtherChartsComponent) },
    { path: 'area-charts', loadComponent: () => import('./charts/area-charts/area-charts.component').then(m => m.AreaChartsComponent) },
    { path: 'scales', loadComponent: () => import('./options/scales/scales.component').then(m => m.ScalesComponent) },
    { path: 'scale-options', loadComponent: () => import('./options/scale-options/scale-options.component').then(m => m.ScaleOptionsComponent) },
    { path: 'legend', loadComponent: () => import('./options/legend/legend.component').then(m => m.LegendComponent) },
    { path: 'title', loadComponent: () => import('./options/title/title.component').then(m => m.TitleComponent) },
    { path: 'subtitle', loadComponent: () => import('./options/subtitle/subtitle.component').then(m => m.SubtitleComponent) },
    { path: 'tooltip', loadComponent: () => import('./options/tooltip/tooltip.component').then(m => m.TooltipComponent) },
    { path: 'scriptable-options', loadComponent: () => import('./advanced/scriptable-options/scriptable-options.component').then(m => m.ScriptableOptionsComponent) },
    { path: 'animations', loadComponent: () => import('./advanced/animations/animations.component').then(m => m.AnimationsComponent) },
    { path: 'advanced', loadComponent: () => import('./advanced/advanced/advanced.component').then(m => m.AdvancedComponent) },
    { path: 'plugins', loadComponent: () => import('./advanced/plugins/plugins.component').then(m => m.PluginsComponent) },
    { path: 'utils', loadComponent: () => import('./advanced/utils/utils.component').then(m => m.UtilsComponent) },
    { path: '**', redirectTo: '/bar-charts' }
];

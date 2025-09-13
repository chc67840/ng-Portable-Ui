import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DEFAULT_THEMES, DsTheme } from '../lib/organize/ds-draw.component';
import { AppSharedModule } from './app-shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nG-Portable-UI');
  navItems = [
    { label: 'Home', route: '/' },
    { label: 'Docs', route: '/docs' },
    { label: 'About', route: '/about' }
  ];
  // No longer injecting ToastService; HomeComponent owns demo logic
  constructor() { }

  // Drawer & theme state
  drawerOpen = signal(false);
  themes: DsTheme[] = DEFAULT_THEMES;
  currentTheme = signal<DsTheme>(this.themes[0]);

  toggleDrawer() { this.drawerOpen.set(!this.drawerOpen()); }
  onThemeChange(th: DsTheme) { this.currentTheme.set(th); }
}

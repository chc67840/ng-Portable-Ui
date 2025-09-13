import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DsNavTreeComponent, DsNavTreeItem } from '../lib/nav/ds-nav-tree.component';
import { DEFAULT_THEMES, DsTheme } from '../lib/organize/ds-draw.component';
//import { DsThemeToggleComponent } from '../lib/theme/ds-theme-toggle.component';
import { AppSharedModule } from './app-shared.module';
import { NAV_ITEMS } from './navigation/nav-items';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSharedModule, DsNavTreeComponent], //DsThemeToggleComponent
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nG-Portable-UI');
  navItems: DsNavTreeItem[] = NAV_ITEMS;
  // No longer injecting ToastService; HomeComponent owns demo logic
  constructor() { }

  // Drawer & theme state
  drawerOpen = signal(false);
  themes: DsTheme[] = DEFAULT_THEMES; // amber inserted first
  currentTheme = signal<DsTheme>(this.themes[0]); // default amber

  toggleDrawer() { this.drawerOpen.set(!this.drawerOpen()); }
  onThemeChange(th: DsTheme) { this.currentTheme.set(th); }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DsNavTreeComponent, DsNavTreeItem } from '../lib/nav/ds-nav-tree.component';
import { DsSettingsMenuComponent } from '../lib/nav/ds-settings-menu.component';
import { AppSharedModule } from './app-shared.module';
import { NAV_ITEMS } from './navigation/nav-items';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppSharedModule, DsNavTreeComponent, DsSettingsMenuComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nG-Portable-UI');
  navItems: DsNavTreeItem[] = NAV_ITEMS;
  // No longer injecting ToastService; HomeComponent owns demo logic
  constructor() { }

  // Settings menu now handles theme changes; legacy drawer removed.
}

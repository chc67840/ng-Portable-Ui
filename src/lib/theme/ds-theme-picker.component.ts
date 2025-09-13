import { NgClass, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ThemeEngineService } from './theme-engine.service';

@Component({
    selector: 'ds-theme-picker',
    standalone: true,
    imports: [NgFor, NgClass],
    template: `
  <div class="flex items-center gap-2 flex-wrap">
    <button *ngFor="let t of themes" (click)="select(t)" type="button"
      [ngClass]="{'ring-2 ring-[var(--ds-border-focus)]': active===t}" class="relative px-2 py-1 rounded text-xs font-medium border border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-strong)] bg-[var(--ds-bg-subtle)] text-[var(--ds-color-text-primary)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)]">
      <span class="inline-block w-2 h-2 rounded-full mr-1 align-middle" [style.background]="swatch(t)"></span>{{t}}
    </button>
  </div>
  `,
    styles: [`:host{display:block;}`]
})
export class DsThemePickerComponent {
    private engine = inject(ThemeEngineService);
    themes = this.engine.listThemeNames();
    get active() { return this.engine.activeName(); }
    swatch(name: string) { return `var(--ds-color-primary-500)`; }
    select(name: string) { this.engine.setTheme(name); }
}

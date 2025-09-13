import { Component, inject } from '@angular/core';
import { ThemeEngineService } from './theme-engine.service';

@Component({
    selector: 'ds-theme-toggle',
    standalone: true,
    imports: [],
    template: `
  <button type="button" (click)="toggle()" [attr.aria-pressed]="isDark()" class="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-[var(--ds-border-subtle)] hover:border-[var(--ds-border-strong)] bg-[var(--ds-bg-subtle)] text-[var(--ds-color-text-primary)] dark-mode-btn transition-colors" [title]="isDark() ? 'Switch to light theme' : 'Switch to dark theme'">
    <span class="w-4 h-4 inline-block" [innerHTML]="isDark() ? moonIcon : sunIcon"></span>
    <span class="font-medium">{{ isDark() ? 'Dark' : 'Light' }}</span>
  </button>
  `,
    styles: [`:host{display:inline-block;} .dark-mode-btn:focus{outline:2px solid var(--ds-border-focus); outline-offset:2px;}`]
})
export class DsThemeToggleComponent {
    private engine = inject(ThemeEngineService);
    isDark = this.engine.isDark;
    sunIcon = `<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M18.36 5.64l-1.41 1.41'/></svg>`;
    moonIcon = `<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><path d='M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79z'/></svg>`;
    private cycle = ['amber', 'amber-dark', 'light', 'dark', 'ocean', 'primary'];

    toggle() {
        const current = this.engine.activeName();
        const idx = this.cycle.indexOf(current);
        const next = this.cycle[(idx + 1) % this.cycle.length];
        this.engine.setTheme(next);
    }
}

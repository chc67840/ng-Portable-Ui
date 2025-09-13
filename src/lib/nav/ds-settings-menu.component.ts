import { NgClass, NgFor } from '@angular/common';
import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { ThemeEngineService } from '../theme/theme-engine.service';

@Component({
    selector: 'ds-settings-menu',
    standalone: true,
    imports: [NgFor, NgClass],
    template: `
  <div class="relative" (keydown)="onKey($event)">
    <button type="button" class="text-sm px-3 py-1 rounded bg-[var(--ds-color-primary-600)] text-white hover:bg-[var(--ds-color-primary-700)] active:scale-95 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)]" (click)="toggleMenu()" aria-haspopup="true" [attr.aria-expanded]="open()">Settings</button>
    @if(open()){
      <div class="absolute right-0 mt-2 w-56 z-50 rounded-md border border-[var(--ds-border-subtle)] bg-[var(--ds-bg-elevated)] shadow-lg py-1 text-sm animate-fade-in" role="menu">
        <div class="px-3 py-2 font-semibold text-[var(--ds-color-text-secondary)] uppercase tracking-wide text-[10px]">Settings</div>
        <button type="button" class="w-full text-left px-3 py-2 hover:bg-[var(--ds-bg-subtle)] focus:bg-[var(--ds-bg-subtle)] focus:outline-none flex items-center justify-between" (click)="toggleThemes()" [attr.aria-expanded]="themesOpen()" aria-haspopup="true">Themes <span class="text-[10px] opacity-70">{{activeTheme()}}</span></button>
        @if(themesOpen()){
          <div class="pl-2 pb-2" role="group" aria-label="Select theme">
            <div class="max-h-56 overflow-auto pr-1">
              <button *ngFor="let t of themes" type="button" (click)="selectTheme(t)" [ngClass]="{'bg-[var(--ds-color-primary-600)] text-white': t===activeTheme()}" class="block w-full text-left px-3 py-1 rounded hover:bg-[var(--ds-bg-subtle)] focus:bg-[var(--ds-bg-subtle)] focus:outline-none transition-colors">
                <span class="inline-block w-2 h-2 rounded-full mr-2 align-middle bg-[var(--ds-color-primary-500)]"></span>{{t}}
              </button>
            </div>
          </div>
        }
        <div class="border-t border-[var(--ds-border-subtle)] mt-1 pt-1">
          <button type="button" class="w-full text-left px-3 py-2 hover:bg-[var(--ds-bg-subtle)] focus:bg-[var(--ds-bg-subtle)] focus:outline-none" (click)="closeAll()">Close</button>
        </div>
      </div>
    }
  </div>
  `,
    styles: [`:host{display:inline-block;}@keyframes fade-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}.animate-fade-in{animation:fade-in 160ms var(--ds-easing-standard,cubic-bezier(.4,0,.2,1))}`]
})
export class DsSettingsMenuComponent {
    private host = inject(ElementRef<HTMLElement>);
    private themeEngine = inject(ThemeEngineService);
    open = signal(false);
    themesOpen = signal(false);
    themes = this.themeEngine.listThemeNames();
    activeTheme = this.themeEngine.activeName;

    toggleMenu() {
        this.open.update(o => !o);
        if (!this.open()) this.themesOpen.set(false);
    }
    toggleThemes() { this.themesOpen.update(o => !o); }
    selectTheme(t: string) { this.themeEngine.setTheme(t); this.themesOpen.set(false); this.open.set(false); }
    closeAll() { this.themesOpen.set(false); this.open.set(false); }

    @HostListener('document:click', ['$event']) onDocClick(e: Event) {
        if (!this.open()) return;
        if (!this.host.nativeElement.contains(e.target as Node)) this.closeAll();
    }
    @HostListener('document:keydown.escape') onEsc() { if (this.open()) this.closeAll(); }

    onKey(ev: KeyboardEvent) {
        if (!this.open()) return;
        const key = ev.key;
        if (key === 'ArrowDown' || key === 'ArrowUp') {
            ev.preventDefault();
            // Collect interactive buttons inside the open menu (excluding the top-level Settings trigger when already focused)
            const btns = this.host.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
            const all = Array.from(btns);
            // Filter out disabled & empty text nodes; keep visible menu items
            const actionable = all.filter(b => !b.disabled && !!b.textContent?.trim());

            if (!actionable.length) return;
            const currentIndex = actionable.indexOf(ev.target as HTMLButtonElement);
            let nextIndex = 0;
            if (currentIndex === -1) {
                // Nothing focused inside list yet: ArrowDown -> first, ArrowUp -> last
                nextIndex = key === 'ArrowDown' ? 0 : actionable.length - 1;
            } else {
                nextIndex = key === 'ArrowDown' ? (currentIndex + 1) % actionable.length : (currentIndex - 1 + actionable.length) % actionable.length;
            }
            actionable[nextIndex]?.focus();
        }
    }
}

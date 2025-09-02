import { Injectable, signal, computed } from '@angular/core';
import { ENHANCED_FORM_THEMES } from './ds-theme';

export type ThemeName = keyof typeof ENHANCED_FORM_THEMES;

@Injectable({ providedIn: 'root' })
export class DsThemeService {
    private current = signal<ThemeName>('light');
    themeName = this.current.asReadonly();
    theme = computed(() => ENHANCED_FORM_THEMES[this.current()]);

    setTheme(name: ThemeName) {
        if (ENHANCED_FORM_THEMES[name]) this.current.set(name);
    }

    // Nav classes derived (fallbacks retained)
    navWrapper = computed(() => {
        const n = this.theme().nav;
        const height = n?.height || 'h-16';
        return `fixed top-0 left-0 right-0 z-50 ${n?.wrapper || ''} ${n?.border || ''} ${n?.shadow || ''} ${height}`.trim();
    });
    navBrand = computed(() => this.theme().nav?.brand || 'font-semibold tracking-tight select-none');
    navItem = computed(() => this.theme().nav?.item || 'px-4 h-full flex items-center text-sm');
    navItemActive = computed(() => this.theme().nav?.itemActive || 'text-blue-600');
    navItemInactive = computed(() => this.theme().nav?.itemInactive || 'text-gray-600 hover:text-gray-900');
    navItemsContainer = computed(() => this.theme().nav?.itemsContainer || 'flex items-center gap-4');
    navBrandContainer = computed(() => this.theme().nav?.brandContainer || 'flex items-center px-4');
    navRightContainer = computed(() => this.theme().nav?.rightContainer || 'flex items-center gap-2 pr-4 ml-auto');

    controlLabel = computed(() => this.theme().control?.label || 'block text-sm font-medium mb-1');
    controlInput = computed(() => this.theme().control?.input || 'w-full rounded border px-2 py-1 text-sm');
    // New: underline-only filled style baseline
    controlInputUnderlineFilled = computed(() => this.theme().control?.inputUnderlineFilled || 'w-full bg-slate-100/70 px-2 py-2 text-sm border-b border-slate-300 focus:border-slate-500 transition-colors');
}
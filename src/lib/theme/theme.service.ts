import { DestroyRef, Injectable, Signal, WritableSignal, effect, inject, signal } from '@angular/core';
import { DsTheme, DsThemeControlStyles, DsThemeLayoutStyles, DsThemeNavStyles, DsThemeSectionStyles } from '../ds.model';
import { DS_DEFAULT_THEME, DS_THEME_REGISTRY } from './theme.tokens';

export interface DsActiveThemeState {
    name: string;
    theme: DsTheme | null;
}

@Injectable({ providedIn: 'root' })
export class DsThemeService {
    private registry = inject(DS_THEME_REGISTRY);
    private defaultName = inject(DS_DEFAULT_THEME);
    private _active: WritableSignal<DsActiveThemeState> = signal({ name: this.defaultName, theme: null });
    active: Signal<DsActiveThemeState> = this._active.asReadonly();

    constructor() {
        // initialize
        const initial = this.resolveTheme(this.defaultName);
        this._active.set({ name: this.defaultName, theme: initial });
        effect(() => {
            const state = this._active();
            if (state.theme) this.applyTheme(state.theme);
        });
    }

    register(name: string, theme: DsTheme) {
        (this.registry as any)[name] = theme;
        if (!this._active().theme && name === this.defaultName) {
            this._active.set({ name, theme });
        }
    }

    setTheme(name: string, overrides?: Partial<DsTheme>) {
        const base = this.resolveTheme(name);
        const merged = base ? this.mergeTheme(base, overrides) : overrides as DsTheme;
        this._active.set({ name, theme: merged });
    }

    updateOverrides(patch: Partial<DsTheme>) {
        const current = this._active();
        if (!current.theme) return;
        this._active.set({ name: current.name, theme: this.mergeTheme(current.theme, patch) });
    }

    getTheme(): DsTheme | null { return this._active().theme; }
    getThemeName(): string { return this._active().name; }

    private resolveTheme(name: string): DsTheme | null {
        return (this.registry && (this.registry as any)[name]) || null;
    }

    private mergeTheme(base: DsTheme, overrides?: Partial<DsTheme>): DsTheme {
        if (!overrides) return base;
        return {
            ...base,
            ...overrides,
            layout: { ...base.layout, ...overrides.layout } as DsThemeLayoutStyles,
            section: { ...base.section, ...overrides.section } as DsThemeSectionStyles,
            control: { ...base.control, ...overrides.control } as DsThemeControlStyles,
            nav: { ...base.nav, ...overrides.nav } as DsThemeNavStyles,
            tokens: { ...(base.tokens || {}), ...(overrides.tokens || {}) },
            extra: { ...(base.extra || {}), ...(overrides.extra || {}) }
        };
    }

    private applyTheme(theme: DsTheme) {
        const root = document.documentElement;
        // data-theme attribute for CSS selectors
        root.setAttribute('data-theme', theme.name);
        // tokens → CSS variables
        if (theme.tokens) {
            for (const [k, v] of Object.entries(theme.tokens)) {
                if (v == null) continue;
                root.style.setProperty(`--${k}`, String(v));
            }
        }
    }
}

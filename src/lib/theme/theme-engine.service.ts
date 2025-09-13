import { Injectable, computed, effect, signal } from '@angular/core';
import { ThemeDefinition, buildComponentTokens } from './tokens/component-tokens';
import { SEMANTIC_THEMES } from './tokens/semantic-tokens';

@Injectable({ providedIn: 'root' })
export class ThemeEngineService {
    private themes = new Map<string, ThemeDefinition>();
    private _active = signal<string>('light');
    activeName = this._active.asReadonly();
    active = computed(() => this.themes.get(this._active())!);

    constructor() {
        // Build default themes from semantic tokens
        for (const meta of SEMANTIC_THEMES) {
            const def: ThemeDefinition = {
                name: meta.name,
                semantic: meta.semantic,
                components: buildComponentTokens(meta.semantic)
            };
            this.themes.set(meta.name, def);
        }
        // Apply initial
        effect(() => {
            const theme = this.active();
            this.applyTheme(theme);
        });
    }

    listThemeNames(): string[] { return Array.from(this.themes.keys()); }

    setTheme(name: string) {
        if (!this.themes.has(name)) return;
        this._active.set(name);
    }

    registerTheme(def: ThemeDefinition) {
        this.themes.set(def.name, def);
    }

    private applyTheme(theme: ThemeDefinition) {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme.name);
        // Build CSS variable text
        const lines: string[] = [];
        const s = theme.semantic;
        // Colors scales
        const colorScales: any = s.colors;
        const scaleKeys = ['primary', 'neutral', 'success', 'warning', 'danger', 'info', 'accent'];
        scaleKeys.forEach(key => {
            const scale = (colorScales as any)[key];
            if (!scale) return;
            Object.entries(scale).forEach(([k, v]) => lines.push(`--ds-color-${key}-${k}: ${v};`));
        });
        // Text roles
        lines.push(`--ds-color-text-primary: ${s.colors.text.primary};`);
        lines.push(`--ds-color-text-secondary: ${s.colors.text.secondary};`);
        lines.push(`--ds-color-text-inverse: ${s.colors.text.inverse};`);
        // BG roles
        lines.push(`--ds-bg-base: ${s.colors.bg.base};`);
        lines.push(`--ds-bg-subtle: ${s.colors.bg.subtle};`);
        lines.push(`--ds-bg-elevated: ${s.colors.bg.elevated};`);
        lines.push(`--ds-bg-overlay: ${s.colors.bg.overlay};`);
        // Border roles
        lines.push(`--ds-border-subtle: ${s.colors.border.subtle};`);
        lines.push(`--ds-border-strong: ${s.colors.border.strong};`);
        lines.push(`--ds-border-focus: ${s.colors.border.focus};`);
        // Radii
        Object.entries(s.radii).forEach(([k, v]) => lines.push(`--ds-radius-${k}: ${v};`));
        // Spacing
        Object.entries(s.spacing).forEach(([k, v]) => lines.push(`--ds-space-${k}: ${v};`));
        // Typography
        lines.push(`--ds-font-family: ${s.typography.fontFamily};`);
        Object.entries(s.typography.scale).forEach(([k, v]) => lines.push(`--ds-font-size-${k}: ${v};`));
        lines.push(`--ds-line-height: ${s.typography.lineHeight};`);
        Object.entries(s.typography.weight).forEach(([k, v]) => lines.push(`--ds-font-weight-${k}: ${v};`));
        // Elevation
        Object.entries(s.elevation).forEach(([k, v]) => lines.push(`--ds-shadow-${k}: ${v};`));
        // Motion
        Object.entries(s.motion.duration).forEach(([k, v]) => lines.push(`--ds-duration-${k}: ${v};`));
        Object.entries(s.motion.easing).forEach(([k, v]) => lines.push(`--ds-easing-${k}: ${v};`));

        this.injectRootVariables(lines.join('\n'));
    }

    private styleEl?: HTMLStyleElement;
    private injectRootVariables(css: string) {
        if (!this.styleEl) {
            this.styleEl = document.createElement('style');
            this.styleEl.id = 'ds-theme-vars';
            document.head.appendChild(this.styleEl);
        }
        this.styleEl.textContent = `:root[data-theme="${this._active()}"]{${css}}`;
    }
}

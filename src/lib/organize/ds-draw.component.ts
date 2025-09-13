import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { ThemeEngineService } from '../theme/theme-engine.service';
import { WA_TAGS } from '../wa-registry';

// Theme model (extensible)
export interface DsTheme {
    name: string;
    primary: string;           // base primary color class (bg-*)
    primaryText: string;       // text color on primary
    surface: string;           // surface background
    surfaceText: string;       // surface text color
    border: string;            // border color
    accent?: string;           // optional accent
    muted?: string;            // subtle background
}

// Theme picker options align with ENHANCED_FORM_THEMES keys so selecting updates global theme
export const DEFAULT_THEMES: DsTheme[] = [
    { name: 'amber', primary: 'bg-amber-500', primaryText: 'text-white/85', surface: 'bg-amber-50', surfaceText: 'text-amber-900', border: 'border-amber-300', accent: 'bg-amber-100', muted: 'bg-amber-50' },
    { name: 'light', primary: 'bg-indigo-600', primaryText: 'text-white', surface: 'bg-white', surfaceText: 'text-slate-800', border: 'border-slate-200', accent: 'bg-indigo-100', muted: 'bg-slate-50' },
    { name: 'dark', primary: 'bg-indigo-500', primaryText: 'text-white', surface: 'bg-gray-900', surfaceText: 'text-gray-100', border: 'border-gray-700', accent: 'bg-gray-700', muted: 'bg-gray-800' },
    { name: 'ocean', primary: 'bg-sky-600', primaryText: 'text-white', surface: 'bg-sky-50', surfaceText: 'text-sky-900', border: 'border-sky-300', accent: 'bg-sky-100', muted: 'bg-sky-100' },
    { name: 'primary', primary: 'bg-blue-600', primaryText: 'text-white', surface: 'bg-neutral-50', surfaceText: 'text-neutral-900', border: 'border-neutral-300', accent: 'bg-blue-100', muted: 'bg-neutral-100' }
];

@Component({
    selector: 'ds-draw',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
            <wa-drawer
                #drawerEl
                side="right"
                class="fixed inset-y-0 right-0 w-80 max-w-[85vw] z-50 shadow-xl border-l flex flex-col bg-white"
                >
                <div class="px-4 py-3 flex items-center gap-2 border-b" [ngClass]="borderClass()">
                    <h2 class="text-sm font-semibold tracking-wide uppercase">Theme Drawer</h2>
                    <button type="button" class="ml-auto text-xs px-2 py-1 rounded border" [ngClass]="borderClass()" (click)="close()">Close</button>
                </div>
                <div class="p-4 space-y-6 overflow-y-auto flex-1" [ngClass]="panelClasses()">
                    <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">Primary</h3>
                    <div class="flex flex-wrap gap-2">
                        <button *ngFor="let th of themes" type="button" (click)="selectTheme(th)" class="px-3 py-2 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 ring-offset-2 ring-offset-white" [ngClass]="primaryButtonClasses(th)">{{ th.name }}</button>
                    </div>
                    </div>
                    <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">Surface Shape</h3>
                    <div class="flex gap-2 flex-wrap">
                        <button *ngFor="let r of radii" type="button" (click)="setRadius(r)" [class]="surfaceButtonBase()" [ngClass]="{ 'ring-2 ring-indigo-500': radius() === r }" class="px-3 py-1 text-xs font-medium rounded border">{{ r }}</button>
                    </div>
                    </div>
                    <div>
                    <h3 class="text-xs font-semibold uppercase tracking-wide mb-2 opacity-70">Preview</h3>
                    <div class="p-4 border rounded-md space-y-3" [ngClass]="previewContainerClasses()">
                        <div class="text-sm font-medium">Current: {{ currentTheme().name }}</div>
                        <div class="flex gap-2">
                        <span class="px-2 py-1 rounded text-xs" [ngClass]="currentTheme().primary + ' ' + currentTheme().primaryText">Primary</span>
                        <span class="px-2 py-1 rounded text-xs border" [ngClass]="borderClass()">Border</span>
                        <span class="px-2 py-1 rounded text-xs" [ngClass]="currentTheme().accent">Accent</span>
                        </div>
                    </div>
                    </div>
                </div>
            </wa-drawer>
  `,
    styles: [`:host{display:contents}`]
})
export class DsDrawComponent implements AfterViewInit {
    private engine = inject(ThemeEngineService);
    drawerTag = WA_TAGS.drawer;
    // Open state
    private _open = signal(false);
    private _commandedAt = 0; // timestamp of last explicit command
    open = this._open.asReadonly();
    @Input() set opened(v: boolean) { this.setOpen(v); }
    @Output() openedChange = new EventEmitter<boolean>();
    @Output() afterOpen = new EventEmitter<void>();
    @Output() afterClose = new EventEmitter<void>();

    @ViewChild('drawerEl', { static: false }) drawerRef?: ElementRef<HTMLElement & { open?: boolean; }>;

    // Themes
    @Input() themes: DsTheme[] = DEFAULT_THEMES;
    private _theme = signal<DsTheme>(DEFAULT_THEMES[0]);
    currentTheme = this._theme.asReadonly();

    // Surface shape (radius)
    radii: string[] = ['none', 'sm', 'md', 'lg', 'xl', 'full'];
    radius = signal<string>('md');

    // Public API methods
    ngAfterViewInit() {
        this.syncDom();
        const el = this.drawerRef?.nativeElement;
        if (el) {
            el.addEventListener('wa-opened', () => this.afterOpen.emit());
            el.addEventListener('wa-closed', () => this.afterClose.emit());
        }
    }

    private setOpen(v: boolean) {
        const bool = !!v;
        if (this._open() === bool) {
            const el = this.drawerRef?.nativeElement as any;
            if (!el) return;
            if (el.open && el.hasAttribute('open')) el.removeAttribute('open');
        }
        this._commandedAt = performance.now();
        this._open.set(bool);
        this.syncDom();
        this.openedChange.emit(this._open());
    }

    private syncDom() {
        const el = this.drawerRef?.nativeElement as any;
        if (!el) return;
        const shouldOpen = this._open();
        // Apply both property & attribute for maximum compatibility
        if (shouldOpen) {
            el.open = true;
            if (!el.hasAttribute('open')) el.setAttribute('open', '');
        } else {
            el.open = false;
            if (el.hasAttribute('open')) el.removeAttribute('open');
        }
    }

    show() { this.setOpen(true); }
    close() {
        this.setOpen(false);
        // Defensive: ensure drawer visually closes if component ignores property
        const el = this.drawerRef?.nativeElement as any;
        if (el) {
            el.open = false;
            if (el.hasAttribute('open')) el.removeAttribute('open');
            // Optional fallback style
            el.style.translate = '100%';
        }
    }
    toggle() { this.setOpen(!this._open()); }

    selectTheme(th: DsTheme) {
        this._theme.set(th);
        this.themeChange.emit(th);
        // Apply to new token engine (data-theme attribute + vars)
        this.engine.setTheme(th.name);
    }

    setRadius(r: string) { this.radius.set(r); this.radiusChange.emit(r); }

    // Removed transitionend placeholder; relying on wa-opened / wa-closed custom events.

    @Output() themeChange = new EventEmitter<DsTheme>();
    @Output() radiusChange = new EventEmitter<string>();

    // Classes
    panelClasses = computed(() => [
        this.currentTheme().surface,
        this.currentTheme().surfaceText,
        this.currentTheme().border,
        'transition-colors',
        // Preview selected radius via data attr
        this.radiusClass()
    ].join(' '));

    private radiusClass() {
        const r = this.radius();
        switch (r) {
            case 'none': return 'rounded-none';
            case 'sm': return 'rounded';
            case 'md': return 'rounded-md';
            case 'lg': return 'rounded-lg';
            case 'xl': return 'rounded-xl';
            case 'full': return 'rounded-full';
            default: return 'rounded-md';
        }
    }

    borderClass() { return this.currentTheme().border; }
    surfaceButtonBase() { return 'px-3 py-1 rounded-md border text-xs font-medium hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition'; }

    primaryButtonClasses = (th: DsTheme) => [
        'min-w-16 text-center',
        th.primary,
        th.primaryText,
        'rounded-md',
        'hover:brightness-105 active:scale-95',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500',
        this._theme().name === th.name ? 'ring-2 ring-offset-2 ring-indigo-500' : 'ring-0'
    ].join(' ');

    previewContainerClasses = () => [
        this.currentTheme().muted,
        this.currentTheme().border
    ].filter(Boolean).join(' ');
}

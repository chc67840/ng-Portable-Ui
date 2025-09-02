import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-tab-group: wrapper for <wa-tab-group>, with optional dynamic tab + panel generation.
 * Slots:
 *  - nav (auto set by <wa-tab>)
 *  - default (tab panels)
 * Attributes/Props:
 *  - active, placement(top|bottom|start|end), activation(auto|manual), withoutScrollControls
 * Events:
 *  - wa-tab-show, wa-tab-hide (exposed as showEvent/hideEvent)
 * CSS Custom Properties: --indicator-color, --track-color, --track-width via cssVars.
 * CSS Parts: base, nav, tabs, body, scroll-button(+ variants)
 * Dynamic Features: manual activation toggle, scroll controls toggle, closable tabs (optional), programmatic active change, different placements.
 */
@Component({
    selector: 'ds-tab-group',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-tab-group #el
      [class]="groupClass"
      [attr.active]="active || null"
      [attr.placement]="placement"
      [attr.activation]="activation"
      [attr.without-scroll-controls]="withoutScrollControls ? '' : null"
      (wa-tab-show)="onShow($event)"
      (wa-tab-hide)="onHide($event)"
    >
      <!-- Projected custom tabs (nav slot) -->
      <ng-content select="wa-tab"></ng-content>
      <!-- Dynamically generated tabs -->
      <ng-container *ngFor="let tab of tabs; let i = index">
        <wa-tab *ngIf="tabs?.length" [attr.panel]="tab.name" [attr.disabled]="tab.disabled ? '' : null">
          <span class="inline-flex items-center gap-1">
            <span [innerHTML]="tab.icon || ''"></span>
            {{ tab.label }}
            <button *ngIf="tab.closable" type="button" class="ml-1 text-xs opacity-60 hover:opacity-100" (click)="closeTab(tab.name, $event)">×</button>
          </span>
        </wa-tab>
      </ng-container>

      <!-- Panels (default slot) -->
      <ng-content select="wa-tab-panel"></ng-content>
      <ng-container *ngFor="let tab of tabs">
        <wa-tab-panel *ngIf="tabs?.length" [attr.name]="tab.name" [attr.active]="active === tab.name ? '' : null">
          <div [innerHTML]="tab.content"></div>
        </wa-tab-panel>
      </ng-container>
    </wa-tab-group>
  `,
    styles: [`:host{display:block}`]
})
export class DsTabGroupComponent implements OnChanges {
    static readonly tag = WA_TAGS.tabGroup;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaTabGroupEl>;

    // Core inputs
    @Input() active?: string; // active tab name
    @Input() placement: 'top' | 'bottom' | 'start' | 'end' = 'top';
    @Input() activation: 'auto' | 'manual' = 'auto';
    @Input() withoutScrollControls = false;

    // Dynamic tab set
    @Input() tabs: DsDynamicTab[] = [];

    // Style hooks
    @Input() groupClass = '';
    @Input() cssVars?: Record<string, string | number | null>; // --indicator-color, --track-color, --track-width

    // Outputs
    @Output() activeChange = new EventEmitter<string>();
    @Output() tabShowEvent = new EventEmitter<CustomEvent<{ name: string }>>();
    @Output() tabHideEvent = new EventEmitter<CustomEvent<{ name: string }>>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['active'] && !changes['active'].firstChange) this.syncActive();
    }
    ngAfterViewInit() {
        this.applyCssVars();
        this.syncActive();
    }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    private syncActive() {
        const el = this.el?.nativeElement as any;
        if (!el || !this.active) return;
        el.active = this.active;
        if (!el.hasAttribute('active')) el.setAttribute('active', this.active);
    }

    onShow(e: Event) {
        const ce = e as CustomEvent<{ name: string }>;
        this.tabShowEvent.emit(ce);
        this.active = ce.detail.name;
        this.activeChange.emit(this.active);
    }
    onHide(e: Event) { this.tabHideEvent.emit(e as CustomEvent<{ name: string }>); }

    /** Programmatically set active tab */
    setActive(name: string) {
        this.active = name;
        this.syncActive();
        this.activeChange.emit(name);
    }

    /** Close a dynamic tab */
    closeTab(name: string, ev: Event) {
        ev.stopPropagation();
        const idx = this.tabs.findIndex(t => t.name === name);
        if (idx >= 0) {
            const wasActive = this.tabs[idx].name === this.active;
            this.tabs.splice(idx, 1);
            // Force change detection by cloning array
            this.tabs = [...this.tabs];
            if (wasActive && this.tabs.length) {
                this.setActive(this.tabs[Math.max(0, idx - 1)].name);
            }
        }
    }
}

export interface DsDynamicTab {
    name: string;        // unique id
    label: string;       // visible text
    content: string;     // HTML content
    icon?: string;       // optional icon HTML
    disabled?: boolean;
    closable?: boolean;
}

interface WaTabGroupEl extends HTMLElement {
    active: string;
    placement: 'top' | 'bottom' | 'start' | 'end';
    activation: 'auto' | 'manual';
    withoutScrollControls: boolean;
}

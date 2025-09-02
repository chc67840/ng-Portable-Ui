import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ds-details: wrapper around <wa-details> exposing full API.
 * Slots: summary, expand-icon, collapse-icon, default content.
 * Attributes/Props: open, summary, name, disabled, appearance (filled|outlined|plain), iconPosition (start|end).
 * Methods: show(), hide(), toggle().
 * Events: wa-show, wa-after-show, wa-hide, wa-after-hide (mapped to outputs) + openChange two-way.
 * CSS Custom Properties: --spacing, --show-duration, --hide-duration (accept via cssVars input map).
 * CSS Parts: base, header, summary, icon, content (style with ::part()).
 * Custom States: :state(animating) handled internally by WA (no direct binding needed).
 */
@Component({
    selector: 'ds-details',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <wa-details #el
    [attr.open]="open ? '' : null"
    [attr.summary]="summaryAttr"
    [attr.name]="name || null"
    [attr.disabled]="disabled ? '' : null"
    [attr.appearance]="appearance"
    [attr.icon-position]="iconPosition"
    [class]="wrapperClass"
    (wa-show)="onShow($event)"
    (wa-after-show)="onAfterShow($event)"
    (wa-hide)="onHide($event)"
    (wa-after-hide)="onAfterHide($event)"
  >
    <ng-content select="[slot=summary]"></ng-content>
    <ng-content select="[slot=expand-icon]"></ng-content>
    <ng-content select="[slot=collapse-icon]"></ng-content>
    <ng-content></ng-content>
  </wa-details>
  `,
    styles: [`:host{display:block}`]
})
export class DsDetailsComponent implements OnChanges {
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaDetailsEl>;

    // Inputs
    @Input() open = false;
    @Input() summary?: string; // text summary
    @Input() name?: string;
    @Input() disabled = false;
    @Input() appearance: 'filled' | 'outlined' | 'plain' = 'plain';
    @Input() iconPosition: 'start' | 'end' = 'start';
    @Input() wrapperClass = 'border border-slate-200 rounded-md bg-white [&::part(header)]:px-3 [&::part(header)]:py-2 [&::part(content)]:px-3 [&::part(content)]:pb-3';
    @Input() set cssVars(v: Record<string, string | number | null> | undefined) { this.applyCssVars(v); }

    get summaryAttr(): string | null { return this.summary && !this.hasProjectedSummary ? this.summary : null; }
    // Track if a projected summary slot exists (simple heuristic after view init)
    private hasProjectedSummary = false;

    // Outputs
    @Output() openChange = new EventEmitter<boolean>();
    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();

    ngOnChanges(ch: SimpleChanges) {
        if (ch['open'] && !ch['open'].firstChange) this.syncOpen();
    }

    ngAfterViewInit() {
        // Detect summary slot content
        this.hasProjectedSummary = this.el.nativeElement.querySelector('[slot=summary]') != null;
        this.syncOpen();
    }

    private syncOpen() {
        const el = this.el?.nativeElement as WaDetailsEl;
        if (!el) return;
        if (this.open && !el.open) el.show?.();
        else if (!this.open && el.open) el.hide?.();
    }

    private applyCssVars(vars?: Record<string, string | number | null>) {
        if (!vars) return;
        const el = this.el?.nativeElement as HTMLElement | undefined;
        if (!el) return;
        for (const [k, v] of Object.entries(vars)) {
            if (v == null) el.style.removeProperty(k); else el.style.setProperty(k, String(v));
        }
    }

    // Event handlers
    onShow(e: Event) { this.showEvent.emit(e); this.openChange.emit(true); }
    onAfterShow(e: Event) { this.afterShowEvent.emit(e); }
    onHide(e: Event) { this.hideEvent.emit(e); this.openChange.emit(false); }
    onAfterHide(e: Event) { this.afterHideEvent.emit(e); }

    // Public API
    show() { (this.el.nativeElement as WaDetailsEl).show?.(); }
    hide() { (this.el.nativeElement as WaDetailsEl).hide?.(); }
    toggle() { this.open ? this.hide() : this.show(); }
}

interface WaDetailsEl extends HTMLElement {
    open: boolean;
    show?: () => Promise<void> | void;
    hide?: () => Promise<void> | void;
}

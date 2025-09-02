import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnChanges, SimpleChanges, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-popover: Wrapper for <wa-popover>
 * Vendor attributes/properties: open, placement, distance, skidding, for (anchor id), withoutArrow
 * Slots: default (content)
 * CSS Parts: dialog, body, popup, popup__popup, popup__arrow
 * CSS Vars: --arrow-size, --max-width, --show-duration, --hide-duration
 * Exposed Outputs: showEvent, afterShowEvent, hideEvent, afterHideEvent, openChange
 * Methods: show(), hide(), toggle(), focusFirst()
 * Dynamic features added:
 *  - Anchor assignment via anchorEl Input (ElementRef) or anchorId (maps to for attribute)
 *  - maxWidth, arrowSize convenience Inputs (map to css vars)
 *  - autoFocus: focus first focusable element on show
 *  - openDelay/closeDelay (simple timers before show/hide if set)
 */
@Component({
    selector: 'ds-popover',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-popover #el
      [attr.open]="open ? '' : null"
      [attr.placement]="placement"
      [attr.distance]="distance"
      [attr.skidding]="skidding"
      [attr.for]="forId"
      [attr.without-arrow]="withoutArrow ? '' : null"
      (wa-show)="handleShow($event)"
      (wa-after-show)="afterShowEvent.emit($event)"
      (wa-hide)="handleHide($event)"
      (wa-after-hide)="afterHideEvent.emit($event)"
    >
      <div class="p-3" [class.max-w-full]="!maxWidth" [style.maxWidth]="maxWidth || null">
        <ng-content></ng-content>
      </div>
    </wa-popover>
  `
})
export class DsPopoverComponent implements AfterViewInit, OnChanges {
    static readonly tag = WA_TAGS.popover;
    @ViewChild('el') elRef!: ElementRef<HTMLElement>;

    // Core vendor
    @Input({ transform: booleanAttribute }) open = false;
    @Input() placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' = 'bottom-start';
    @Input() distance = 4;
    @Input() skidding = 0;
    @Input() forId: string | null = null; // maps to 'for'
    @Input({ transform: booleanAttribute }) withoutArrow = false;

    // Dynamic convenience
    @Input() anchorEl?: HTMLElement | null; // if provided sets for attribute id automatically
    @Input() maxWidth?: string; // e.g. '20rem'
    @Input() arrowSize?: string; // css var mapping
    @Input({ transform: booleanAttribute }) autoFocus = false;
    @Input() openDelay = 0; // ms
    @Input() closeDelay = 0; // ms
    @Input() cssVars?: Record<string, string | number | null>;

    // Outputs
    @Output() openChange = new EventEmitter<boolean>();
    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();

    private showTimer: any; private hideTimer: any;

    ngAfterViewInit() { this.applyCssVars(); this.resolveAnchor(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['cssVars'] || ch['arrowSize'] || ch['maxWidth']) queueMicrotask(() => this.applyCssVars());
        if (ch['anchorEl'] || ch['forId']) this.resolveAnchor();
        if (ch['open']) this.syncOpen();
    }

    private resolveAnchor() {
        if (this.anchorEl) {
            if (!this.anchorEl.id) this.anchorEl.id = 'ds-popover-anchor-' + Math.random().toString(36).slice(2);
            this.forId = this.anchorEl.id;
        }
    }

    private applyCssVars() {
        const el = this.elRef?.nativeElement as HTMLElement | null; if (!el) return; const style = el.style;
        const allVars: Record<string, string | number | undefined> = {
            ...(this.cssVars || {}),
            ...(this.arrowSize ? { '--arrow-size': this.arrowSize } : {}),
            ...(this.maxWidth ? { '--max-width': this.maxWidth } : {})
        };
        for (const [k, v] of Object.entries(allVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    private syncOpen() {
        const el = this.elRef?.nativeElement; if (!el) return;
        if (this.open) el.setAttribute('open', ''); else el.removeAttribute('open');
    }

    // Public methods
    show() { if (this.showTimer) clearTimeout(this.showTimer); if (this.hideTimer) clearTimeout(this.hideTimer); if (this.open) return; this.showTimer = setTimeout(() => { this.open = true; this.syncOpen(); }, this.openDelay); }
    hide() { if (this.showTimer) clearTimeout(this.showTimer); if (this.hideTimer) clearTimeout(this.hideTimer); if (!this.open) return; this.hideTimer = setTimeout(() => { this.open = false; this.syncOpen(); }, this.closeDelay); }
    toggle() { this.open ? this.hide() : this.show(); }
    focusFirst() {
        const panel = this.elRef?.nativeElement?.querySelector('[part="body"], .p-3') as HTMLElement | null;
        if (!panel) return; const focusable = panel.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        focusable?.focus();
    }

    handleShow(e: Event) { this.showEvent.emit(e); this.openChange.emit(true); if (this.autoFocus) queueMicrotask(() => this.focusFirst()); }
    handleHide(e: Event) { this.hideEvent.emit(e); this.openChange.emit(false); }
}

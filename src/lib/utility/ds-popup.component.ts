import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '..//wa-registry';

/**
 * ds-popup: wrapper around <wa-popup>.
 * Maps Angular-friendly Inputs to WA popup's properties (active, placement, distance, etc.).
 * Simplifies control of visibility via [open] binding (alias of WA's 'active').
 * Provides reposition event passthrough and method proxy.
 */
@Component({
    selector: 'ds-popup',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-popup #el
        [class]="wrapperClass"
        [attr.anchor]="anchor || null"
        [attr.active]="open ? '' : null"
        [attr.placement]="placement"
        [attr.boundary]="boundary"
        [attr.distance]="distance != null ? distance : null"
        [attr.skidding]="skidding != null ? skidding : null"
        [attr.arrow]="arrow ? '' : null"
        [attr.arrow-placement]="arrowPlacement"
        [attr.arrow-padding]="arrowPadding != null ? arrowPadding : null"
        [attr.flip]="flip ? '' : null"
        [attr.flip-fallback-placements]="flipFallbackPlacements || null"
        [attr.flip-fallback-strategy]="flipFallbackStrategy"
        [attr.flip-boundary]="flipBoundary || null"
        [attr.flip-padding]="flipPadding != null ? flipPadding : null"
        [attr.shift]="shift ? '' : null"
        [attr.shift-boundary]="shiftBoundary || null"
        [attr.shift-padding]="shiftPadding != null ? shiftPadding : null"
        [attr.auto-size]="autoSize || null"
        [attr.sync]="sync || null"
        [attr.auto-size-boundary]="autoSizeBoundary || null"
        [attr.auto-size-padding]="autoSizePadding != null ? autoSizePadding : null"
        [attr.hover-bridge]="hoverBridge ? '' : null"
        (wa-reposition)="onReposition($event)"
    >
        <!-- Slots: default popup content; provide anchor via 'anchor' slot if not using external anchor selector -->
        <ng-content></ng-content>
        <ng-content select="[slot=anchor]"></ng-content>
    </wa-popup>
  `,
    styles: [`:host{display:contents}`]
})
export class DsPopupComponent implements OnChanges {
    static readonly tag = 'wa-popup';
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    // Visibility (alias to WA 'active')
    @Input() open = false;
    // Core positioning / behavior (mirror WA props)
    @Input() anchor?: string | Element; // element id (#id) or element
    @Input() placement: WaPlacement = 'bottom';
    @Input() boundary: 'viewport' | 'scroll' = 'viewport';
    @Input() distance: number = 0; // offset away from anchor
    @Input() skidding: number = 0; // offset along anchor
    @Input() arrow = false;
    @Input() arrowPlacement: 'start' | 'end' | 'center' | 'anchor' = 'anchor';
    @Input() arrowPadding: number = 0;
    @Input() flip = true;
    @Input() flipFallbackPlacements?: string; // space separated list
    @Input() flipFallbackStrategy: 'best-fit' | 'initial' = 'best-fit';
    @Input() flipBoundary?: string; // selector or id (pass through)
    @Input() flipPadding: number = 0;
    @Input() shift = true;
    @Input() shiftBoundary?: string;
    @Input() shiftPadding: number = 0;
    @Input() autoSize?: 'horizontal' | 'vertical' | 'both';
    @Input() sync?: 'width' | 'height' | 'both';
    @Input() autoSizeBoundary?: string;
    @Input() autoSizePadding: number = 0;
    @Input() hoverBridge = false;

    // Styling hook: apply classes to host element; use ::part(popup)/(arrow) in global styles for deep styling
    @Input() wrapperClass = '';

    // CSS custom properties applied to element (k => value) e.g. { '--arrow-size': '10px' }
    @Input() cssVars: Record<string, string | number | null> | undefined;

    // Outputs
    @Output() openChange = new EventEmitter<boolean>();
    @Output() repositionEvent = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['anchor']) this.applyAnchor();
        if (changes['open'] && !changes['open'].firstChange) this.syncOpen();
    }

    ngAfterViewInit() {
        this.applyCssVars();
        this.applyAnchor();
        this.syncOpen();
    }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    private syncOpen() {
        const el = this.el?.nativeElement as any;
        if (!el) return;
        if (this.open) {
            el.active = true;
            if (!el.hasAttribute('active')) el.setAttribute('active', '');
        } else {
            el.active = false;
            if (el.hasAttribute('active')) el.removeAttribute('active');
        }
    }

    private applyAnchor() {
        const el: any = this.el?.nativeElement;
        if (!el) return;
        let a = this.anchor as any;
        if (typeof a === 'string') {
            // remove leading # if provided
            if (a.startsWith('#')) a = a.slice(1);
            el.anchor = a; // WA will resolve string as id
        } else if (a instanceof HTMLElement) {
            el.anchor = a;
        }
    }

    onReposition(e: Event) { this.repositionEvent.emit(e); }

    // Public API
    show() { this.open = true; this.syncOpen(); this.openChange.emit(true); }
    hide() { this.open = false; this.syncOpen(); this.openChange.emit(false); }
    toggle() { this.open ? this.hide() : this.show(); }
    reposition() { (this.el?.nativeElement as any)?.reposition?.(); }
}

type WaPlacement = 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';

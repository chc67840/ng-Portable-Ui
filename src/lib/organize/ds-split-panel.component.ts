import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-split-panel: wrapper for <wa-split-panel> exposing full API surface.
 * Slots: start, end, divider.
 * Attributes/Props: position (percentage), positionInPixels (readonly reflect), orientation (horizontal|vertical), disabled, primary(start|end), snap (space-separated), snapThreshold.
 * Events: wa-reposition → repositionEvent.
 * CSS Custom Properties: --divider-width, --divider-hit-area, --min, --max (provided via cssVars map). Additional dynamic theming can hook into class names.
 * CSS Parts: start, end, panel, divider (style via ::part()).
 */
@Component({
    selector: 'ds-split-panel',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
        <wa-split-panel #el
            [class]="panelClass"
            [attr.position]="position != null ? position : null"
            [attr.orientation]="orientation"
            [attr.disabled]="disabled ? '' : null"
            [attr.primary]="primary || null"
            [attr.snap]="snap || null"
            [attr.snap-threshold]="snapThreshold != null ? snapThreshold : null"
            (wa-reposition)="onReposition($event)"
        >
            <!-- Slotted panels; we wrap to inject Tailwind classes while preserving slot semantics -->
            <div slot="start" [class]="startClass">
                <ng-content select="[slot=start]"></ng-content>
            </div>
            <div slot="divider" [class]="computedDividerClass">
                <ng-content select="[slot=divider]"></ng-content>
            </div>
            <div slot="end" [class]="endClass">
                <ng-content select="[slot=end]"></ng-content>
            </div>
        </wa-split-panel>
  `,
    styles: [`:host{display:block;min-width:0;min-height:0}`]
})
export class DsSplitPanelComponent implements OnChanges {
    static readonly tag = WA_TAGS.splitPanel;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaSplitPanelEl>;

    // Inputs (mirroring WA attributes/props)
    @Input() position: number | null = null; // percent 0-100
    // positionInPixels is read-only externally but can be observed via (repositionEvent.detail)
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    @Input() disabled = false;
    @Input() primary?: 'start' | 'end';
    @Input() snap?: string; // e.g. "100px 50%"
    @Input() snapThreshold: number = 5;

    // Class hooks
    // NOTE: Avoid flex/grid sizing on slotted panels; WA applies inline sizing styles for resizing math.
    @Input() panelClass = 'relative w-full h-64';
    @Input() startClass = 'overflow-auto';
    @Input() endClass = 'overflow-auto';
    @Input() dividerClass = '';

    // CSS variable map
    @Input() cssVars?: Record<string, string | number | null>; // --divider-width, --divider-hit-area, --min, --max

    // Outputs
    @Output() repositionEvent = new EventEmitter<Event>();
    @Output() positionChange = new EventEmitter<number>(); // convenience two-way for percentage

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['position'] && !changes['position'].firstChange) this.syncPosition();
    }
    ngAfterViewInit() {
        this.applyCssVars();
        this.syncPosition();
    }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    get computedDividerClass(): string {
        if (this.dividerClass) return this.dividerClass;
        const base = 'bg-slate-200 hover:bg-slate-300 active:bg-slate-400 transition-colors';
        const cursor = this.orientation === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize';
        const size = this.orientation === 'horizontal' ? 'h-full' : 'w-full';
        return `${base} ${cursor} ${size}`.trim();
    }

    private syncPosition() {
        const el = this.el?.nativeElement as any;
        if (!el || this.position == null) return;
        (el as any).position = this.position;
        if (!el.hasAttribute('position')) el.setAttribute('position', String(this.position));
    }

    onReposition(e: Event) {
        this.repositionEvent.emit(e);
        // attempt to read updated position prop for two-way emission
        const el = this.el?.nativeElement as any;
        if (el && typeof el.position === 'number') this.positionChange.emit(el.position);
    }

    // Public methods (access underlying element) could be added if WA exposes any future API
}

interface WaSplitPanelEl extends HTMLElement {
    position: number;
    orientation: 'horizontal' | 'vertical';
    disabled: boolean;
    primary?: 'start' | 'end';
    snap?: string;
    snapThreshold: number;
    positionInPixels?: number;
}

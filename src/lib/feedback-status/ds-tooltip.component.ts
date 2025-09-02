import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, CUSTOM_ELEMENTS_SCHEMA, HostBinding, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-tooltip: Wrapper for <wa-tooltip>
 * Slots:
 *  - default (anchor content if projected) NOTE: wrapper uses a span if [anchorRef] not provided
 *  - tooltip (content inside <wa-tooltip>) via [content] Input or projected <ng-content select="[tooltip]"></ng-content>
 *  - arrow (if underlying supports part/slot) -- future enhancement
 * Attributes / Inputs (mapped):
 *  - content: string (if simple text)
 *  - placement: top|bottom|start|end|top-start|... (passes directly)
 *  - trigger: 'hover' | 'click' | 'manual' (clickTrigger + manualTrigger convenience booleans)
 *  - distance, skidding (offset positioning)
 *  - open (manual control)
 *  - disabled
 *  - arrow (boolean) -> removes arrow when false
 *  - maxWidth (sets style --max-width custom prop or inline style)
 *  - interactive (allow pointer events)
 *  - delay (show/hide delays) planned placeholder
 *  - size: small|medium|large (applies class + CSS vars)
 *  - hint/help (for future semantics parity with inputs)
 * Events (Outputs):
 *  - showEvent, afterShowEvent, hideEvent, afterHideEvent (assuming underlying emits 'show','after-show','hide','after-hide')
 * Methods:
 *  - show(), hide(), reposition()
 * CSS Custom Properties via cssVars Input applied to host element <wa-tooltip>
 * CSS Parts (documented for consumer): base, content, arrow (future) -> not programmatically manipulated, just referenced in docs
 * Custom States: ds-tooltip-open, ds-tooltip-disabled classes on host wrapper
 */
@Component({
    selector: 'ds-tooltip',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <wa-tooltip #tooltip
    [attr.placement]="placement"
    [attr.trigger]="resolvedTrigger"
    [attr.distance]="distance ?? null"
    [attr.skidding]="skidding ?? null"
    [attr.open]="open ? '' : null"
    [attr.disabled]="disabled ? '' : null"
    [attr.arrow]="arrow ? '' : null"
    [attr.content]="content || null"
    [class]="tooltipClass"
    (show)="onShow($event)"
    (after-show)="onAfterShow($event)"
    (hide)="onHide($event)"
    (after-hide)="onAfterHide($event)"
  >
    <ng-content></ng-content>
    <ng-content select="[tooltip]"></ng-content>
  </wa-tooltip>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsTooltipComponent implements OnChanges {
    protected readonly tag = WA_TAGS.tooltip;
    @ViewChild('tooltip', { static: true }) tooltipEl!: ElementRef<HTMLElement & { show(): void; hide(): void; reposition(): void; open: boolean; }>;

    // Inputs
    @Input() content?: string; // simple text content
    @Input() placement: string = 'top';
    @Input() clickTrigger = false;
    @Input() manualTrigger = false; // manual implies consumer controls .open or calls show/hide
    @Input() distance?: number;
    @Input() skidding?: number;
    @Input() open = false; // manual open state
    @Input() disabled = false;
    @Input() arrow = true;
    @Input() maxWidth?: string; // e.g. '240px'
    @Input() interactive = false; // forwarded via css var for pointer events maybe
    @Input() delay?: number | { show: number; hide: number }; // placeholder (not applied yet)
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() hint?: string; // reserved for parity
    @Input() help?: string; // alias
    @Input() tooltipClass = '';
    @Input() cssVars?: Record<string, string | number | null>;

    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();

    // Host state classes
    @HostBinding('class.ds-tooltip-open') get openClass() { return this.open; }
    @HostBinding('class.ds-tooltip-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class') hostBase = 'inline-block align-middle';

    get resolvedTrigger(): string {
        if (this.manualTrigger) return 'manual';
        if (this.clickTrigger) return 'click';
        return 'hover';
    }

    ngAfterViewInit() {
        this.applyCssVars();
        this.applyMaxWidth();
    }
    ngOnChanges(ch: SimpleChanges): void {
        if (ch['cssVars'] && this.tooltipEl) this.applyCssVars();
        if (ch['maxWidth'] && this.tooltipEl) this.applyMaxWidth();
        if (ch['open'] && this.tooltipEl) this.syncOpen();
    }

    private syncOpen() {
        const el = this.tooltipEl?.nativeElement as any;
        if (!el) return;
        if (this.open) { try { el.show?.(); } catch { } }
        else { try { el.hide?.(); } catch { } }
    }
    private applyCssVars() {
        if (!this.cssVars) return;
        const style = this.tooltipEl.nativeElement.style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
        if (this.interactive) style.setProperty('--tooltip-pointer-events', 'auto');
    }
    private applyMaxWidth() {
        if (!this.maxWidth) return;
        const style = this.tooltipEl.nativeElement.style;
        style.setProperty('--max-width', this.maxWidth);
    }

    // Events
    onShow(e: Event) { this.open = true; this.showEvent.emit(e); }
    onAfterShow(e: Event) { this.afterShowEvent.emit(e); }
    onHide(e: Event) { this.open = false; this.hideEvent.emit(e); }
    onAfterHide(e: Event) { this.afterHideEvent.emit(e); }

    // Public methods
    show() { this.tooltipEl?.nativeElement?.show?.(); }
    hide() { this.tooltipEl?.nativeElement?.hide?.(); }
    reposition() { this.tooltipEl?.nativeElement?.reposition?.(); }
}

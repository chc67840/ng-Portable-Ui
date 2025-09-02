import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-progress-ring: Angular wrapper for <wa-progress-ring>
 * 
 * Native Web Awesome (inspected):
 *  - Attributes/Properties: value (Number, 0-100), label (string, aria-label fallback)
 *  - Slots: (default) for inner label content
 *  - CSS Custom Properties (from source):
 *      --size, --track-width, --track-color, --indicator-width, --indicator-color, --indicator-transition-duration
 *      plus internal derived: --percentage
 *  - Parts: base, label (via part="label")
 *  - Events: none custom (rely on change via attribute reflection, we emit synthetic valueChange on input updates)
 *  - Methods: none special beyond HTMLElement
 * 
 * Wrapper Enhancements:
 *  - Inputs for customizing CSS vars via strongly typed convenience props:
 *      sizePx (maps to --size), trackWidth, trackColor, indicatorWidth, indicatorColor, indicatorDuration.
 *  - "disabled" visual state (host class) - not native; prevents pointer events & lowers opacity.
 *  - showLabel boolean + computed label text fallback (value%).
 *  - labelFormatter fn Input to produce label content; otherwise uses default percent text.
 *  - cssVars passthrough object merges with generated CSS vars.
 *  - class hooks: wrapperClass, ringClass, labelClass.
 *  - Outputs: valueChange (emitted when set programmatically through wrapper), clickEvent for interactions.
 *  - Methods: focus(), blur(), setValue(v), animateTo(target,{duration,easing}) for smooth transitions.
 *  - Additional Inputs: autoAnimate (bool) to smoothly animate whenever value changes programmatically.
 *  - Custom Host State Classes: ds-progress-ring-disabled, ds-progress-ring-animating.
 */
@Component({
    selector: 'ds-progress-ring',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-progress-ring #el
      [attr.value]="value"
      [attr.label]="ariaLabel || null"
      [class]="ringClass"
      (click)="onClick($event)"
    >
      <ng-container *ngIf="showLabel">
        <span [class]="labelClass">{{ displayLabel }}</span>
      </ng-container>
      <ng-content></ng-content>
    </wa-progress-ring>
  `,
    styles: [`:host{display:inline-flex}`]
})
export class DsProgressRingComponent implements AfterViewInit, OnChanges {
    protected readonly tag = WA_TAGS.progressRing;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: number; label: string }>;

    // Core value
    @Input() value = 0; // 0-100
    @Output() valueChange = new EventEmitter<number>();

    // Accessibility label (maps to native 'label')
    @Input() ariaLabel: string | null = null;

    // Visual / dynamic enhancement inputs
    @Input() sizePx?: number; // maps to --size (e.g., 128 => '128px')
    @Input() trackWidth?: number; // --track-width (em units in native, we pass px) but we treat numeric as px
    @Input() trackColor?: string;
    @Input() indicatorWidth?: number; // --indicator-width
    @Input() indicatorColor?: string;
    @Input() indicatorDuration?: string; // e.g. '0.6s'
    @Input() disabled = false;
    @Input() showLabel = true;
    @Input() labelFormatter?: (value: number) => string;
    @Input() autoAnimate = false; // animate value changes
    @Input() animationDuration = 600; // ms
    @Input() animationEasing: (t: number) => number = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad

    // Generic styling hooks
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() wrapperClass = '';
    @Input() ringClass = '';
    @Input() labelClass = 'text-xs font-medium text-slate-600';

    // Outputs
    @Output() clickEvent = new EventEmitter<MouseEvent>();

    @HostBinding('class.ds-progress-ring-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-progress-ring-animating') animating = false;
    @HostBinding('class') hostBase = 'inline-flex';

    get displayLabel() {
        if (this.labelFormatter) return this.labelFormatter(this.value);
        return `${Math.round(this.value)}%`;
    }

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['value'] && !ch['value'].firstChange) {
            if (this.autoAnimate) {
                this.animateTo(this.value, { duration: this.animationDuration, easing: this.animationEasing });
            } else {
                this.syncValueToEl();
            }
        }
        if (['sizePx', 'trackWidth', 'trackColor', 'indicatorWidth', 'indicatorColor', 'indicatorDuration', 'cssVars'].some(k => k in ch)) {
            this.applyCssVars();
        }
    }

    private syncValueToEl() { if (this.el) (this.el.nativeElement as any).value = this.value; }

    private applyCssVars() {
        if (!this.el) return;
        const style = this.el.nativeElement.style;
        const merged: Record<string, string> = {};
        if (this.sizePx != null) merged['--size'] = typeof this.sizePx === 'number' ? this.sizePx + 'px' : String(this.sizePx);
        if (this.trackWidth != null) merged['--track-width'] = this.unit(this.trackWidth);
        if (this.trackColor) merged['--track-color'] = this.trackColor;
        if (this.indicatorWidth != null) merged['--indicator-width'] = this.unit(this.indicatorWidth);
        if (this.indicatorColor) merged['--indicator-color'] = this.indicatorColor;
        if (this.indicatorDuration) merged['--indicator-transition-duration'] = this.indicatorDuration;
        if (this.cssVars) { for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) continue; merged[k] = String(v); } }
        for (const [k, v] of Object.entries(merged)) { style.setProperty(k, v); }
    }

    private unit(v: number) { return typeof v === 'number' ? v + 'px' : String(v); }

    // API Methods
    setValue(v: number) { this.value = v; this.valueChange.emit(this.value); this.syncValueToEl(); }
    animateTo(target: number, opts?: { duration?: number; easing?: (t: number) => number }) {
        const start = this.value;
        const end = Math.max(0, Math.min(100, target));
        const duration = opts?.duration ?? this.animationDuration;
        const ease = opts?.easing ?? this.animationEasing;
        if (duration <= 0) { this.setValue(end); return; }
        const startTime = performance.now();
        this.animating = true;
        const step = (now: number) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            const eased = ease(t);
            const current = start + (end - start) * eased;
            this.value = current;
            this.syncValueToEl();
            if (t < 1) { requestAnimationFrame(step); } else { this.value = end; this.syncValueToEl(); this.animating = false; this.valueChange.emit(end); }
        };
        requestAnimationFrame(step);
    }
    focus() { this.el?.nativeElement?.focus?.(); }
    blur() { this.el?.nativeElement?.blur?.(); }

    onClick(e: MouseEvent) { this.clickEvent.emit(e); }
}
